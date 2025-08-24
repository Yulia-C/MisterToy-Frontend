import { Fragment, useEffect } from "react"
export function NicePopup({ children, isOpen, onClose }) {


    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'Escape':
                    onClose()
                    break
                default: break
            }
        }
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }

    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <Fragment>

            <section onClick={onClose} className="backdrop"></section>
            <section className="nice-popup">
                <header>Nice Popup Header</header>
                <main>{children}</main>
                <footer></footer>
            </section>

        </Fragment>
    )
}

// function DynamicCmps(props) {
//     const dynamicCmpMap = {
//         chat: <Chat {...props} />
//     }
//     return dynamicCmpMap[props.mainType]
