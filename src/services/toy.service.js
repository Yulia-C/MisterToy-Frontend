import { httpService } from './http.service.js'
import Axios from 'axios'

import { utilService } from './util.service.js'
const BASE_URL = 'http://localhost:3030/api/toy/'


var axios = Axios.create({
    withCredentials: true
})

export const toyService = {
    query,
    get,
    remove,
    save,
    getEmptyToy,
    getDefaultFilter,
    getFilterFromSearchParams,
    getPriceStats,
    getMaxPage,
}
// For Debug (easy access from console):
window.cs = toyService

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
}

function get(toyId) {
    return axios.get(BASE_URL + toyId)
        .then(res => res.data)

}
function remove(toyId) {
    return axios.delete(BASE_URL + toyId)
        .then(res => res.data)
}

function save(toy) {
    if (toy._id) {
        return axios.put(BASE_URL + toy._id, toy)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, toy)
            .then(res => res.data)
    }
}

function getEmptyToy(txt = '', labels = ['Box game', 'Art'], price = 5, inStock = true) {
    return {
        _id: utilService.makeId(),
        txt,
        labels,
        price,
        inStock: Math.random() < 0.7,
        createdAt: Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24),
        updatedAt: Date.now()
    }
}

function getDefaultFilter() {
    return { txt: '', price: 0, inStock: '', pageIdx: 0, sort: '', sortDir: 'asc' }
}

function getFilterFromSearchParams(searchParams) {
    const defaultFilter = getDefaultFilter()
    const filterBy = {}
    for (const field in defaultFilter) {
        filterBy[field] = searchParams.get(field) || ''
    }
    return filterBy
}

function getPriceStats() {
    return storageService.query(TOY_KEY)
        .then(toys => {
            const toyCountByPriceMap = _getToyCountByPriceMap(toys)
            const data = Object.keys(toyCountByPriceMap).map(speedName => ({ title: speedName, value: toyCountByPriceMap[speedName] }))
            return data
        })
}

function getMaxPage(filteredToysLength) {
    if (filteredToysLength)
        return Promise.resolve(Math.ceil(filteredToysLength / PAGE_SIZE))
    return storageService
        .query(TOY_KEY)
        .then((toys) => Math.ceil(toys.length / PAGE_SIZE))
        .catch((err) => {
            console.error('Cannot get max page:', err)
            throw err
        })
}

function _setNextPrevToyId(toy) {
    return storageService.query(TOY_KEY).then((toys) => {
        const toyIdx = toys.findIndex((currToy) => currToy._id === toy._id)
        const nextToy = toys[toyIdx + 1] ? toys[toyIdx + 1] : toys[0]
        const prevToy = toys[toyIdx - 1] ? toys[toyIdx - 1] : toys[toys.length - 1]
        toy.nextToyId = nextToy._id
        toy.prevToyId = prevToy._id
        return toy
    })
}

function _getToyCountByPriceMap(toys) {
    const toyCountByPriceMap = toys.reduce((map, toy) => {
        if (toy.price < 3) map.low++
        else if (toy.price < 7) map.normal++
        else map.urgent++
        return map
    }, { low: 0, normal: 0, urgent: 0 })
    return toyCountByPriceMap
}

