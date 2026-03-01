import React, { useReducer } from "react";

export const ThemeContext = React.createContext(null);

const initState = {
    account: false,
}

function reducer(state, action){
    switch(action.type){
        case 'TrACCOUNT':
            return { account: true }
        default:
            return {...state}
    }
}

export default function ThemeProvider ({children}){
    const [stateTheme, dispatchTheme] = useReducer(reducer, initState);

    return(
        <ThemeContext.Provider value={{stateTheme, dispatchTheme}}>
            {children}       
        </ThemeContext.Provider>
    );
};