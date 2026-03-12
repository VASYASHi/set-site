import React, { useCallback, useEffect, useReducer, useRef } from "react";
import styles from './auth.module.css';
import './auth.css';
import PassWord from '../assets/PassWord.png';
import PassWordClose from '../assets/PassWordClose.png';
import AvatarA from "../assets/AvatarA.png";
import { NavLink } from "react-router-dom";
import { AuthTransition } from "../motion/gradientTransitionAuth";



const initAuth = {
    password: false,
    loading: false,
    attack: false,
    count: 0, 
    PassWord: '',
    ErrorPassWord: '',
    Email: '',
    ErrorEmail: '',
}

function reducer(state, action){
    switch(action.type){
        case 'Repass':
            return {
                ...state,
                password: !state.password
            }
        case 'HendelPass':
            return {
                ...state,
                PassWord: action.value,
                ErrorPassWord: action.value ? '' : 'Пожалуйста, заполните это поле' 
            }
        case 'HendelPassLight':
            return {
                ...state,
                ErrorPassWord: 'Пожалуйста, заполните это поле' 
            }
        case 'HendelEmail':
            return { 
                ...state,
                Email: action.value,
                ErrorEmail: action.value ? '' : 'Пожалуйста, заполните это поле' 
            }
        case 'HendelEmailLight':
            return {
                ...state,
                ErrorEmail: 'Пожалуйста, заполните это поле' 
            }
        case 'ReLoading':
            return{
                ...state,
                loading: action.status
            }
        case 'UpCount':
            return{
                ...state, 
                count: state.count + 1,
            }
        case 'ReCount':
            return{
                ...state,
                count: action.placeholder
            }
        case 'ReAttack':
            return{
                ...state,
                attack: action.status, 
            }
        case 'OutRegist':
            const positiveEmail = state.Email.trim().length <= 254
            const positivePassword = state.PassWord.trim().length >= 8 && state.PassWord.trim().length <= 64
            const attackDefense = state.count >= 5
            
            return{
                ...state,
                ErrorEmail: positiveEmail ? '' : 'Введите корректный email или телефон',
                ErrorPassWord: !positivePassword ? 'Введите корректный пароль' : attackDefense || state.attack ? 'Повторите попытку через несколько минут.' : '',
            }
        default:
            return{...state}
    };
};

function HeadAuth(){
    const [state, dispatch] = useReducer(reducer, initAuth);

    const fuData = useCallback(async () => {
        try{
            dispatch({type: 'ReLoading', status: true});

            const hasLetter = /\p{L}/u.test(state.Email);

            const formData = {
                email: hasLetter ? state.Email.trim().replace(/ /g, '') : '',
                password: state.PassWord.trim().replace(/ /g, ''),
                number: hasLetter ? '' : state.Email.trim().replace(/[^0-9]/g, '')
            };
            console.log(`Успешная сборка формы: email: ${formData.email}, password: ${formData.password}, number: ${formData.number}`)

            const rec = await fetch('', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            })

            if(!rec.ok){
                throw new Error(`Ошибка сервера: ${rec.status}`);
            }

        } catch(error) {
            console.log(`Ошибки: ${error}`);
        } finally {
            dispatch({type: 'ReLoading', status: false});
        }
    }, [state.Email, state.PassWord]);

    useEffect(() => {
        if(state.count === 5){
            const storeData = String(Date.now() + 60000);
            localStorage.setItem('lastDate', storeData);
            const time = setTimeout(() => {
                localStorage.removeItem('lastDate')
                dispatch({type: 'ReCount', placeholder: 0})
            }, 60000)
            return () => clearTimeout(time)
        }
    }, [state.count])

    useEffect(() => {
        const remAttackData = Number(localStorage.getItem('lastDate'));
        const nowAttackData = Date.now();
        if(remAttackData && remAttackData > nowAttackData){
            dispatch({type: 'ReAttack', status: true})
            const time = remAttackData - nowAttackData;
            const timeOut = setTimeout(() => {
                dispatch({type: 'ReCount', placeholder: 0})
                dispatch({type: 'ReAttack', status: false})
            }, time);
            return () => clearTimeout(timeOut)
        } else {
            localStorage.removeItem('lastDate')
            dispatch({type: 'ReCount', placeholder: 0})
            dispatch({type: 'ReAttack', status: false})
        }
    }, [])

    const clickGetForm = useCallback(() => {
        dispatch({type: 'OutRegist'})
        const hasEmpty = state.Email.trim() === '' || state.PassWord.trim() === ''
        const positiveEmail = state.Email.trim().length <= 254
        const positivePassword = state.PassWord.trim().length >= 8 && state.PassWord.trim().length <= 64
        const attackDefense = state.count >= 5

        if(!hasEmpty && positiveEmail && positivePassword && !attackDefense && !state.attack){
            dispatch({type: 'UpCount'})
            console.log(state.count)
            fuData()
        } else {
        if (state.Email.trim() === ''){
            dispatch({type: 'HendelEmailLight'})
        }
        if (state.PassWord.trim() === ''){
            dispatch({type: 'HendelPassLight'})
        }
        }
    }, [state.PassWord, state.Email, state.count, state.attack , fuData])

    return(
        <div className={styles["Head-block"]}>
            <main>
                <AuthTransition>
                {/* <div className={`${styles.Auth} ${styles.AuthFontsAnim}`}> */}
                    <div className="H2Auth">Вход</div>
                    <div className="H3Auth">в учётную запись</div>
                    <input value={state.Email} onChange={(e) => dispatch({type:'HendelEmail', value: e.target.value})} className="InputAuth" placeholder="Почта/Телефон"></input>
                    <div className="ArgumentError">{state.ErrorEmail}</div>
                    <div className="PassAuthBlock">
                        <input value={state.PassWord} onChange={(e) => dispatch({type:'HendelPass', value: e.target.value})} style={{width: state.PassWord ? '85%' : '96%'}} type={state.password ? "text" : "password"} className="InputAuth" placeholder="Пароль"></input>
                        <img onClick={() => dispatch({type:'Repass'})} className="PassImgAuth" src={state.password ? PassWord : PassWordClose}/>
                    </div>
                    <div className="ArgumentError">{state.ErrorPassWord}</div>
                    <a className="BtnLinkReg" style={{marginLeft:'-50%'}}>Забыли пароль?</a>
                    <button className="BtnAuth" onClick={clickGetForm}>Войти</button>
                    <NavLink to='/regist' end className="BtnLinkReg">Нет аккаунта?</NavLink>
                {/* </div> */}
                </AuthTransition>

                <div className="quoteAuth">
                    <img className="quoteImgAuth" src={AvatarA} alt="Grape"/>
                    <p>Мы ценим вашу конфиденциальность. Вход означает согласие с использованием cookies.</p>
                </div>
            </main>
        </div>
    )
};

export default function Auth(){
    return(
        <HeadAuth/>
    )
};