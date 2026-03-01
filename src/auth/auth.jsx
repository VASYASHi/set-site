import React, { useReducer } from "react";
import styles from './auth.module.css';
import './auth.css';
import PassWord from '../assets/PassWord.png';
import PassWordClose from '../assets/PassWordClose.png';
import AvatarA from "../assets/AvatarA.png";
import { NavLink } from "react-router-dom";
import { AuthTransition } from "../motion/gradientTransitionAuth";



const initAuth = {
    password: false,
    PassWord: '',
    ErrorPassWord: '',
    Email: '',
    ErrorEmail: '', 
}

function reducer(state, action){
    switch(action.type){
        case'Repass':
            return {...state, password: !state.password}
        case'HendelPass':
            return {...state, PassWord: action.value, ErrorPassWord: action.value ? '' : 'Пожалуйста, заполните это поле' }
        case'HendelEmail':
            return { ...state, Email: action.value, ErrorEmail: action.value ? '' : 'Пожалуйста, заполните это поле' }
        default:
            return{...state}
    };
};

function HeadAuth(){
    const [state, dispatch] = useReducer(reducer, initAuth);

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
                    <button className="BtnAuth">Войти</button>
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