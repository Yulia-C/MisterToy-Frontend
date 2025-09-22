import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"

const BRANCH_KEY = 'branchDB'
_createBranches()

export const branchService = {
    query,
    get,
    remove,
    save
}

function query() {
    return storageService.query(BRANCH_KEY)
}

function get(branchId) {
    return storageService.get(BRANCH_KEY + branchId)
        .then(branch => branch)
}

function remove(branchId) {
    return storageService.delete(BRANCH_KEY + branchId)
}

async function save(branch) {
    let savedBranch
    if (branch._id) {
        const branchToUpdate = {
            city: branch.city,
            address: branch.address,
            phoneNum: branch.phoneNum,
            hours: branch.hours,
            position: { lat: branch.position, lng: branch.position },
        }
        savedBranch = await storageService.put(BRANCH_KEY, branchToUpdate)

    } else {
        const branchToSave = {
            city: branch.city,
            address: branch.address,
            phoneNum: branch.phoneNum,
            hours: branch.hours,
            position: { lat: branch.position, lng: branch.position },
        }

        savedBranch = await storageService.post(BRANCH_KEY, branchToSave)
    }
    return savedBranch
}

export function _createBranches() {
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
    utilService.saveToStorage(BRANCH_KEY, branches)
    return branches
}