import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Chat } from "../cmps/Chat.jsx"
import { NicePopup } from "../cmps/NicePopup.jsx"
import { useSelector } from "react-redux"
import { ReviewEdit } from "../cmps/ReviewEdit.jsx"
import { Button } from "@mui/material"
import { ReviewList } from "../cmps/ReviewList.jsx"
import { loadReviews, removeReview } from "../store/actions/review.actions.js"
import { loadToys } from "../store/actions/toy.actions.js"

export function ToyDetails() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    let reviews = useSelector(storeState => storeState.reviewModule.reviews)

    const [toy, setToy] = useState(null)
    const { toyId } = useParams()
    const [msg, setMsg] = useState({ txt: '' })

    const toyReviews = reviews.filter(review => review?.aboutToy?._id === toyId)
    const navigate = useNavigate()

    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isReviewOpen, setIsReviewOpen] = useState(false)


    useEffect(() => {
        loadToy()
        if (toyReviews) loadReviews()

    }, [toyId])

    async function loadToy() {
        try {
            const toy = await toyService.get(toyId)
            setToy(toy)

        } catch (err) {
            console.error('err:', err)
            showErrorMsg('Cannot load toy')
            navigate('/toy')
        }
    }

    function onOpenChat() {
        setIsChatOpen(true)
    }
    function onCLoseChat() {
        setIsChatOpen(false)
    }

    function onOpenReview() {
        setIsReviewOpen(true)
    }
    function onCloseReview() {
        setIsReviewOpen(false)
    }

    function handleMsgChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setMsg(msg => ({ ...msg, [field]: value }))
    }

    async function onSaveMsg(ev) {
        ev.preventDefault()
        try {
            const savedMsg = await toyService.addToyMsg(toyId, msg.txt)
            console.log('Saving message for toyId:', toyId)

            setToy(prevToy => ({
                ...prevToy,
                msgs: [...(prevToy.msgs || []), savedMsg],
            }))
            showSuccessMsg('Message saved!')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot save message')
        } finally {
            setMsg({ txt: '' })

        }
    }

    async function onremoveToyMsg(msgId) {
        try {
            await toyService.removeToyMsg(toy._id, msgId)
            setToy(prevToy => ({
                ...prevToy,
                msgs: prevToy.msgs.filter(msg => msg.id !== msgId),
            }))
            showSuccessMsg('Message removed!')
        } catch (error) {
            console.log('error:', error)
            showErrorMsg('Cannot remove message')
        }
    }

    async function onRemoveReview(reviewId) {
        try {
            const newReviews = await removeReview(reviewId)
            showSuccessMsg('Review removed!')
            return reviews
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot remove review')
        }
    }

    if (!toy) return <div>Loading...</div>
    const { txt } = msg
    return (
        <section className="toy-details ">
            <div className="details-wrapper">

                <div className="flex">
                    <button onClick={() => navigate('/toy')}>Back to list</button>
                    {loggedinUser &&
                        <button onClick={onOpenChat} title="Open chat" className="material-symbols-outlined">
                            forum
                        </button>}
                </div>

                <img src={toy.imgUrl || `https://robohash.org/${toy._id}`} />

                <div className="flex">
                    <h3 className={(toy.inStock) ? '' : 'out'}>{toy.name}</h3>
                    <h4>${toy.price}</h4>
                </div>

                {toy.inStock ?
                    <p style={{ color: 'rgba(24, 151, 41, 1)' }}>In stock</p> :
                    <p style={{ color: 'rgba(241, 71, 71, 1)' }}>Out of stock</p>}

                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium,
                    itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit
                    provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>

                <div className="btns-next-prev">
                    <Link to={`/toy/${toy.nextToyId}`}>Next Toy</Link>
                    <Link to={`/toy/${toy.prevToyId}`}> Previous Toy</Link>
                </div>

                <NicePopup
                    header={<h3>Support</h3>}
                    isOpen={isChatOpen}
                    onClose={onCLoseChat}>
                    <Chat />
                </NicePopup>
            </div>
            <hr className="hr" />

            {loggedinUser && (
                <div className="msg-container">
                    <p>Send a message about the toy:</p>
                    <form onSubmit={onSaveMsg}>
                        <input
                            type="text"
                            name="txt"
                            value={msg.txt}
                            placeholder="Enter Your Message"
                            onChange={handleMsgChange}
                            required
                            autoFocus
                        />
                        <button className="btn">Send</button>
                    </form>
                    <hr className="hr" />
                    <button onClick={onOpenReview}>Write a review</button>
                    {/* <Button sx={{ backgroundColor: 'rgba(214, 238, 245, 0.86)', color: '#458a90ff', width: 'fit content' }} onClick={onOpenReview}>Write a review</Button> */}
                </div>
            )}

            <ul className="clean-list comments">
                {!toy.msgs.length &&
                    <p>Messages by users:</p>}

                {!!toy.msgs?.length &&
                    (toy.msgs.map(msg => (
                        <li key={msg.id}>
                            By: {msg.by ? msg.by.fullname : 'Unknown User'} - {msg.txt}
                            {loggedinUser && (loggedinUser?._id === msg.by?.id || loggedinUser.isAdmin) &&

                                <button type="button" onClick={() => onremoveToyMsg(msg.id)}>
                                    ✖️
                                </button>}
                        </li>
                    )))

                    // : (<p>No comments yet... Be the first!
                    //     {!loggedinUser && <button onClick={() => navigate('/auth/login')}>Login</button>}
                    // </p>)
                }
            </ul>
            {reviews &&
                <ReviewList reviews={toyReviews} onRemoveReview={onRemoveReview} />
            }

            <NicePopup
                header={<h3>Share Your Thoughts</h3>}
                isOpen={isReviewOpen}
                onClose={onCloseReview}>
                <ReviewEdit onClose={onCloseReview} />
            </NicePopup>
        </section>
    )
}