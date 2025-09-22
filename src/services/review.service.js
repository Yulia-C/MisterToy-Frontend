import { storageService } from './async-storage.service.js'
import { toyService } from './toy.service.js'
import { userService } from './user.service.js'

const REVIEW_KEY = 'reviewDB'
export const reviewService = {
    add,
    query,
    remove,
    getReviewFilter
}

_createReviews()

async function query(filterBy = {}) {
    let reviews = await storageService.query(REVIEW_KEY)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        reviews = reviews.filter(review => regExp.test(review.txt === filterBy.txt))
    }
    if (filterBy.rating) {
        reviews = reviews.filter(review => review.rating >= filterBy.rating)
    }

    if (filterBy.byUserId) {
        reviews = reviews.filter(review => review.byUser._id === filterBy.byUserId)
    }
    if (filterBy.aboutToyId) {
        reviews = reviews.filter(review => review.aboutToy._id === filterBy.aboutToyId)
    }

    return reviews
}


async function remove(reviewId) {
    await storageService.remove(REVIEW_KEY, reviewId)
}

async function add({ txt, rating, aboutToyId }) {

    const aboutToy = await toyService.get(aboutToyId)

    const reviewToAdd = {
        txt,
        rating,
        byUser: {
            _id: userService.getLoggedinUser()._id,
            fullname: userService.getLoggedinUser().fullname
        },
        aboutToy: {
            _id: aboutToy._id,
            name: aboutToy.name,
            price: aboutToy.price,
        },
    }

    // reviewToAdd.byr.score += 10
    // await toyService.update(reviewToAdd.byUser)

    const addedReview = await storageService.post(REVIEW_KEY, reviewToAdd)
    return addedReview
}

function getReviewFilter() {
    return { txt: '', rating: '', sort: '', sortDir: -1, byUserId: '', aboutToyId: '' }
}

async function _createReviews() {
    let reviews = utilService.loadFromStorage(REVIEW_KEY)

    if (!reviews || !reviews.length) {
        reviews = [
            {
                txt: "WOW Amazing toy",
                rating: 5,
                createdAt: Date.now(),
                byUser: {
                    fullname: "Admin Adminov",
                    _id:'87686'
                },
                aboutToy: {
                    name: "Slime Factory-1",
                    price: 89,
                    _id: 'YtHAjh'
                }
            },
            {
                txt: "DO NOT RECOMMEND... BAD",
                rating: 1,
                createdAt: Date.now(),
                byUser: {
                    fullname: "John Doe",
                    _id:'8768'
                },
                aboutToy: {
                    name: "Water Gun-20",
                    price: 100,
                    _id: '5Lz4Et'
                }
            },
            {
                txt: "Meh",
                rating: 3,
                createdAt: Date.now(),
                byUser: {
                    fullname: "Bob Smith",
                    _id:'64565'
                },
                aboutToy: {
                    name: "Magic Trick Set-2",
                    price: 19,
                    _id: 'eSWQxV'

                }
            }
        ]

        return storageService.post(REVIEW_KEY, reviews)
    }
}