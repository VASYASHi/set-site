import React, { useCallback, useReducer, useEffect, CSSProperties } from "react";
import styles from './auth.module.css';
import './confirmAuth.css'
import AvatarA from "../assets/AvatarA.png";
import { NavLink, Outlet } from "react-router-dom";
import { ConfirmAuthTransition } from "../motion/gradientTransitionAuth";
import { useTimerLocal } from "../hooks/useTimerLocal";
import { time } from "framer-motion";
import { ConfirmAuthCode } from "./confirmAuthCode";
import { ConfirmAuthRePass } from "./confirmAuthRePass";

interface State {
    email: string;
    errorEmail: string;
    loading: boolean;  
    stateForm: boolean;
    time: string | null;
    attack: boolean;
    statusForms: boolean; //////
    statusFormRePass: boolean; //////
}

type ActionState =
{type: 'HendelEmail', value: string} |
{type: 'OutConfirm'}|
{type: 'ReLoading', status: boolean}|
{type: 'ReForm', status: boolean}|
{type: 'ReTime', minutes: number, seconds: number}|
{type: 'ReAttack', status: boolean}|
{type: 'ReStatusForms', status: boolean}|
{type: 'ReStatusFormRePass', status: boolean}

const initState: State = {
    email: '',
    errorEmail: '',
    loading: false,
    stateForm: false,
    time: null,
    attack: false,
    statusForms: false, //////
    statusFormRePass: false //////
}

function reducer (state: State , action: ActionState){
    switch(action.type){
        case 'HendelEmail': 
            return {
                ...state,
                email: action.value,
                errorEmail: action.value ? '' : 'Пожалуйста, заполните это поле'
            }
        case 'ReLoading':
            return {
                ...state,
                loading: action.status
            }
        case 'ReForm': 
            return {
                ...state,
                stateForm: action.status
            }
        case 'ReTime':
            return {
                ...state,
                time: 
                !action.minutes && !action.seconds ? null :
                action.minutes ? `${action.minutes}:${action.seconds <= 9 ? `0${action.seconds}` :
                `${action.seconds}`}` : `${action.seconds}`
            }
        case 'ReAttack': 
            return {
                ...state,
                attack: action.status
            }
        case 'ReStatusForms':
            return {
                ...state,
                statusForms: action.status
            }
        case 'ReStatusFormRePass':
            return {
                ...state,
                statusFormRePass: action.status,
                statusForms: false
            }
        case 'OutConfirm':
            const hasEmpty = state.email.trim() === '';
            const positiveEmail = state.email.trim().length <= 254;
            return {
                ...state,
                errorEmail: hasEmpty ? 'Пожалуйста, заполните это поле' : !positiveEmail ? 'Введите корректный email или телефон' : '', 
            }
        default: 
            return {...state}
    }
};

export default function ConfirmAuth(){
const [state, dispatch] = useReducer(reducer, initState);
useTimerLocal(
    state.stateForm,
    dispatch,
    8000,
    'lastConfirmAuthDate',
);

const fuData = useCallback(async() => {
    try {
        dispatch({type: 'ReLoading', status: true})

        const hasLetter = /\p{L}/u.test(state.email);

        const formData = {
            email: hasLetter ? state.email.trim().replace(/ /g, '') : '',
            number: hasLetter ? '' : state.email.trim().replace(/[^0-9]/g, '')
        }

        console.log(`Успешная сборка формы: email: ${formData.email}, number: ${formData.number}`)

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
        dispatch({type: 'ReLoading', status: false})
    }
}, [state.email]);

const clickSetForm = useCallback(() => {
    dispatch({type: 'OutConfirm'})

    const hasEmpty = state.email.trim() === ''
    const positiveEmail = state.email.trim().length <= 254

    if(!hasEmpty && positiveEmail && !state.stateForm && !state.attack){
        dispatch({type: 'ReForm', status: true});
        fuData();
        dispatch({type: 'ReStatusForms', status: true});
    } 

}, [state.email, state.stateForm, state.attack, fuData]);

    return(
        <div className={styles["Head-block"]}>
            <main className="RegistEnd">
                <div className="quoteAuth RegistQuoteAuth">
                    <img className="quoteImgAuth" src={AvatarA} alt="Grape"/>
                    <p>Мы ценим вашу конфиденциальность. Вход означает согласие с использованием cookies.</p>
                </div>
                <ConfirmAuthTransition>
                    <form 
                        className="ConfirmAuthBlock"
                        style={{opacity: !state.statusForms && !state.statusFormRePass? '1' : '0', transition: 'opacity 1s ease', pointerEvents: !state.statusForms && !state.statusFormRePass? 'auto' : 'none'}} 
                        onSubmit={(e) => {e.preventDefault(); clickSetForm()}}
                    >
                        <div className="H2Auth">Восстановление</div>
                        <div className="H3Auth">забытого пароля</div>
                        <input autoFocus value={state.email} disabled={state.statusForms || state.statusFormRePass} tabIndex={state.statusForms || state.statusFormRePass ? -1 : 0} onChange={(e) => dispatch({type: 'HendelEmail', value: e.target.value})} className="InputAuth" placeholder="Почта/Телефон"></input>
                        <div className="ArgumentError">{state.errorEmail}</div>
                        <div className="TimeFormAuthConfirm"
                            style={{opacity: state.stateForm || state.attack ? '1' : '0'}}
                        >
                            <div style={{marginRight:'2%'}}>Отправить повторно:</div>
                            {state.time}
                        </div>
                        <button 
                            style={{
                                '--hover-color': state.stateForm || state.attack ? 'rgba(182, 46, 66, 0.87)' : 'rgba(46, 114, 182, 0.869)',
                                '--active-color': state.stateForm || state.attack ? 'rgba(206, 49, 73, 0.94)' : 'rgba(49, 128, 206, 0.942)',
                                transform: `translateY(${state.errorEmail ? '50%' : '0%'})`
                            } as CSSProperties} 
                            disabled={state.statusForms || state.statusFormRePass || state.stateForm || state.attack} 
                            className="BtnAuth BtnConfirmAuth" 
                            tabIndex={state.statusForms ? -1 : 0}
                            type="submit"
                        >
                            Отправить код
                        </button>
                        <NavLink tabIndex={state.statusForms || state.statusFormRePass ? -1 : 0} to='/auth' end className="BtnLinkReg BtnLinkPasswordConfirm"  style={{transform: `translateY(${state.errorEmail ? '70%' : '0%'})`}}>Вернуться назад?</NavLink>
                    </form>
                    <ConfirmAuthCode clickSetForm={clickSetForm} status={state.statusForms} time={state.time} dispatchStatusForm={dispatch} dispatchStatusFormRePass={dispatch}/>
                    <ConfirmAuthRePass status={state.statusFormRePass}/>
                </ConfirmAuthTransition>
            </main>
        </div>
    )
};