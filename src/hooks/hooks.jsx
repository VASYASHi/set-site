import React, { useEffect } from "react";

export function useClickOutside(ref, fuOut, refBtn){
    useEffect(() => {
        const fuIfout = (event) => {
            if(!ref.current || ref.current.contains(event.target)){
                return
            };

            if(refBtn.current && refBtn.current.contains(event.target)){
                return
            };

            fuOut(event)
        };
        document.addEventListener('mousedown', fuIfout);
        return () => document.removeEventListener('mousedown', fuIfout);
    }, [ref, fuOut, refBtn])
};