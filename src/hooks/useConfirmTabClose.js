import { useEffect, useState } from 'react'

// const confirmationMessage = 'You have unsaved changes. Continue?'

export function useConfirmTabClose() {
    const [isUnsafeTabClose, setIsUnsafeTabClose] = useState(false)

    useEffect(() => {
        if (!isUnsafeTabClose) return
        function handleBeforeUnload(ev) {
            ev.returnValue = true
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [isUnsafeTabClose])
    return setIsUnsafeTabClose
}