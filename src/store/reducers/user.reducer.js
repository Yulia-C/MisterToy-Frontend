import { userService } from "../../services/user.service.js"

//* User
export const SET_USER = 'SET_USER'
export const SET_USER_BALANCE = 'SET_USER_BALANCE'
export const SET_USERS = 'SET_USERS'
export const REMOVE_USER = 'REMOVE_USER'
export const UPDATE_USER = 'UPDATE_USER'

const initialState = {
    loggedinUser: userService.getLoggedinUser(),
    users: [],

}

export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        //* User
        case SET_USER:
            return {
                ...state,
                loggedinUser: action.user
            }
        case SET_USERS:
            return {
                ...state,
                loggedinUser: action.users
            }
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.userId)
            }

        case SET_USER_BALANCE:
            return {
                ...state,
                loggedinUser: {
                    ...state.loggedinUser,
                    balance: action.balance
                }
            }

        case UPDATE_USER:
            return {
                ...state,
                loggedinUser: {
                    ...state.loggedinUser,
                    ...action.update,
                }
            }


        default:
            return state;
    }
}