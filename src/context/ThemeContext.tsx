import React, { useReducer, useContext} from "react";

export const ThemeContext = React.createContext<ThemeProvider | null>(null);

interface ThemeProvider {
    stateTheme: ThemeState
    dispatchTheme: React.Dispatch<ThemeAction>
}

interface ThemeState {
    account: boolean
}

type ThemeAction = 
{type: 'TrACCOUNT'}|
{type: 'RemACCOUNT', status: boolean}

const initState: ThemeState = {
    account: false,
}

function reducer(state: ThemeState, action: ThemeAction){
    switch(action.type){
        case 'TrACCOUNT':
            return { ...state, account: true }
        case 'RemACCOUNT':
            return { ...state, account: action.status}
        default:
            return {...state}
    }
}

interface ThemeProviderProps {
    children: React.ReactNode
}

export default function ThemeProvider ({children} : ThemeProviderProps){
    const [stateTheme, dispatchTheme] = useReducer(reducer, initState);

    return(
        <ThemeContext.Provider value={{stateTheme, dispatchTheme}}>
            {children}       
        </ThemeContext.Provider>
    );
};

export function useThemeContext (){
    const context = useContext(ThemeContext)
    
    if(!context){
        throw new Error('useThemeContext должен использоваться внутри ThemeProvider')
    }

    return context
};