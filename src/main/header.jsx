import React, { useContext, useReducer, useRef } from "react";
import './header.css'
import Button from "../buttons/Button";
import Avatar from "../assets/Avatar.png";
import AvatarA from "../assets/AvatarA.png";
import { useClickOutside } from "../hooks/hooks";
import { ThemeContext } from "../context/ThemeContext";
import { NavLink } from "react-router-dom";

function reducer (state, action){
    switch(action.type){
        case 'ReOPEN' :
            return { open: !state.open };
        case 'FalOPEN' :
            return {open: false};
        default: 
            return {...state}
    }
};

export default function Header(){
    const {stateTheme} = useContext(ThemeContext)
    const [state, dispatch] = useReducer(reducer, {open: false});
    const refMenu = useRef(null);
    const btnRef = useRef(null);
    useClickOutside(refMenu, () => dispatch({type:'FalOPEN'}), btnRef)
    return(
        <header>
            <Button>Главная</Button>
            <Button>Лента</Button>
            <Button>О нас</Button>
            <input></input>
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