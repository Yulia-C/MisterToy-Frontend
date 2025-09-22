import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"

const STORAGE_KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'

export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    remove,
    updateBalance,
    updateUserPrefs,
    checkEmailExists,
    getEmptyCredentials
}

_createUsers()

async function query() {
    const users = await storageService.query(STORAGE_KEY)
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get(STORAGE_KEY, userId)
}

async function remove(userId) {
    return await storageService.remove(STORAGE_KEY, userId)
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: '',
        password: '',
        email: '',
        gender: '',
        balance: 1000,
        isAdmin: false,
        imgUrl: ''
    }
}


async function checkEmailExists(email) {
    const users = await query()
    return users.some(user => user.email === email)

}

async function login({ username, password }) {
    const users = await storageService.query(STORAGE_KEY)

    const user = users.find(user => user.username === username)
    if (user) return _setLoggedinUser(user)

    else return Promise.reject('Invalid login')

}

async function signup(credentials) {
    let user = credentials
    if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    const userToAdd = {
        createdAt: Date.now(),
        username: user.username,
        password: user.password,
        fullname: user.fullname,
        email: user.email,
        gender: user.gender,
        imgUrl: user.imgUrl,
        balance: user.balance,
        isAdmin: user.isAdmin,
    }
    delete userToAdd.password

    const loggedinUser = await storageService.post(STORAGE_KEY, user)
    return _setLoggedinUser(user)
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
    return Promise.resolve()
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = {
        _id: user._id, fullname: user.fullname,
        isAdmin: user.isAdmin, balance: user.balance,
        imgUrl: user.imgUrl
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

async function updateBalance(diff) {
    let user = await getById(getLoggedinUser()._id)

    if (user.balance + diff < 0) return Promise.reject('No credit')
    user.balance += diff

    user = await storageService.put(STORAGE_KEY, user)
    _setLoggedinUser(user)
    return user.balance

}

function updateUserPrefs(updatedUser) {
    return userService.getById(userService.getLoggedinUser()._id)
        .then(user => {
            user = { ...user, ...updatedUser }
            return storageService.put(STORAGE_KEY, updatedUser)
                .then((updatedUser) => {
                    _setLoggedinUser(updatedUser)
                    return updatedUser
                })
        })
}


// async function _createAdmin() {
//     const admin = {
//         createdAt: Date.now(),
//         username: 'admin',
//         password: 'admin',
//         fullname: 'Admin Adminov',
//         email: 'admin@.m.com',
//         gender: 'female',
//         imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
//         balance: 1000,
//         isAdmin: true,
//     }

//     return await storageService.post(STORAGE_KEY, admin)
// }

async function _createUsers() {
    let users = utilService.loadFromStorage(STORAGE_KEY)
    if (!users || !users.length) {
        users = [{
            createdAt: Date.now(),
            username: 'admin',
            password: 'admin',
            fullname: 'Admin Adminov',
            email: 'admin@.m.com',
            gender: 'female',
            imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            balance: 1000,
            isAdmin: true,
            _id:'87686'
        },
        {
            createdAt: Date.now(),
            username: 'johndoe',
            password: 'pass123',
            fullname: 'John Doe',
            email: 'john@example.com',
            gender: 'male',
            imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            balance: 500,
            isAdmin: false,
            _id:'3453'
        },
        {
            createdAt: Date.now(),
            username: 'janedoe',
            password: 'pass123',
            fullname: 'Jane Doe',
            email: 'jane@example.com',
            gender: 'female',
            imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            balance: 750,
            isAdmin: false,
            _id:'8768'
        },
        {
            createdAt: Date.now(),
            username: 'bobsmith',
            password: 'pass123',
            fullname: 'Bob Smith',
            email: 'bob@example.com',
            gender: 'male',
            imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            balance: 300,
            isAdmin: false,
            _id:'64565'
        },
        {
            createdAt: Date.now(),
            username: 'lisawong',
            password: 'pass123',
            fullname: 'Lisa Wong',
            email: 'lisa@example.com',
            gender: 'female',
            imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            balance: 900,
            isAdmin: false,
            _id:'435'
        },
        {
            createdAt: Date.now(),
            username: 'davidlee',
            password: 'pass123',
            fullname: 'David Lee',
            email: 'david@example.com',
            gender: 'male',
            imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
            balance: 650,
            isAdmin: false,
            _id:'123123'
        }
        ]

        return utilService.saveToStorage(STORAGE_KEY, users)

    }
}