import React, { useCallback, useReducer, useEffect, CSSProperties } from "react";
import styles from './auth.module.css';
import './confirmAuth.css'
import AvatarA from "../assets/AvatarA.png";
import { NavLink } from "react-router-dom";
import { ConfirmAuthTransition } from "../motion/gradientTransitionAuth";
import { useTimerLocal } from "../hooks/useTimerLocal";
import { time } from "framer-motion";

interface State {
    email: string
    errorEmail: string 
    loading: boolean  
    stateForm: boolean
    time: string | null
    attack: boolean
}

type ActionState =
{type: 'HendelEmail', value: string} |
{type: 'OutConfirm'}|
{type: 'ReLoading', status: boolean}|
{type: 'ReForm', status: boolean}|
{type: 'ReTime', minutes: number, seconds: number}|
{type: 'ReAttack', status: boolean}

const initState: State = {
    email: '',
    errorEmail: '',
    loading: false,
    stateForm: false,
    time: null,
    attack: false
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
    80000,
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
        dispatch({type: 'ReForm', status: true})
        fuData()
    } 

}, [state.email, state.stateForm, state.attack, fuData]);

    return(
        <form className={styles["Head-block"]} onSubmit={(e) => {e.preventDefault(); clickSetForm()}}>
            <main className="RegistEnd">
                <div className="quoteAuth RegistQuoteAuth">
                    <img className="quoteImgAuth" src={AvatarA} alt="Grape"/>
                    <p>Мы ценим вашу конфиденциальность. Вход означает согласие с использованием cookies.</p>
                </div>
                <ConfirmAuthTransition>
                    <div className="H2Auth">Восстановление</div>
                    <div className="H3Auth">забытого пароля</div>
                    <input value={state.email} onChange={(e) => dispatch({type: 'HendelEmail', value: e.target.value})} className="InputAuth" placeholder="Почта/Телефон"></input>
                    <div className="ArgumentError">{state.errorEmail}</div>
                    <div className="TimeFormAuthConfirm"
                        style={{opacity: state.stateForm || state.attack ? '1' : '0'}}>
                        <div style={{marginRight:'2%'}}>Отправить повторно:</div>
                        {state.time}
                    </div>
                    <button 
                        style={{
                            '--hover-color': state.stateForm || state.attack ? 'rgba(182, 46, 66, 0.87)' : 'rgba(46, 114, 182, 0.869)',
                            '--active-color': state.stateForm || state.attack ? 'rgba(206, 49, 73, 0.94)' : 'rgba(49, 128, 206, 0.942)',
                            transform: `translateY(${state.errorEmail ? '50%' : '0%'})`
                        } as CSSProperties} 
                        disabled={state.stateForm || state.attack} className="BtnAuth BtnConfirmAuth" 
                        type="submit"
                    >
                        Отправить код
                    </button>
                    <NavLink to='/auth' end className="BtnLinkReg BtnLinkPasswordConfirm"  style={{transform: `translateY(${state.errorEmail ? '70%' : '0%'})`}}>Вернуться назад?</NavLink>
                    <div className="CodeConfirmInputsBox" style={{display:'none'}}>
                        <input maxLength={1} inputMode="numeric" className="CodeConfirmInputs" style={{marginLeft: '0%'}}/>
                        <input maxLength={1} inputMode="numeric" className="CodeConfirmInputs"/>
                        <input maxLength={1} inputMode="numeric" className="CodeConfirmInputs"/>
                        <input maxLength={1} inputMode="numeric" className="CodeConfirmInputs"/>
                    </div>
                </ConfirmAuthTransition>
            </main>
        </form>
    )
};