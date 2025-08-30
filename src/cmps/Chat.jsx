import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
// import { userService } from '../services/user.service.js'
import { userService } from '../services/user.service.local.js'
import { utilService } from '../services/util.service.js'

export function Chat() {
    const [chat, setChat] = useState('')
    const [msgs, setMsgs] = useState([])
    const [autoReply, setAutoReply] = useState('')

    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    useEffect(() => {

    }, [])

    function handleChange({ target }) {

        const field = target.name
        let value = target.value

        switch (target.type) {

            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break
        }
        setChat(target.value);
    }

    function onSend(ev) {
        ev.preventDefault()
        const newMsg = {
            _id: utilService.makeId(),
            from: loggedinUser.fullname,
            body: chat
        }
        setMsgs(prevMsgs => [...prevMsgs, newMsg])
        setChat('')
        setTimeout(() => {
            setAutoReply(autoReply => {
                autoReply = {
                    _id: utilService.makeId(),
                    from: 'Support',
                    body: 'Hello there'
                }
                setMsgs(prevMsgs => [...prevMsgs, autoReply])

            })
        },500)
    }

    return (
        <section className="chat-container ">
            <div className="chat-messages">{msgs && msgs.map(msg => <p key={msg._id}>{msg.from}: {msg.body}</p>)}</div>
            <form className="chat" onSubmit={onSend} >
                <input type='text' name="body" value={chat} onChange={handleChange} placeholder='Chat bot here :)' />
                <button>Send</button>
            </form>
        </section >
    )
}