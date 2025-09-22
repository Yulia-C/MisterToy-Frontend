import { useSelector } from "react-redux"
import { ReviewList } from "../cmps/ReviewList.jsx"
import { loadReviews, removeReview } from "../store/actions/review.actions.js"
import { useEffect, useState } from "react"
import { ReviewFilter } from "../cmps/ReviewFilter.jsx"
import { setFilterBy } from "../store/actions/review.actions.js"
import { useSearchParams } from "react-router-dom"
import { getTruthyValues } from "../services/util.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

export function ReviewIndex() {
    const reviews = useSelector(storeState => storeState.reviewModule.reviews)
    const filterBy = useSelector(storeState => storeState.reviewModule.filterBy)

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams(getTruthyValues(filterBy))

        loadReviews(filterBy)
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        setFilterBy(filterBy)
    }
    
    async function onRemoveReview(reviewId) {
        try {
            await removeReview(reviewId)
            showSuccessMsg('Review removed!')
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Cannot remove review')
        }
    }
    
    return (
        <section className="review-index container">
            <ReviewFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <ReviewList reviews={reviews} onRemoveReview={onRemoveReview} />
        </section>
    )
}