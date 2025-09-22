import { toyService } from "../../services/toy.service.js"

//* Toys
export const SET_TOYS = 'SET_TOYS'
export const REMOVE_TOY = 'REMOVE_TOY'
export const ADD_TOY = 'ADD_TOY'
export const UPDATE_TOY = 'UPDATE_TOY'
export const SET_TOY_LABELS = 'SET_TOY_LABELS'

export const TOY_UNDO = 'TOY_UNDO'
export const SET_DONE_TOYS_PERCENT = ' SET_DONE_TOYS_PERCENT'
export const SET_MAX_PAGE = 'SET_MAX_PAGE'

export const SET_FILTER = 'SET_FILTER'
export const SET_IS_LOADING = 'SET_IS_LOADING'

export const TOGGLE_CART = 'TOGGLE_CART'
export const ADD_TO_CART = 'ADD_TO_CART'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'
export const CLEAR_CART = 'CLEAR_CART'


const initialState = {
    toys: [],
    isLoading: false,
    filterBy: toyService.getDefaultFilter(),
    lastToys: [],
    maxPage: 0,
    cart: [],
}

export function toyReducer(state = initialState, action = {}) {
    switch (action.type) {
        //* Toys
        case SET_TOYS:
            return { ...state, toys: action.toys }
        case REMOVE_TOY:
            const lastToys = [...state.toys]
            return {
                ...state,
                toys: state.toys.filter(toy => toy._id !== action.toyId),
                lastToys
            }
        case ADD_TOY:
            return {
                ...state,
                toys: [...state.toys, action.toy]
            }
        case UPDATE_TOY:
            return {
                ...state,
                toys: state.toys.map(toy => toy._id === action.toy._id ? action.toy : toy)
            }

        case SET_MAX_PAGE:
            return { ...state, maxPage: action.maxPage }

        case SET_DONE_TOYS_PERCENT:
            return { ...state, progressStats: cmd.progressStats }

        case SET_FILTER:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...action.filterBy }
            }

        case SET_IS_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        case TOY_UNDO:
            return {
                ...state,
                toys: [...state.lastToys]
            }

        case TOGGLE_CART:
            return { ...state, showCart: !state.showCart }

        case ADD_TO_CART:
            return { ...state, cart: [...state.cart, action.toy] }

        case REMOVE_FROM_CART:
            var cart = state.cart.filter((toy) => toy._id !== action.toyId)
            return { ...state, cart }

        case CLEAR_CART:
            return { ...state, cart: [] }

        default:
            return state
    }
}