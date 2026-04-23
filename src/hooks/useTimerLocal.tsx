import React, { Dispatch } from "react";
import { useEffect } from "react";

interface SetTimer {
    type: 'ReTime';
    minutes: number;
    seconds: number;
};

interface SetForm {
    type: 'ReForm';
    status: boolean;
};

interface SetAttack {
    type: 'ReAttack';
    status: boolean
};

export function useTimerLocal (
//<ГЛАВНОЕ!!>
    stateForm: boolean, // состояние блокировки, отправки формы
    dispatch: Dispatch<SetTimer | SetForm | SetAttack>,
    // Dispatch<SetTimer> изменение времени type: 'ReTime' обязательно указывать minutes и seconds (редактировать как они будут расположенны у себя в компоненте) 
    // Dispatch<SetForm>, изменение состояние блокировки type: 'ReForm' обязательно указывать status
    // Dispatch<SetAttack>, изменение состояние блокировки после перегрузки страницы type: 'ReAttack' обязательно указывать status

    time: number, //время сколько должен длится таймер в милисекундах (можно ловить с бэка)
    nameLocal: string // название при котором мы будем хранить таймер в localStore 
//</ГЛАВНОЕ!!>
) {
    useEffect(() => {
        const remAttackData = Number(localStorage.getItem(nameLocal)); // получение даты перед перегрузкой страницы из локали 
        const nowAttackData = Date.now(); // текущая дата
            
        if(remAttackData > nowAttackData){
            dispatch({type: 'ReAttack', status: true})
            const time = remAttackData - nowAttackData;
            const minutes = Math.floor(time / 60000);//расчёт минут "округление вниз(склько осталось времени в мс / 60000)"
            const seconds = Math.floor(time % 60000 / 1000);//расчёт секунд "округление вниз(сколько осталось времени в мс /остаток/ 60000 / 1000)"
            dispatch({type: 'ReTime', minutes: minutes, seconds: seconds});
        
            const intervalTime = setInterval(() => {
                const remMs = remAttackData - Date.now();// (окончание таймера - текущее время) в мс
                const minutes = Math.floor((remMs + 100) / 60000);
                const seconds = Math.floor((remMs + 100) % 60000 / 1000);
                dispatch({type: 'ReTime', minutes: minutes, seconds: seconds});
                    
                if(remMs <= 0) {
                    dispatch({type: 'ReTime', minutes: 0, seconds: 0});
                    localStorage.removeItem(nameLocal);
                    dispatch({type: 'ReAttack', status: false});
                    clearInterval(intervalTime);
                }
            }, 1000)
        
            return () => clearInterval(intervalTime)
        } else {
            localStorage.removeItem(nameLocal);
            dispatch({type: 'ReAttack', status: false});
        }

        if(stateForm){
            const storeData = Date.now() + time; //время когда закончится истечение таймера
            localStorage.setItem(nameLocal, String(storeData)); //сохранине в локаль времени окончания 
            const minutes = Math.floor(time / 60000);//расчёт минут "округление вниз(склько осталось времени в мс / 60000)"
            const seconds = Math.floor(time % 60000 / 1000);//расчёт секунд "округление вниз(сколько осталось времени в мс /остаток/ 60000 / 1000)"
            dispatch({type: 'ReTime', minutes: minutes, seconds: seconds});//рендер таймера 'сколько осталось времни(начальное значение)'   
    
            const intervalTime = setInterval(() => {
                const remMs = storeData - Date.now();// (окончание таймера - текущее время) в мс
                const minutes = Math.floor((remMs + 100) / 60000);//расчёт минут "округление вниз(склько осталось времени через секнуду в мс / 60000)"
                const seconds = Math.floor((remMs + 100) % 60000 / 1000);//расчёт секунд "округление вниз((сколько осталось времени в мс + 100мс во избежании задержек) /остаток/ 60000 / 1000)"
                dispatch({type: 'ReTime', minutes: minutes, seconds: seconds});//рендер таймера через секунду 'сколько осталось времни(начальное значение)'
                    
                if(remMs <= 0) {
                    dispatch({type: 'ReTime', minutes: 0, seconds: 0});
                    localStorage.removeItem(nameLocal);
                    dispatch({type: 'ReForm', status: false});
                    clearInterval(intervalTime);
                }
            }, 1000);

            return () => clearInterval(intervalTime);
        }
    }, [stateForm, time, nameLocal, dispatch])
};