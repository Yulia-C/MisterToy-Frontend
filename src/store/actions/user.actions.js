import { userService } from "../../services/user.service.js"
import { SET_USER } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export function login(credentials) {
    console.log('credentials:', credentials)
    return userService.login(credentials)
        .then((user) => {
            console.log('user login:', user)
            store.dispatch({ type: SET_USER, user })
        })
        .catch((err) => {
            console.log('user actions -> Cannot login', err)
            throw err
        })
}

export function signup(credentials) {
    return userService.signup(credentials)
        .then((user) => {
            store.dispatch({ type: SET_USER, user })
        })
        .catch((err) => {
            console.log('user actions -> Cannot signup', err)
            throw err
        })
}

export function logout(credentials) {
    return userService.logout(credentials)
        .then(() => {
            store.dispatch({ type: SET_USER, user: null })
        })
        .catch((err) => {
            console.log('user actions -> Cannot logout', err)
        })
}

// export function checkout(diff) {
//     return userService.updateBalance(-diff)
//         .then((newBalance) => {
//             store.dispatch({ type: SET_USER_BALANCE, balance: newBalance })
//         })
//         .catch((err) => {
//             console.log('user actions -> Cannot checkout', err)
//             throw err
//         })
// }

export function updateBalance(amount) {
    return userService.updateBalance(+amount)
        .then(updatedBalance => store.dispatch({ type: SET_USER_BALANCE, balance: updatedBalance }))
}

export function updateUserDetails(updatedUser) {
    userService.updateUserPrefs(updatedUser)
        .then((updatedUser) => store.dispatch({ type: UPDATE_USER, update: updatedUser }))
}