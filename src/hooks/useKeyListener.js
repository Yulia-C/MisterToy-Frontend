import { useEffect } from "react"

export function useKeyListener(key, handler) {
    useEffect(() => {
        function handleKeyDown(event) {
            if (key === event.key) {
                handler(event)

            }
            // switch (event.key) {
            //     case 'Escape':
            //         break
            //     default: break
            // }
        }
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }

    }, [key])
}