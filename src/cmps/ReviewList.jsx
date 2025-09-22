import { useSelector } from "react-redux"
import { userService } from "../services/user.service.js"
import { ReviewPreview } from "./ReviewPreview.jsx"
export function ReviewList({ reviews, onRemoveReview }) {


    function shouldShowActionButtons(review) {
        const user = userService.getLoggedinUser()
        if (!user || !review?.byUser?._id) return false
        if (user.isAdmin) return true
        return review?.byUser?._id === user._id
    }

    return (
        <ul className="review-list clean-list">
            {!reviews.length && <div>No reviews yet...</div>}

            {reviews &&
                // reviews.filter(review => review?.byUser?._id)
                reviews.map(review => <li key={review._id}>
                    {shouldShowActionButtons(review) ? (
                        <div className="review-btn">
                            <button onClick={() => onRemoveReview(review?._id)}>✖</button>
                            <ReviewPreview review={review} />
                        </div>
                    ) :
                        <ReviewPreview review={review} />
                    }
                </li>)}
        </ul>
    )
}