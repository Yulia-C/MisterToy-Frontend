import { userService } from "../../services/user.service.js"
import { SET_USER } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export async function login(credentials) {

    try {
       await  userService.login(credentials)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('user actions -> Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {
    try {
       await  userService.signup(credentials)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('user actions -> Cannot signup', err)
        throw err
    }
}

export async function logout(credentials) {
    try {
      await  userService.logout(credentials)
        store.dispatch({ type: SET_USER, user: null })
    } catch (err) {
        console.log('user actions -> Cannot logout', err)
        throw err
    }
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