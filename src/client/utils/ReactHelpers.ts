import {Dispatch, MutableRefObject, useEffect, useLayoutEffect, useRef, useState} from "react";

export const useRefState = <T>(initialValue: T): [T, MutableRefObject<T>, Dispatch<T>] => {
    const [state, setState] = useState<T>(initialValue)
    const stateRef = useRef(state)
    useEffect(
        () => {
            stateRef.current = state
        },
        [state]
    )
    return [state, stateRef, setState]
}

export const windowHeightMinusAppBarState = (): number => {
    const [height, refHeight, setHeight] = useRefState<number>(window.innerHeight - 64);
    useEffect((): () => void => {
        const handleResize = (): void => setHeight(window.innerHeight - 64);
        window.addEventListener("resize", handleResize);

        return (): void => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useLayoutEffect(() => {
        if (refHeight?.current !== window.innerHeight - 64) {
            setHeight(window.innerHeight - 64);
        }
    });


    return height;
}

export const localStorageFlagHook = (v: boolean, key: string): [boolean, Dispatch<boolean>] => {
    const [flag, setFlag] = useState<boolean>(v);
    //window.localStorage.
    useEffect(() => {
       if (window.localStorage.getItem(key) === null) {
           window.localStorage.setItem(key, flag.toString());
       } else {
           setFlag(window.localStorage.getItem(key) === "true");
       }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(key, flag.toString());
    }, [flag]);

    return [flag, setFlag];
}

