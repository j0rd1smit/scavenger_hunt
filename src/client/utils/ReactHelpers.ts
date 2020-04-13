import {Dispatch, useEffect, useRef, useState, MutableRefObject} from "react";

export const useRefState = <T>(initialValue: T): [T, MutableRefObject<T>, Dispatch<T>] => {
    const [state, setState] = useState<T>(initialValue)
    const stateRef = useRef(state)
    useEffect(
        () => { stateRef.current = state },
        [state]
    )
    return [state, stateRef, setState]
}