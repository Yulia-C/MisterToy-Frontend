import { useEffect, useRef } from "react"

export function useEffectUpdate(callBack, dependencies) {
    let isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        return callBack()
    }, dependencies)
}