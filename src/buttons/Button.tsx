import React from "react";
import './Button.css'

interface ButtonNode {
    children: React.ReactNode
}

export default function Button ({children} : ButtonNode){
    return(
        <div className="Button"><p>{children}</p></div>
    );
}