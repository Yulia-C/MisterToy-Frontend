import { httpService } from './http.service.js'
import Axios from 'axios'

import { utilService } from './util.service.js'
const BASE_URL = 'toy/'
// const BASE_URL = 'http://localhost:3030/api/toy/'
var axios = Axios.create({
    withCredentials: true
})

const PAGE_SIZE = 5
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']

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
    getInStockValue,
    getToyLabels,
    getLabelCounts
}
// For Debug (easy access from console):
window.cs = toyService

function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
}

function get(toyId) {
    return httpService.get(BASE_URL + toyId)
        .then(toy => _setNextPrevToyId(toy)
        )
}

function remove(toyId) {
    return httpService.delete(BASE_URL + toyId)
}

function save(toy) {
    const method = toy._id ? 'put' : 'post'
    const url = toy._id ? `${BASE_URL}${toy._id}` : BASE_URL

    return httpService[method](url, toy)
}


function getEmptyToy() {
    return {
        txt: '',
        labels: utilService.getTwoUniqueRandomItems(labels),
        price: 0,
        inStock: true,
        createdAt: Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24),
        updatedAt: Date.now()
    }
}

function getInStockValue(inStock) {
    if (inStock === '') return ''
    if (inStock === 'true') return true
    if (inStock === 'false') return false
}

function getLabelCounts() {
    return query().then(toys => {
        if (!toys || !Array.isArray(toys)) return null
        const labelCounts = {}
        toys.forEach(toy => {
            toy.labels.forEach(label => {
                if (!labelCounts[label]) labelCounts[label] = { total: 0, inStock: 0 }
                labelCounts[label].total++
                if (toy.inStock) labelCounts[label].inStock++
            })
        })
        return labelCounts
    })
}

function getDefaultFilter() {
    return { txt: '', price: 0, inStock: '', pageIdx: 0, labels: [], sort: '', sortDir: -1 }
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
    return query()
        .then(toys => {
            const toyCountByPriceMap = _getToyCountByPriceMap(toys)
            const data = Object.keys(toyCountByPriceMap).map(speedName => ({ title: speedName, value: toyCountByPriceMap[speedName] }))
            return data
        })
}

function getMaxPage(filteredToysLength) {
    if (filteredToysLength) {
        return Promise.resolve(Math.ceil(filteredToysLength / PAGE_SIZE))
    }
    return query()
        .then(toys => Math.ceil(toys.length / PAGE_SIZE))
        .catch(err => {
            console.error('Cannot get max page:', err)
            throw err
        })
}

function getToyLabels() {

    // return query(BASE_URL, labels)
    return Promise.resolve(labels)
}

function _setNextPrevToyId(toy) {
    return query().then((toys) => {
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

