import React from "react";
import { motion } from "framer-motion";
import styles from "../auth/auth.module.css";

const animationAuth = {
    // initial: {opacity: 0, filter: 'blur(10px)', x: '100%'},
    animate: { filter: 'blur(0px)', x: '0%'},
    exit: { filter:'blur(10px)', x:'66%', background: 'linear-gradient(to right bottom, #4dcbb1, #40c6bb, #3ac0c2, #3ebac7, #49b3c9, #49aece, #4ea9d1, #58a3d3, #619dd9, #7196dd, #878ddc, #9e82d6)'}
}

const animationRegist = {
    // initial: {opacity: 0, filter: 'blur(10px)', x: '100%'},
    animate: { filter: 'blur(0px)', x: '0%'},
    exit: { filter:'blur(10px)', x:'-66%', background: 'linear-gradient(to left top, #78cfea, #5fc4ef, #4bb8f4, #47aaf6, #539bf6, #6393f7, #7589f5, #887ff1, #997bf1, #ab75f0, #bc6fed, #cc68e9)'}
}

 export function AuthTransition({children}){
    return(
        <motion.div
            className={`${styles.Auth}`}
            // initial={{opacity: 0}}
            animate="animate"
            exit="exit"
            variants={animationAuth}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    )
}

 export function RegistTransition({children}){
    return(
        <motion.div
            className="Regist"
            // initial={{opacity: 0}}
            animate="animate"
            exit="exit"
            variants={animationRegist}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    )
}