import { Fragment, useEffect } from "react"
import { useKeyListener } from "../hooks/useKeyListener.js"
export function NicePopup({ header, children, isOpen, onClose }) {


    useKeyListener('Escape', () => {
        onClose()
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <Fragment>

            <section onClick={onClose} className="backdrop"></section>
            <section className="nice-popup">
                <header>{header}</header>
                <main>{children}</main>
            </section>

        </Fragment>
    )
}

// function DynamicCmps(props) {
//     const dynamicCmpMap = {
//         chat: <Chat {...props} />
//     }
//     return dynamicCmpMap[props.mainType]
