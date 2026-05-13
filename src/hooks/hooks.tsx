import React, { Dispatch, RefObject, useEffect } from "react";

/// Хук для закрытия элемента через эвент вне его(клик за пределами элемента);
export function useClickOutside<T extends HTMLElement>(ref : RefObject<T | null>, fuOut: (e: MouseEvent) => void, refBtn?: RefObject<T | null>){
    useEffect(() => {
        const fuClickIfout = (event: MouseEvent) => {
            if(!ref.current || ref.current.contains(event.target as Node)) return;

            if(refBtn && refBtn.current && refBtn.current.contains(event.target as Node)) return;

            fuOut(event)
        };
        document.addEventListener('mousedown', fuClickIfout);
        return () => document.removeEventListener('mousedown', fuClickIfout);
    }, [ref, fuOut, refBtn])
};



interface SetAttack {
    type: 'ReAttack';
    status: boolean;
};

interface SetCount {
    type: 'ReCount';
    placeholder: number;
}
/// Хук для ui защиты от спама отправки формы в авторизации
export function useAttackUiTime (
    stateCount: number,
    dispatch: Dispatch<SetAttack | SetCount>,
    localStoreName: string,
    shipments?: number, 
    timeBlocked?: number
){
    useEffect(() => {
        if(stateCount === (shipments ?? 5)){
            const storeData = String(Date.now() + (timeBlocked ?? 60000));
            localStorage.setItem(localStoreName, storeData);
            const time = setTimeout(() => {
                localStorage.removeItem(localStoreName)
                dispatch({type: 'ReCount', placeholder: 0})
            }, (timeBlocked ?? 60000))
            return () => clearTimeout(time)
        }
    }, [stateCount])
    
    useEffect(() => {
        const remAttackData = Number(localStorage.getItem(localStoreName));
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
            localStorage.removeItem(localStoreName)
            dispatch({type: 'ReCount', placeholder: 0})
            dispatch({type: 'ReAttack', status: false})
        }
    }, [])
};