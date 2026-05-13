import React, { CSSProperties, Dispatch, KeyboardEvent, useCallback, useEffect, useReducer, useRef } from "react";
import { useAttackUiTime } from "../hooks/hooks";

type ReStatus = 
{type: 'ReStatusForms', status: boolean} 

type ReStatusFormRePass = 
{type: 'ReStatusFormRePass', status: boolean}

interface Status {
    status?: boolean;
    statusFormRePass?: boolean;
    time?: string | null;
    dispatchStatusForm: Dispatch<ReStatus>;
    dispatchStatusFormRePass: Dispatch<ReStatusFormRePass>;
    clickSetForm: () => void
}


interface State {
    count: number;
    fullCode: string;
    errorCode: string;
    loading: boolean;
    stateForm: boolean;
    attack: boolean;
    borderInputs: number;
    colorInputs: string | null;
}

type ActionState =
{type: 'HendelCodeFull', payload: {index: number; value: string; allValue?: boolean}} |
{type: 'ReCount', placeholder: number}|
{type: 'UpCount'}|
{type: 'ReLoading', status: boolean}|
{type: 'ReForm', status: boolean}|
{type: 'ReAttack', status: boolean}|
{type: 'ReBorderInputs', payload: number}|
{type: 'ReColorInputs', status: 'error' | 'good' | null}

const initState: State = {
    count: 0,
    fullCode: '',
    errorCode: '',
    loading: false,
    stateForm: false,
    attack: false,
    borderInputs: 0,
    colorInputs: null
}

