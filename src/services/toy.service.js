import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const TOY_KEY = 'toyDB'
const PAGE_SIZE = 17
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']

_createToys()


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
    getToyLabels,
    getInStockValue
}
// For Debug (easy access from console):
window.cs = toyService



function query(filterBy = {}) {
    return storageService.query(TOY_KEY)
        .then(toys => {

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                toys = toys.filter(toy => regExp.test(toy.txt))
            }

            if (filterBy.labels?.length) {
                toys = toys.filter(toy =>
                    filterBy.labels.every(label => toy.labels.includes(label))
                )
            }

            if (filterBy.price) {
                toys = toys.filter(toy => toy.price >= filterBy.price)
            }

            if (typeof filterBy.inStock === 'boolean') {
                toys = toys.filter(toy => toy.inStock === filterBy.inStock)
            }

            if (filterBy.sort) {
                const dir = +filterBy.sortDir
                toys.sort((a, b) => {
                    if (filterBy.sort === 'name') {
                        return a.txt.localeCompare(b.txt) * dir
                    } else if (filterBy.sort === 'price' || filterBy.sort === 'createdAt') {
                        return (a[filterBy.sort] - b[filterBy.sort]) * dir
                    }
                })
            }

            const filteredToysLength = toys.length
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                toys = toys.slice(startIdx, startIdx + PAGE_SIZE)
            }

            return toys
        })
}

function get(toyId) {
    return storageService.get(TOY_KEY, toyId)
        .then(toy => {
            toy = _setNextPrevToyId(toy)
            return toy
        })
}

function remove(toyId) {
    return storageService.remove(TOY_KEY, toyId)
}

function save(toy) {
    if (toy._id) {
        // TOY - updatable fields
        toy.updatedAt = Date.now()
        return storageService.put(TOY_KEY, toy)
    } else {
        toy.createdAt = toy.updatedAt = Date.now()

        return storageService.post(TOY_KEY, toy)
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

function getInStockValue(inStock) {
    if (inStock === '') return ''
    if (inStock === 'true') return true
    if (inStock === 'false') return false
}

function getToyLabels() {
    return Promise.resolve(labels)
}

function getDefaultFilter() {
    return { txt: '', price: 0, inStock: '', pageIdx: 0, sort: '', sortDir: -1 }
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
// function getProgressStats() {
//     return storageService.query(TOY_KEY)
//         .then(toys => {
//             const toyProgressMap = getToyProgressMap(toys)
//             const data = Object.keys(toyProgressMap).map(progress => ({ title: progress, value: toyProgressMap[progress] }))
//             return data
//         })
// }

function _createToys() {
    let toys = utilService.loadFromStorage(TOY_KEY)

    if (!toys || !toys.length) {
        toys = []

        const txts = [
            'Talking Teddy',
            'Speedy Car',
            'Magic Blocks',
            'Flying Drone',
            'Puzzle Mania',
            'Color Splash Set',
            'Build-a-Robot',
            'Mini Soccer Set',
            'Glow in the Dark Stars',
            'RC Helicopter',
            'Wooden Train Set',
            'Plush Bunny',
            'Lego Builder Kit',
            'Slime Factory',
            'Science Lab Kit',
            'Musical Keyboard',
            'Water Gun',
            'Treasure Hunt Game',
            'Bouncing Ball',
            'Magic Trick Set'
        ]


        for (let i = 0; i < 20; i++) {
            const selectedLabels = utilService.getTwoUniqueRandomItems(labels)
            const txt = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]

            toys.push(_createToy(txt + (i + 1), selectedLabels, utilService.getRandomIntInclusive(1, 10)))
        }
        utilService.saveToStorage(TOY_KEY, toys)
    }
}

function _createToy(txt, labels, price) {
    const toy = getEmptyToy(txt, labels, price)
    return toy
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

function getToyProgressMap(toys) {
    const map = toys.reduce((acc, toy) => {
        if (toy.inStock) acc.done++
        else if (toy.inStock === false) acc.inProgress++

        return acc
    }, { done: 0, inProgress: 0 })

    const totalProgress = map.done + map.inProgress
    map.progress = totalProgress ? Math.round((map.done / totalProgress) * 100) : 0
    return map
}



// Data Model:
// const toy = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     price: 9,
//     inStock: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

