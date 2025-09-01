import { httpService } from "./http.service.js"
import Axios from 'axios'

// console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'auth/'
const STORAGE_KEY_LOGGEDIN = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getById,
    getLoggedinUser,
    updateBalance,
    getEmptyCredentials,
    checkEmailExists
}


function login({ username, password, email }) {

    return httpService.post(BASE_URL + 'login/', { username, password, email })
        .then(user => {
            console.log('user FETCH:', user)
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid login')
        })
}

function signup({ username, password, fullname, email, gender, balance = 1000 }) {
    const user = { username, password, fullname, email, gender, balance }
    return httpService.post(BASE_URL + 'signup/', user)
        .then(user => {
            if (user) return _setLoggedinUser(user)
            else return Promise.reject('Invalid signup')
        })
}

function checkEmailExists(email) {
    return httpService.get(BASE_URL + 'check-email', { email })
}
function logout() {
    return httpService.post(BASE_URL + 'logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN)
        })
}

function updateBalance(diff) {
    if (getLoggedinUser().balance + diff < 0) return Promise.reject('No credit')
    return httpService.put('user/', { diff })

        .then(user => {
            console.log('updatebalance user:', user)
            _setLoggedinUser(user)
            return user.balance
        })
}

function getById(userId) {
    return httpService.get('user/' + userId)
}


function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN))
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, username: user.username, fullname: user.fullname, email: user.email, balance: user.balance }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave))
    return userToSave
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: '',
        password: '',
        email: '',
        gender: '',
        isAdmin: false,
    }
}
