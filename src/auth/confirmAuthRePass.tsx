import { useCallback, useEffect, useReducer, useRef } from 'react';
import PassWord from '../assets/PassWord.png'
import PassWordClose from '../assets/PassWordClose.png'
import { useAttackUiTime } from '../hooks/hooks';

interface Status {
    status: boolean;
};

interface State {
    password: boolean;
    passwordConfirm: boolean;
    PassWord: string;
    ErrorPassWord: string;
    PassWordConfirm: string;
    ErrorPassWordConfirm: string;
    count: number;
    attack: boolean;
    loading: boolean;
};

type ActionState = 
{type: 'Repass'}|
{type: 'RepassConfirm'}|
{type: 'HendelPass', value: string}|
{type: 'HendelPassConfirm', value: string}|
{type: 'UpCount'}|
{type: 'ReCount', placeholder: number}|
{type: 'OutAuthRePass'}|
{type: 'ReLoading', status: boolean}|
{type: 'ReAttack', status: boolean}


const initState: State = {
    password: false,
    passwordConfirm: false,
    PassWord: '',
    ErrorPassWord: '',
    PassWordConfirm: '',
    ErrorPassWordConfirm: '',
    count: 0,
    attack: false,
    loading: false
};

function reducer(state: State, action: ActionState){
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
        case 'ReLoading':
            return {
                ...state, 
                loading: action.status
            }
        case 'ReAttack':
            return{
                ...state,
                attack: action.status
            }
        case 'OutAuthRePass':
            const emptyInputPass = state.PassWord.trim() === '';
            const emptyInputPassConfirm = state.PassWordConfirm.trim() === '';
            const outIfPass = state.PassWord === state.PassWordConfirm;
            const positivePassword = state.PassWord.trim().length >= 8 && state.PassWord.trim().length <= 64;
            const attackDefense = state.count >= 5;
            return {
                ...state, 
                ErrorPassWord: emptyInputPass ? 'Пожалуйста, заполните это поле' : !positivePassword ? 'Введите от 8 до 64 символов' : '',
                ErrorPassWordConfirm: emptyInputPassConfirm ? 'Пожалуйста, заполните это поле' : !outIfPass ? 'Пароль и подтверждение не совпадают' : attackDefense || state.attack ? 'Повторите попытку через несколько минут.' : '',
            }
        default:
            return{...state}
    }
};

export function ConfirmAuthRePass ({status} : Status){
    const refInputPass = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(reducer, initState);

    useAttackUiTime(
        state.count,
        dispatch,
        'lastRePassConfirmDate',
    );

    const fuData = useCallback(async() => {
        try{
                dispatch({type: 'ReLoading', status: true});
                
                const formData = {
                    password: state.PassWord.trim().replace(/ /g, '')
                }
                console.log(`Успешная сборка формы: password: ${formData.password}`)
                
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
    }, [state.PassWord]);

    const clickSetForm = useCallback(() => {
        dispatch({type: 'OutAuthRePass'});
        const hasErrorNow = state.PassWord === state.PassWordConfirm;
        const stateErrorRender = state.ErrorPassWord || state.ErrorPassWordConfirm;
        const emptyInput = state.PassWord.trim() === '';
        const positivePassword = state.PassWord.trim().length >= 8 && state.PassWord.trim().length <= 64;
        const attackDefense = state.count >= 5;
    
        if(hasErrorNow && !stateErrorRender && !emptyInput && positivePassword && !state.attack && !attackDefense){
            dispatch({type: 'UpCount'})
            fuData();
        }; 
    
    }, [ 
        state.PassWord, state.PassWordConfirm, state.attack,
        state.ErrorPassWord, state.ErrorPassWordConfirm,
        state.count ,fuData
    ])

    useEffect(() => {
        if(status){
            const id = requestAnimationFrame(() => {
                refInputPass.current?.focus();
            });
            return () => cancelAnimationFrame(id);
        }
    }, [status]);

    return(
        <form className="ConfirmAuthBlock" style={{opacity: status? '1' : '0', transition: 'opacity 1s ease', pointerEvents: status? 'auto' : 'none'}} onSubmit={(e) => {e.preventDefault(), clickSetForm()}}>
            <div className="H2Auth">Придумайте</div>
            <div className="H3Auth">новый пароль</div>
            <div className="PassAuthBlock">
                <input ref={refInputPass} disabled={!status} tabIndex={!status ? -1 : 0} value={state.PassWord} onChange={(e) => dispatch({type:'HendelPass', value: e.target.value})} style={{width: state.PassWord ? '85%' : '96%'}} type={state.password ? "text" : "password"} className="InputAuth" placeholder="Придумайте пароль"></input>
                <img onClick={() => dispatch({type:'Repass'})} className="PassImgAuth" src={state.password ? PassWord : PassWordClose}/>
            </div>
            <div className="ArgumentError">{state.ErrorPassWord}</div>
            <div className="PassAuthBlock">
                <input disabled={!status} tabIndex={!status ? -1 : 0} value={state.PassWordConfirm} onChange={(e) => dispatch({type:'HendelPassConfirm', value: e.target.value})} style={{width: state.PassWordConfirm ? '85%' : '96%'}} type={state.passwordConfirm ? "text" : "password"} className="InputAuth" placeholder="Подтвердите пароль"></input>
                <img onClick={() => dispatch({type:'RepassConfirm'})} className="PassImgAuth" src={state.passwordConfirm ? PassWord : PassWordClose}/>
            </div>
            <div className="ArgumentError">{state.ErrorPassWordConfirm}</div>
            <button disabled={!status} tabIndex={!status ? -1 : 0} className="BtnAuth BtnRegist" type="submit">Подтвердить</button>
        </form>
    );
};