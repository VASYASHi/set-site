import React, { useEffect, useState } from "react";
import { motion, MotionStyle } from "framer-motion";
import styles from "../auth/auth.module.css";

interface TransitionChild {
    children: React.ReactNode
}

export function AuthTransition({children} : TransitionChild){
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const fuTrue = () => {
            setMobile(window.innerWidth <= 500)
        };

        fuTrue();

        window.addEventListener('resize', fuTrue);
        return () => window.removeEventListener('resize', fuTrue)
    }, [])

    const animationAuth = {
        animate: { filter: 'blur(0px)', x: '0%'},
        exit: { filter:'blur(10px)', x: mobile ? '0%':'66%'}
    }

    const gradienExitAuth = {
        position: 'absolute',
        zIndex: 3,
        background: 'linear-gradient(to right bottom, #4dcbb1, #40c6bb, #3ac0c2, #3ebac7, #49b3c9, #49aece, #4ea9d1, #58a3d3, #619dd9, #7196dd, #878ddc, #9e82d6)',
        borderRadius: '0.7em',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
    } satisfies MotionStyle

    return(
        <motion.div
            className={`${styles.Auth}`}
            animate="animate"
            exit="exit"
            variants={animationAuth}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <motion.div
                initial={{opacity: 0}}
                exit={{opacity: 1}}
                style= {gradienExitAuth}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            />
            {children}
        </motion.div>
    )
}

export function RegistTransition({children} : TransitionChild){
    const [mobile, setMobile] = useState(false);

    useEffect(() => {
        const fuTrue = () => {
            setMobile(window.innerWidth <= 500)
        };

        fuTrue();

        window.addEventListener('resize', fuTrue);
        return () => window.removeEventListener('resize', fuTrue)
    }, [])

    const animationRegist = {
        animate: { filter: 'blur(0px)', x: '0%'},
        exit: { filter:'blur(10px)', x: mobile ? '0%' : '-66%'}
    }

    const gradienExitRegist = {
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 3,
        background: 'linear-gradient(to left top, #78cfea, #5fc4ef, #4bb8f4, #47aaf6, #539bf6, #6393f7, #7589f5, #887ff1, #997bf1, #ab75f0, #bc6fed, #cc68e9)',
        borderRadius: '0.7em',
        width: '100%',
        height: '100%',
    } satisfies MotionStyle

    return(
        <motion.div
            className="Regist"
            // initial={{opacity: 0}}
            animate="animate"
            exit="exit"
            variants={animationRegist}
            transition={{ duration: 0.4, ease: "easeInOut" }}
        >
            <motion.div
                initial={{opacity: 0}}
                exit={{opacity: 1}}
                style={gradienExitRegist}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            />
            {children}
        </motion.div>
    )
}