function reducer (state: State , action: ActionState){
    switch(action.type){
        case 'HendelCodeFull':
            const {index, value, allValue} = action.payload
            
            if (index < 0) return state;

            const newStatusStr = 
                state.fullCode.slice(0, index) +
                value +
                state.fullCode.slice(index + 1)

            return {
                ...state,
                fullCode: allValue ? value : newStatusStr,
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
        case 'ReAttack': 
            return {
                ...state,
                attack: action.status
            }
        case 'UpCount':
            return {
                ...state, 
                count: state.count + 1,
            }
        case 'ReCount':
            return {
                ...state,
                count: action.placeholder
            }
        case 'ReBorderInputs':
            return {
                ...state,
                borderInputs: action.payload
            }
        case 'ReColorInputs':
            const color = 
            action.status === 'good' ? '0.11em solid rgb(41, 224, 31)' :
            action.status === 'error' ? '0.11em solid rgb(232, 26, 50)' :
            null

            return {
                ...state,
                colorInputs: color
            }
        default: 
            return {...state}
    }
};

export function ConfirmAuthCode ({status, statusFormRePass, time, dispatchStatusForm, dispatchStatusFormRePass, clickSetForm}: Status) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const [state, dispatch] = useReducer(reducer, initState);

    useAttackUiTime(
        state.count,
        dispatch,
        'lastCodeConfirmDate',
        3,
        5000
    )
    
    const fuData = useCallback(async() => {  
            try {
                dispatch({type: 'ReLoading', status: true});

                const formData = {
                    code: state.fullCode
                };

                console.log(`Успешная сборка формы: code: ${formData.code}`)

                const rec = await fetch('', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({formData})
                });

                if(!rec.ok){
                    dispatch({type: 'ReColorInputs', status: 'good'});
                    throw new Error(`Ошибка сервера: ${rec.status}`);
                };
            } catch(error) {
                console.log(`Ошибки: ${error}`);
            } finally {
                dispatch({type: 'ReLoading', status: false});
            }
    }, [state.fullCode])

    
    const hendelKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if(e.key === 'Backspace' && !state.fullCode[index] && index > 0){
            inputRefs.current[index - 1]?.focus()
        };
    };
    
    const hendelOnPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        
        const paste = e.clipboardData.getData('text').trim().slice(0, 4).replace(/[^0-9]/g, '')
        
        if(paste.length === 4){
            dispatch({type: 'HendelCodeFull', payload:{index: 0, value: paste[0]}});
            dispatch({type: 'HendelCodeFull', payload:{index: 1, value: paste[1]}});
            dispatch({type: 'HendelCodeFull', payload:{index: 2, value: paste[2]}});
            dispatch({type: 'HendelCodeFull', payload:{index: 3, value: paste[3]}});
        } else if (paste.length > 0){
            paste.split('').forEach((element, index) => {
                dispatch({type: 'HendelCodeFull', payload:{index: index, value: element}});
            })
            setTimeout(() => {inputRefs.current[paste.length]?.focus()}, 0)
        };
    };
    
    
    const setClickForm = useCallback(() => {
        const attackDefense = state.count >= 3;
        if(!state.attack && !attackDefense){
            dispatch({type: 'UpCount'})
            fuData()
        }
    }, [state.count, fuData]);
    
    useEffect(() => {
        if(status && !state.fullCode){
            const id = requestAnimationFrame(() => {
                inputRefs.current[0]?.focus()
            })
            return () => cancelAnimationFrame(id);
        }
        if (state.fullCode.length === 4) {
            setClickForm();
        }
    }, [status, state.fullCode]);

    useEffect(() => {
        if(state.loading){
            inputRefs.current[3]?.blur();
            let count: number = 1;
            dispatch({type: 'ReBorderInputs', payload: count});
            const interval = setInterval(() => {
                if(count < 4) {
                    count ++
                    dispatch({type: 'ReBorderInputs', payload: count});
                } else {
                    count = 1
                    dispatch({type: 'ReBorderInputs', payload: count}); // Разблокать после подключения бэка
                    // dispatch({type: 'ReLoading', status: false}); // Убарть после подключения бэка
                }
            }, 210);
            return () => {
                // dispatch({type: 'ReColorInputs', status: 'good'});
                dispatch({type: 'ReBorderInputs', payload: 0});
                clearInterval(interval);
            };
        };
    }, [state.loading]);

    useEffect(() => {
        if(state.colorInputs === '0.11em solid rgb(232, 26, 50)'){
            const id = setTimeout(() => {
                dispatch({type: 'ReColorInputs', status: null})
            }, 600)
            return () => clearTimeout(id);
        } else if (state.colorInputs === '0.11em solid rgb(41, 224, 31)'){
            const id = setTimeout(() => {
                dispatch({type: 'HendelCodeFull', payload:{index: 0, value: '', allValue: true}});
                dispatchStatusFormRePass({type: 'ReStatusFormRePass', status: true});
            }, 500)
            return () => clearTimeout(id);
        }
    }, [state.colorInputs])

    return(
        <form className="ConfirmAuthBlock" style={{opacity: status && !statusFormRePass ? '1' : '0', transition: 'opacity 1s ease', pointerEvents: status && !statusFormRePass? 'auto' : 'none'}} onSubmit={(e) => {e.preventDefault(); setClickForm()}}>
            <div className="H2Auth">Введите</div>
            <div className="H3Auth">код доступа</div>
            <div className="CodeConfirmInputsBox">
                <input
                    ref={el => {inputRefs.current[0] = el}}
                    value={state.fullCode[0] ?? ''} 
                    onChange={(e) => {
                        const char = e.target.value.slice(0, 1).replace(/[^0-9]/g, '')
                        dispatch({type: 'HendelCodeFull', payload: {index: 0, value: char}})

                        if(char){
                            inputRefs.current[0 + 1]?.focus()
                        }
                    }}
                    onKeyDown={e => hendelKeyDown(e, 0)}
                    onPaste={(e) => hendelOnPaste(e)}
                    disabled={!status || statusFormRePass || state.loading} 
                    tabIndex={!status || statusFormRePass || state.loading ? -1 : 0} 
                    maxLength={1} 
                    inputMode="numeric" 
                    style={{border: state.borderInputs === 1 ? '0.11em solid rgb(0, 98, 255)' : state.colorInputs ? state.colorInputs : '0.09em solid rgb(44, 153, 255)'}}
                    className="CodeConfirmInputs"
                />
                <input 
                    ref={el => {inputRefs.current[1] = el}} 
                    value={state.fullCode[1] ?? ''} 
                    onChange={(e) => {
                        const char = e.target.value.slice(0, 1).replace(/[^0-9]/g, '')
                        dispatch({type: 'HendelCodeFull', payload: {index: 1, value: char}})

                        if(char){
                            inputRefs.current[2]?.focus()
                        }
                    }} 
                    onKeyDown={e => hendelKeyDown(e, 1)}
                    onPaste={(e) => hendelOnPaste(e)}
                    disabled={!status || statusFormRePass || state.loading} 
                    tabIndex={!status || statusFormRePass || state.loading ? -1 : 0} 
                    maxLength={1} 
                    inputMode="numeric"
                    style={{border: state.borderInputs === 2 ? '0.11em solid rgb(0, 98, 255)' : state.colorInputs ? state.colorInputs : '0.09em solid rgb(44, 153, 255)'}} 
                    className="CodeConfirmInputs"
                />
                <input 
                    ref={el => {inputRefs.current[2] = el}} 
                    value={state.fullCode[2] ?? ''} 
                    onChange={(e) => {
                        const char = e.target.value.slice(0, 1).replace(/[^0-9]/g, '')
                        dispatch({type: 'HendelCodeFull', payload: {index: 2, value: char}})

                        if(char){
                            inputRefs.current[3]?.focus()
                        }
                    }} 
                    onKeyDown={e => hendelKeyDown(e, 2)}
                    onPaste={(e) => hendelOnPaste(e)}
                    disabled={!status || statusFormRePass || state.loading} 
                    tabIndex={!status || statusFormRePass || state.loading ? -1 : 0} 
                    maxLength={1} 
                    inputMode="numeric"
                    style={{border: state.borderInputs === 3 ? '0.11em solid rgb(0, 98, 255)' : state.colorInputs ? state.colorInputs : '0.09em solid rgb(44, 153, 255)'}} 
                    className="CodeConfirmInputs"
                />
                <input 
                    ref={el => {inputRefs.current[3] = el}} 
                    value={state.fullCode[3] ?? ''} 
                    onChange={(e) => {
                        const char = e.target.value.slice(0, 1).replace(/[^0-9]/g, '')
                        dispatch({type: 'HendelCodeFull', payload: {index: 3, value: char}})

                    }} 
                    onKeyDown={e => hendelKeyDown(e, 3)}
                    onPaste={(e) => hendelOnPaste(e)}
                    disabled={!status || statusFormRePass || state.loading} 
                    tabIndex={!status || statusFormRePass || state.loading ? -1 : 0} 
                    maxLength={1} 
                    inputMode="numeric"
                    style={{border: state.borderInputs === 4 ? '0.11em solid rgb(0, 98, 255)' : state.colorInputs ? state.colorInputs : '0.09em solid rgb(44, 153, 255)'}} 
                    className="CodeConfirmInputs"
                />
            </div>
            <button
                className="BtnAuth BtnConfirmAuth BtnConfirmAuthCode"
                style={{
                    '--hover-color': time ? 'rgba(182, 46, 66, 0.87)' : 'rgba(46, 114, 182, 0.869)',
                    '--active-color': time ? 'rgba(206, 49, 73, 0.94)' : 'rgba(49, 128, 206, 0.942)',
                } as CSSProperties}
                disabled={!status || statusFormRePass} 
                tabIndex={!status || statusFormRePass ? -1 : 0}
                onClick={clickSetForm}
                type="button" 
            >
                Отправить заново&nbsp;{time}
            </button>
            <button 
                disabled={!status || statusFormRePass} 
                tabIndex={!status || statusFormRePass ? -1 : 0} 
                className="BtnAuthConfirmCode" 
                onClick={() => {dispatchStatusForm({type: 'ReStatusForms', status: false})}}
                type="button" 
            >
                Назад?
            </button>
        </form>
    )
};