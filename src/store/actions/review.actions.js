import { reviewService } from "../../services/review.service.js";
import { ADD_REVIEW, REMOVE_REVIEW, SET_REVIEWS } from "../reducers/review.reducer";
import { SET_FILTER } from "../reducers/toy.reducer";
import { store } from "../store";

export async function loadReviews(filterBy) {
    // const filterBy = store.getState().reviewModule.filterBy

    try {
        const reviews = await reviewService.query(filterBy)
        store.dispatch({ type: SET_REVIEWS, reviews })
    } catch (err) {
        console.log('review action -> Cannot load reviews', err)
        throw err
    }
}

export async function addReview(review) {
    try {
        // review.createdAt
        const addedReview = await reviewService.add(review)
        console.log('🧪 addedReview (from backend response):', addedReview)
        store.dispatch({ type: ADD_REVIEW, addedReview })
        await loadReviews()
    } catch (err) {
        console.log('review action -> Cannot add review', err)
        throw err
    }
}

export async function removeReview(reviewId) {
    try {
        await reviewService.remove(reviewId)
        store.dispatch({ type: REMOVE_REVIEW, reviewId })
    } catch (err) {
        console.log('review action -> Cannot remove review', err)
        throw err
    }
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER, filterBy })
}