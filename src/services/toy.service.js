import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

const TOY_KEY = 'toyDB'
const PAGE_SIZE = 5

const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered']

_createToys()

export const toyService = {
    query,
    get,
    remove,
    save,
    getFilterFromSearchParams,
    getPriceStats,
    getMaxPage,
    getInStockValue,
    getLabelCounts,
    addToyMsg,
    removeToyMsg,
    getEmptyToy,
    getToyLabels,
    getToys,
    getDefaultFilter

}
// For Debug (easy access from console):
window.cs = toyService

async function getToys() {
    let toys = await storageService.get(TOY_KEY)
}

async function query(filterBy = {}) {

    let toys = await storageService.query(TOY_KEY)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toys = toys.filter(toy => regExp.test(toy.name))
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
                return a.name.localeCompare(b.name) * dir
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
    const maxPage = Math.ceil(filteredToysLength / PAGE_SIZE)


    toys = toys.map(({ _id, name, price, inStock, labels }) => ({ _id, name, price, inStock, labels }))
    return { toys, maxPage }
}

async function get(toyId) {
    let toy = await storageService.get(TOY_KEY, toyId)

    toy = _setNextPrevToyId(toy)
    return toy
}

async function remove(toyId) {
    return await storageService.remove(TOY_KEY, toyId)
}

async function save(toy) {
    let savedToy
    if (toy._id) {

        const toyToUpdate = {
            name: toy.name,
            price: toy.price,
            inStock: toy.inStock,
            updatedAt: Date.now(),
            labels: toy.labels,
            msgs: toy.msgs
        }
        savedToy = await storageService.put(TOY_KEY, toyToUpdate)

    } else {
        const toyToSave = {
            name: toy.name,
            price: toy.price,
            inStock: toy.inStock,
            createdAt: Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24),
            labels: toy.labels,
            msgs: []
        }
        savedToy = await storageService.post(TOY_KEY, toyToSave)
    }
    return savedToy
}

function getInStockValue(inStock) {
    if (inStock === '') return ''
    if (inStock === 'true') return true
    if (inStock === 'false') return false
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
            // const selectedLabels = utilService.getTwoUniqueRandomItems(labels)
            const name = txts[utilService.getRandomIntInclusive(0, txts.length - 1)]
            const _id = utilService.makeId()
            toys.push(_createToy(_id, name + '-' + (i + 1), utilService.getRandomIntInclusive(10, 100)))
        }
        utilService.saveToStorage(TOY_KEY, toys)
    }
}

function _createToy(_id, name, price, labels) {
    const toy = getEmptyToy(name, price, labels)
    toy._id = _id
    toy.msgs = []
    return toy
}

function getEmptyToy(name, price) {
    return {
        name,
        labels: utilService.getTwoUniqueRandomItems(labels),
        price,
        inStock: true,
    }
}


function getDefaultFilter() {
    return { txt: '', price: 0, inStock: '', pageIdx: 0, labels: [], sort: '', sortDir: -1 }
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
        if (toy.price < 10) map.low++
        else if (toy.price < 30) map.normal++
        else map.high++
        return map
    }, { low: 0, normal: 0, high: 0 })
    return toyCountByPriceMap
}

function getLabelCounts() {
    return storageService.query(TOY_KEY).then(toys => {
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

async function addToyMsg(toyId, txt) {
    // Later, this is all done by the backend
    if (!toyId) throw new Error('No toyId provided')

    let toy = await get(toyId)
    if (!toy) throw new Error('No toy provided')

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    if (!toy.msgs) toy.msgs = []
    toy.msgs.push(msg)
    await storageService.put(TOY_KEY, toy)

    return msg
}

async function removeToyMsg(toyId, msgId) {
    // Later, this is all done by the backend
    const toy = await get(toyId)
    const msgIdX = toy.msgs.findIndex(msg => msg.id === msgId)

    const updatedToy = toy.msgs.splice(msgIdX, 1)

    await storageService.put(TOY_KEY, updatedToy)

    return updatedToy
}

function getToyLabels() {
    return [...labels]
}