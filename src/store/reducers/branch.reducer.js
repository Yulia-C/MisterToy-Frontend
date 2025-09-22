
// Branches
export const SET_BRANCHES = 'SET_BRANCHES'
export const REMOVE_BRANCH = 'REMOVE_BRANCH'
export const ADD_BRANCH = 'ADD_BRANCH'
export const UPDATE_BRANCH = 'UPDATE_BRANCH'

const initialState = {
    branches: [],
    lastBranches: [],
}

export function branchReducer(state = initialState, action = {}) {
    switch (action.type) {

        case SET_BRANCHES:
            return { ...state, branches: action.branches }
        case REMOVE_BRANCH:
            const lastBranches = [...state.branches]
            return {
                ...state,
                branches: state.branches.filter(branch => branch._id !== action.branchId),
                lastBranches
            }
        case ADD_BRANCH:
            return {
                ...state,
                branches: [...state.branches, action.branch]
            }
        case UPDATE_BRANCH:
            return {
                ...state,
                branches: state.branches.map(branch => branch._id === action.branch._id ? action.branch : branch)
            }
      
        default:
            return state
    }
}