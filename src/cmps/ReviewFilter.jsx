import { debounce } from "../services/util.service.js"
// import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { useState, useEffect, useRef } from 'react'
import { useEffectUpdate } from "../hooks/useEffectUpdate.js"
import { useSelector } from "react-redux"



export function ReviewFilter({ filterBy, onSetFilterBy }) {
    const reviews = useSelector(storeState => storeState.reviewModule.reviews)

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(debounce(onSetFilterBy, 500)).current

    useEffectUpdate(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    const [allReviews, setAllReviews] = useState([])

    useEffectUpdate(() => {
        if (reviews.length && allReviews.length === 0) {
            const deepCopy = JSON.parse(JSON.stringify(reviews))
            setAllReviews(deepCopy)
        }
    }, [reviews])

    function handleChange(event) {

        const target = event.target
        const field = target.name
        if (field === 'toyName') {

        }
        let value = target.value
        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }
        if (field === 'sortDir') value = target.checked ? -1 : 1
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function reviewMap() {
        const reviewMap = {
            toys: new Map(),
            users: new Map()
        }

        allReviews.forEach(review => {
            const toy = review.aboutToy
            const user = review.byUser

            if (toy && !reviewMap.toys.has(toy._id)) {
                return reviewMap.toys.set(toy._id, toy.name)
            }

            if (user && !reviewMap.users.has(user._id)) {
                return reviewMap.users.set(user._id, user.fullname)
            }
        })
        return reviewMap
    }

    const reviewsMap = reviewMap()
    const toyList = Array.from(reviewsMap.toys.entries()).map(([_id, name]) => ({ _id, name }))
    const userList = Array.from(reviewsMap.users.entries()).map(([_id, fullname]) => ({ _id, fullname }))

    const { txt, rating } = filterByToEdit

    return (
        <section className="container">
            <h2>Filter Reviews</h2>
            <div className="toy-filter">

                <form onSubmit={onSubmitFilter}>
                    <input value={txt || ''} onChange={handleChange}
                        type="search" placeholder="By Txt" id="txt" name="txt"
                    />
                    <input style={{ width: '80px' }} value={rating || 0} onChange={handleChange}
                        type="number" placeholder="By rating" id="rating" name="rating"
                    />

                    <div className="review-sort container">

                        <select name="aboutToyId" value={filterByToEdit.aboutToyId} onChange={handleChange}>
                            <option value="">All Toys</option>
                            {toyList.map(toy =>
                                <option key={toy._id} value={toy._id}>{toy.name}</option>)}
                        </select>

                        <select name="byUserId" value={filterByToEdit.byUserId} onChange={handleChange}>
                            <option value="">All users</option>
                            {userList.map(user =>
                                <option key={user._id} value={user._id}>{user.fullname}</option>)}
                        </select>

                    </div>

                </form>

            </div>

        </section >

    )
}