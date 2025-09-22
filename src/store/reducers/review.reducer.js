import { reviewService } from "../../services/review.service.js"

export const SET_REVIEWS = 'SET_REVIEWS'
export const ADD_REVIEW = 'ADD_REVIEW'
export const REMOVE_REVIEW = 'REMOVE_REVIEW'
export const UPDATE_REVIEW = 'UPDATE_REVIEW'
export const SET_FILTER = 'SET_FILTER'

const initialState = {
    reviews: [],
    filterBy: reviewService.getReviewFilter()
}

export function reviewReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_REVIEWS:
            return { ...state, reviews: action.reviews }
        case ADD_REVIEW:
            return { ...state, reviews: [...state.reviews, action.review] }
        case REMOVE_REVIEW:
            return { ...state, reviews: state.reviews.filter(review => review._id !== action.reviewId) }
        case UPDATE_REVIEW:
            return {
                ...state,
                reviews: state.reviews.map(review =>
                    review._id === action.review._id ? action.review : review
                )
            }
        case SET_FILTER:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...action.filterBy }
            }
        default:
            return state
    }
}
