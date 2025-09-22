import { toyService } from "../../services/toy.service.js"
import { ADD_TOY, TOY_UNDO, REMOVE_TOY, SET_TOYS, SET_FILTER, SET_IS_LOADING, UPDATE_TOY, SET_TOY_LABELS, SET_MAX_PAGE, ADD_TO_CART, REMOVE_FROM_CART, TOGGLE_CART } from "../reducers/toy.reducer.js";
import { store } from "../store.js";

export async function loadToys(filterBy) {

    // const filterBy = store.getState().toyModule.filterBy
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    try {
        const { toys, maxPage } = await toyService.query(filterBy)
        store.dispatch({ type: SET_TOYS, toys })
        store.dispatch({ type: SET_MAX_PAGE, maxPage })

    } catch (err) {
        console.log('toy action -> Cannot load toys', err)
        throw err
    } finally {
        setTimeout(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        }, 350)
    }
}

export async function getToys() {
    try {
        const toys = await toyService.query()
    } catch (err) {
        console.log('toy action -> Cannot get toys', err)
        throw err
    }
}
export async function removeToy(toyId) {
    try {
        await toyService.remove(toyId)
        store.dispatch({ type: REMOVE_TOY, toyId })
    } catch (err) {
        console.log('toy action -> Cannot remove toy', err)
        throw err
    }
}

export async function removeToyOptimistic(toyId) {
    try {
        store.dispatch({ type: REMOVE_TOY, toyId })
        await toyService.remove(toyId)
    } catch (error) {
        store.dispatch({ type: TOY_UNDO })
        console.log('toy action -> Cannot remove toy', error)
        throw error
    }
}

export async function saveToy(toy) {
    const type = toy._id ? UPDATE_TOY : ADD_TOY
    try {
        const savedToy = await toyService.save(toy)
        store.dispatch({ type, toy: savedToy })
        return savedToy
    } catch (err) {
        console.log('toy action -> Cannot save toy', err)
        throw err
    }
}

export function setFilterBy(filterBy) {
    store.dispatch({ type: SET_FILTER, filterBy })
}

export function addToCart(toy) {
    store.dispatch({ type: ADD_TO_CART, toy })
}

export function removeFromCart(toyId) {
    store.dispatch({ type: REMOVE_FROM_CART, toyId })
}

export function toggleCart() {
    store.dispatch({ type: TOGGLE_CART })
}