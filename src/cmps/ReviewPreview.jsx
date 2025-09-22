import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LongTxt } from './LongTxt.jsx'
import { useSelector } from 'react-redux'

export function ReviewPreview({ review }) {

    const user = useSelector(storeState => storeState.userModule.loggedinUser)

    const { byUser } = review
    const location = useLocation()
    const isToy = location.pathname.includes('toy')
const createdAt = Number(review.createdAt) 

    return (<article className="review-preview">
        <Link to={`/user/${byUser._id}`}>
            <img src={user?.imgUrl} style={{ width: '80px' }} />
        </Link>
        <h4 className="review-by">
            {byUser.fullname}
        </h4>
        {!isToy && <h4 className="review-about">{review.aboutToy.name}</h4>}

            <LongTxt children={review.txt} length={10}/>

        {/* <p className="review-time">{new Date(review.createdAt).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}</p> */}
        <p className="review-rating">{'⭐'.repeat(review.rating)}</p>
    </article>)
}