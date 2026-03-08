import React, { useCallback, useEffect, useReducer } from "react";
import styles from './auth.module.css';
import PassWord from '../assets/PassWord.png'
import PassWordClose from '../assets/PassWordClose.png'
import AvatarA from "../assets/AvatarA.png";
import './auth.css';
import './regist.css'
import { NavLink } from "react-router-dom";
import { RegistTransition } from "../motion/gradientTransitionAuth";

const initRegist = {
    password: false,
    PassWord: '',
    ErrorPassWord: '',
    PassWordConfirm: '',
    ErrorPassWordConfirm: '',
    passwordConfirm: false,
    Email: '',
    ErrorEmail: '',     
    loading: false,
};

function reducer(state, action){
    switch(action.type){
        case 'Repass':
            return {
                ...state,
                password: !state.password
            }
        case 'RepassConfirm':
            return {
                ...state,
                passwordConfirm: !state.passwordConfirm
            }
        case 'HendelPass':
            return {
                ...state, 
                PassWord: action.value, 
                ErrorPassWord: action.value ? '' : 'Пожалуйста, заполните это поле' 
            }
        case 'HendelPassConfirm':
            return {
                ...state, 
                PassWordConfirm: action.value,  
                ErrorPassWordConfirm: action.value ? '' : 'Пожалуйста, заполните это поле'
            }
        case 'OutRegist':
            const outIfPass = state.PassWord === state.PassWordConfirm;
            const positivePassword = state.PassWord.trim().length >= 8 && state.PassWord.trim().length <= 64
            return {
                ...state, 
                ErrorPassWord: positivePassword ? '' : 'Минимум 8 символов',
                ErrorPassWordConfirm: outIfPass ? '' : 'Пароль и подтверждение не совпадают' 
            }
        case 'HendelEmail':
            return { 
                ...state, 
                Email: action.value, ErrorEmail: action.value ? '' : 'Пожалуйста, заполните это поле' 
            }
        case 'ReLoading':
            return {
                ...state, 
                loading: action.status
            }
        default:
            return{...state};
    }
};

function HeadRegist(){
    const [state, dispatch] = useReducer(reducer, initRegist);

    const fuData = useCallback( async () => {
    try{
        dispatch({type: 'ReLoading', status: true});
        
        const hasLetter = /\p{L}/u.test(state.Email)
        const formData = {
            email: hasLetter ? state.Email.trim().replace(/ /g, '') : '',
            password: state.PassWord.trim(),
            number: hasLetter ? '' : state.Email.trim().replace(/[^0-9]/g, '')
        }
        console.log(`Успешная сборка формы: email: ${formData.email}, password: ${formData.password}, number: ${formData.number}`)
        
        const rec = await fetch('', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if(!rec.ok){
            throw new Error(`Ошибка сервера: ${rec.status}`)
        };
        
    } catch (error) {
        console.log(error)
    } finally {
        dispatch({type: 'ReLoading', status: false})
    }
    }, [state.Email, state.PassWord])

    const clickSetForm = useCallback(() => {
        dispatch({type: 'OutRegist'});
        const hasErrorNow = state.PassWord === state.PassWordConfirm
        const stateErrorRender = state.ErrorEmail || state.ErrorPassWord || state.ErrorPassWordConfirm
        const emptyInput = state.Email.trim() === ''|| state.PassWord.trim() === ''
        const positivePassword = state.PassWord.trim().length >= 8 && state.PassWord.trim().length <= 64

        if(hasErrorNow && !stateErrorRender && !emptyInput && positivePassword){
            fuData();
        }
    }, [ 
        state.Email, state.PassWord, state.PassWordConfirm,
        state.ErrorEmail, state.ErrorPassWord, state.ErrorPassWordConfirm,
        fuData
        ])

    return(
        <div className={styles['Head-block']}>
            <main className="RegistEnd">
                <div className="quoteAuth RegistQuoteAuth">
                    <img className="quoteImgAuth" src={AvatarA} alt="Grape"/>
                    <p>Мы ценим вашу конфиденциальность. Вход означает согласие с использованием cookies.</p>
                </div>
                <RegistTransition>
                {/* <div className="Regist"> */}
                    <div className="H2Auth">Регистрация</div>
                    <div className="H3Auth">учётной записи</div>
                    <input value={state.Email} onChange={(e) => dispatch({type:'HendelEmail', value: e.target.value})} className="InputAuth" placeholder="Ваша Почта/Телефон"></input>
                    <div className="ArgumentError">{state.ErrorEmail}</div>
                    <div className="PassAuthBlock">
                        <input value={state.PassWord} onChange={(e) => dispatch({type:'HendelPass', value: e.target.value})} style={{width: state.PassWord ? '85%' : '96%'}} type={state.password ? "text" : "password"} className="InputAuth" placeholder="Придумайте пароль"></input>
                        <img onClick={() => dispatch({type:'Repass'})} className="PassImgAuth" src={state.password ? PassWord : PassWordClose}/>
                    </div>
                    <div className="ArgumentError">{state.ErrorPassWord}</div>
                    <div className="PassAuthBlock">
                        <input value={state.PassWordConfirm} onChange={(e) => dispatch({type:'HendelPassConfirm', value: e.target.value})} style={{width: state.PassWordConfirm ? '85%' : '96%'}} type={state.passwordConfirm ? "text" : "password"} className="InputAuth" placeholder="Подтвердите пароль"></input>
                        <img onClick={() => dispatch({type:'RepassConfirm'})} className="PassImgAuth" src={state.passwordConfirm ? PassWord : PassWordClose}/>
                    </div>
                    <div className="ArgumentError">{state.ErrorPassWordConfirm}</div>
                    <button className="BtnAuth BtnRegist" onClick={clickSetForm}>Зарегистрироваться</button>
                    <NavLink to='/auth' end className="BtnLinkReg">Есть аккаунт?</NavLink>
                {/* </div> */}
                </RegistTransition>
            </main>
        </div>
    )
};

export default function Regist(){
    return(
        <HeadRegist/>
    )
};