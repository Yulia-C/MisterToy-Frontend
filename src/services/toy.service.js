import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const TOY_KEY = 'toyDB'
const PAGE_SIZE = 5
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle',
    'Outdoor', 'Battery Powered',]

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
    getInStockValue,
    getLabelCounts
}
// For Debug (easy access from console):
window.cs = toyService



function query(filterBy = {}) {
    
    return storageService.query(TOY_KEY).then(toys => {
       
        let filteredToys = [...toys]

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                filteredToys = filteredToys.filter(toy => regExp.test(toy.name))
            }

            if (filterBy.labels?.length) {
                filteredToys = filteredToys.filter(toy =>
                    filterBy.labels.every(label => toy.labels.includes(label))
                )
            }

            if (filterBy.price) {
                filteredToys = filteredToys.filter(toy => toy.price >= filterBy.price)
            }

            if (typeof filterBy.inStock === 'boolean') {
                filteredToys = filteredToys.filter(toy => toy.inStock === filterBy.inStock)
            }

            if (filterBy.sort) {
                const dir = +filterBy.sortDir
                filteredToys.sort((a, b) => {
                    if (filterBy.sort === 'name') {
                        return a.txt.localeCompare(b.txt) * dir
                    } else if (filterBy.sort === 'price' || filterBy.sort === 'createdAt') {
                        return (a[filterBy.sort] - b[filterBy.sort]) * dir
                    }
                })
            }

            const filteredToysLength = filteredToys.length
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                filteredToys = filteredToys.slice(startIdx, startIdx + PAGE_SIZE)
            }

            return Promise.resolve(filteredToys)
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

function getEmptyToy(_id, name, price = 10, inStock = true) {
    return {
        _id,
        name,
        labels: utilService.getTwoUniqueRandomItems(labels),
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
    // return[...labels]
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
export function getBranches() {
    const branches = [
        {
            _id: "b1f9a8e1-23f4",
            city: "Tel Aviv",
            address: "Dizengoff Center, 50 Dizengoff St, Tel Aviv-Yafo",
            phoneNum: "+972-3-555-1234",
            hours: "Sun–Thu: 9:00–20:00, Fri: 9:00–14:00, Sat: Closed",
            position: {
                lat: 32.0753,
                lng: 34.7749
            }
        },
        {
            _id: "2a56d9e3-849f",
            city: "Haifa",
            address: "Grand Canyon Mall, 55 Derech Simha Golan, Haifa",
            phoneNum: "+972-4-555-5678",
            hours: "Sun–Thu: 10:00–21:00, Fri: 9:00–14:00, Sat: Closed",
            position: {
                lat: 32.794,
                lng: 35.0217
            }
        },
        {
            _id: "6cfb4cd2-c1de",
            city: "Jerusalem",
            address: "Malha Mall, 1 David Remez St, Jerusalem",
            phoneNum: "+972-2-555-9012",
            hours: "Sun–Thu: 10:00–20:00, Fri: 9:00–13:00, Sat: Closed",
            position: {
                lat: 31.7515,
                lng: 35.1879
            }
        },
        {
            _id: "d5aa31df-fec5",
            city: "Be'er Sheva",
            address: "BIG Beer Sheva, 21 Derech Hevron, Be'er Sheva",
            phoneNum: "+972-8-555-3456",
            hours: "Sun–Thu: 10:00–20:00, Fri: 9:00–14:00, Sat: Closed",
            position: {
                lat: 31.252,
                lng: 34.7915
            }
        },
        {
            _id: "4aa17661-d061",
            city: "Eilat",
            address: "Ice Mall, Kampen St 8, Eilat",
            phoneNum: "+972-8-555-7890",
            hours: "Sun–Thu: 11:00–21:00, Fri: 10:00–14:00, Sat: 11:00–22:00",
            position: {
                lat: 29.5577,
                lng: 34.9519
            }
        }
    ]

    return branches
}

function _createToys() {
    let toys = utilService.loadFromStorage(TOY_KEY)

    if (!toys || !toys.length) {
        toys = []

        const names = [
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
            const name = names[utilService.getRandomIntInclusive(0, names.length - 1)]
            const _id = utilService.makeId()
            toys.push(_createToy(_id, name + '-' + (i + 1), utilService.getRandomIntInclusive(10, 100), selectedLabels,))
        }
        utilService.saveToStorage(TOY_KEY, toys)
    }
}

function _createToy(_id, name, price, labels) {
    const toy = getEmptyToy(_id, name, price, labels)
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



// Data Model:
// const toy = {
//     _id: "gZ6Nvy",
//     txt: "Master Redux",
//     price: 9,
//     inStock: false,
//     createdAt: 1711472269690,
//     updatedAt: 1711472269690
// }

