import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.js"
import { updateUserDetails } from "../store/actions/user.actions.js"
import { useOnlineStatus } from '../hooks/useOnlineStatus.js'
import { ReviewList } from '../cmps/ReviewList.jsx'
import { loadReviews, removeReview } from '../store/actions/review.actions.js'
import { useSelector } from 'react-redux'

export function UserPage() {

    const user = useSelector(storeState => storeState.userModule.loggedinUser)
    let reviews = useSelector(storeState => storeState.reviewModule.reviews)
    const userReviews = reviews.filter(review => review.byUser._id === user._id)

    const navigate = useNavigate()
    const isOnline = useOnlineStatus()

    useEffect(() => {
        if (!user) {
            navigate('/')
            showErrorMsg('Please sign in first')
            return
        }
        loadReviews()
    }, [user])

    async function loadUser() {

        try {
            return await userService.getById(user._id)
        } catch (err) {
            console.log('err:', err)
            navigate('/')
        }


    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setUser(prevDetails => ({ ...prevDetails, [field]: value }))
    }

    async function onSaveUser(ev) {
        ev.preventDefault()

        try {
            const updatedUser = await updateUserDetails()

            navigate('/toy')
            showSuccessMsg(`Toy Saved (id: ${updatedUser._id})`)

        } catch (err) {
            showErrorMsg('Cannot save toy')
            console.log('err:', err)
        }
    }

    async function onRemoveReview(reviewId) {
        try {
            await removeReview(reviewId)
            loadReviews()
            showSuccessMsg('Review removed!')

        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot remove review')
        }
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-page container">
        <pre>
            <img src={user.imgUrl} style={{ width: '100px' }} />

            <p>{isOnline ? '✅ Online' : '❌ Disconnected'}</p>
            <h2>Username: {user.username}</h2>
            <h2>User Id: {user._id}</h2>
            <h3>Full Name {user.fullname}</h3>
        </pre>
        {/* <form onSubmit={onSaveUser}>
            <input type='text' value={user.fullname} name="fullname" onChange={handleChange} />
        </form> */}
        <ReviewList reviews={userReviews} onRemoveReview={onRemoveReview} />
        <Link to="/toy">Back</Link>
    </section>
}