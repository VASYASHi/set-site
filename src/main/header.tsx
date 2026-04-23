import React, { useReducer, useRef } from "react";
import './header.css'
import Button from "../buttons/Button";
import Avatar from "../assets/Avatar.png";
import AvatarA from "../assets/AvatarA.png";
import { useClickOutside } from "../hooks/hooks";
import { useThemeContext } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

interface StateReducer {
    open: boolean
    search: string
}

type ActionReducer = 
    {type: 'ReOPEN'}|
    {type: 'FalOPEN'}|
    {type: 'HendelSearch', value: string}

const initState: StateReducer = {
    open: false,
    search: ''
}

function reducer (state: StateReducer, action: ActionReducer){
    switch(action.type){
        case 'ReOPEN' :
            return {
                ...state,
                open: !state.open 
            };
        case 'FalOPEN' :
            return {
                ...state,
                open: false
            };
        case 'HendelSearch':
            return {
                ...state,
                search: action.value
            }; 
        default: 
            return {...state}
    }
};

export default function Header(){
    const {stateTheme} = useThemeContext()
    const [state, dispatch] = useReducer(reducer, initState);
    const refMenu = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);
    useClickOutside(refMenu, () => dispatch({type:'FalOPEN'}), btnRef)
    return(
        <header>
            <Button>Главная</Button>
            <Button>Лента</Button>
            <Button>О нас</Button>
            <input value={state.search} onChange={(e) => dispatch({type:'HendelSearch', value: e.target.value})}></input>
            <div ref={btnRef} onClick={() => dispatch({type:'ReOPEN'})} className="Avatar">
               <img className="ImgAvatar" src={stateTheme.account ? AvatarA : Avatar} alt="Menu"/>
            </div>
            {state.open && <div ref={refMenu} className="Menu">
                <div style={{marginTop:'12%'}} className="BtnM">Главная</div>
                <div className="BtnM">Лента</div>
                <div className="BtnM">О нас</div>
                <div className="AvatarM">
                    <img className="ImgAvatar" src={stateTheme.account ? AvatarA : Avatar} alt="Menu"/>
                </div>
                {!stateTheme.account && <NavLink to='/auth' end className="BtnLog">Войти</NavLink>}
                {!stateTheme.account && <NavLink to='/regist' end className="BtnLog Reg">Зарегистроваться</NavLink>}
                {stateTheme.account && <div className="BtnLog Rem">Выйти</div>}
            </div>}            
        </header>      
    )
};