import { userService } from "../../services/user.service.js"
import { CLEAR_CART } from "../reducers/toy.reducer.js"
import { SET_USER, SET_USERS, REMOVE_USER, UPDATE_USER, SET_USER_BALANCE } from "../reducers/user.reducer.js"
import { store } from "../store.js"

export async function login(credentials) {

    try {
        const user = await userService.login(credentials)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('user actions -> Cannot login', err)
        throw err
    }
}

export async function signup(credentials) {

    try {
        const user = await userService.signup(credentials)
        console.log('user-> actions:', user)
        store.dispatch({ type: SET_USER, user })
    } catch (err) {
        console.log('user actions -> Cannot signup', err)
        throw err
    }
}

export async function logout(credentials) {
    try {
        await userService.logout(credentials)
        store.dispatch({ type: SET_USER, user: null })
    } catch (err) {
        console.log('user actions -> Cannot logout', err)
        throw err
    }
}

export async function loadUsers() {
    try {
        const users = await userService.query()
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.log('user actions -> Cannot load users', err)
        throw err
    }
}

export async function removeUser(userId) {
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.log('user actions -> Cannot remove user', err)
        throw err
    }
}

export async function updateBalance(amount) {
    try {
        const user = userService.getLoggedinUser()

        if (user.balance + amount < 0) {
            throw new Error('No credit')
        }
        const updatedUser = await userService.updateBalance(-amount)
        store.dispatch({ type: SET_USER_BALANCE, balance: updatedUser.balance })
        store.dispatch({ type: CLEAR_CART })

    } catch (err) {
        console.log('user actions -> Cannot update balance', err)
        throw err
    }
}

export async function updateUserDetails(detailsToUpdate) {
    try {
        const updatedUser = await userService.update(detailsToUpdate)
        store.dispatch({ type: UPDATE_USER, update: updatedUser })
    } catch (err) {
        console.log('user actions -> Cannot update user', err)
        throw err
    }
}