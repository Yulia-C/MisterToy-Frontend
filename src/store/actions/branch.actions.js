import { branchService } from "../../services/branch.service.js";
import { showSuccessMsg } from "../../services/event-bus.service.js";
import { ADD_BRANCH, REMOVE_BRANCH, SET_BRANCHES, UPDATE_BRANCH } from "../reducers/branch.reducer.js";
import { store } from "../store.js";

export async function loadBranches() {
    try {
        const branches = await branchService.query()
        store.dispatch({ type: SET_BRANCHES, branches })
    } catch (err) {
        console.log('branch action -> Cannot load branches', err)
        throw err
    }
}

export async function removeBranch(branchId) {
    try {
        await branchService.remove(branchId)
        store.dispatch({ type: REMOVE_BRANCH, branchId })
        showSuccessMsg('Removed Branch!')
    } catch (err) {
        console.log('branch action -> Cannot remove branch', err)
        throw err
    }
}


export async function saveBranch(branch) {
    const type = branch._id ? UPDATE_BRANCH : ADD_BRANCH
    try {
        const savedBranch = await branchService.save(branch)
        store.dispatch({ type, branch: savedBranch })
        return savedBranch
    } catch (err) {
        console.log('branch action -> Cannot save branch', err)
        throw err
    }
}
