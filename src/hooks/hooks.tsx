import React, { RefObject, useEffect } from "react";

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