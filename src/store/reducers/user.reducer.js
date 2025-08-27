import { userService } from "../../services/user.service.js"
// import { userService } from "../../services/user.service.local.js"

//* User
export const SET_USER = 'SET_USER'


const initialState = {
    loggedinUser: userService.getLoggedinUser()
}

export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        //* User
        case SET_USER:
            return {
                ...state,
                loggedinUser: action.user
            }

        default:
            return state;
    }
}