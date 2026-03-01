import React from "react";
import './Button.css'

export default function Button ({children}){
    return(
        <div className="Button"><p>{children}</p></div>
    );
}