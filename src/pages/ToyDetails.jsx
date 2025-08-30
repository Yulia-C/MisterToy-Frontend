import { toyService } from "../services/toy.service.js"
// import { toyService } from "../services/toy.service.local.js"
import { showErrorMsg } from "../services/event-bus.service.js"
import { formatTimestamp } from "../services/util.service.js"

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Chat } from "../cmps/Chat.jsx"
import { NicePopup } from "../cmps/NicePopup.jsx"

export function ToyDetails() {

    const [toy, setToy] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    const [isChatOpen, setIsChatOpen] = useState(false)

    useEffect(() => {
        loadToy()
    }, [params.toyId])

    function loadToy() {
        toyService.get(params.toyId)
            .then(setToy)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load toy')
                navigate('/toy')
            })
    }

    function onOpenChat() {
        setIsChatOpen(true)
    }
    function onCLoseChat() {
        setIsChatOpen(false)
    }

    if (!toy) return <div>Loading...</div>
    return (
        <section className="toy-details">
            <h1 className={(toy.inStock) ? '' : 'out'}>{toy.txt}</h1>
            <h2>Created at {formatTimestamp(toy.createdAt)}</h2>
            {/* <h2>Updated at {formatTimestamp(toy.updatedAt)}</h2> */}
            <h2>{(toy.inStock) ? 'In stock' : 'Out of stock'}</h2>
            <h1>Toy price: {toy.price}</h1>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>
            <div className="flex">
                <button onClick={() => navigate('/toy')
                }>Back to list</button>
                <button onClick={onOpenChat} title="Open chat"> <i className="icon outlined chat" />
                </button>
            </div>
            <div>
                <Link to={`/toy/${toy.nextToyId}`}>Next Toy</Link> |
                <Link to={`/toy/${toy.prevToyId}`}>Previous Toy</Link>
            </div>
            <NicePopup
                header={<h3>Chat about - {toy.txt}</h3>}
                footer={<h4>Mister Toy support chat</h4>}
                isOpen={isChatOpen}
                onClose={onCLoseChat}>
                <Chat />
            </NicePopup>
        </section>
    )
}