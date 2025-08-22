import { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ToyFilter } from "../cmps/ToyFilter.jsx"
import { ToyList } from "../cmps/ToyList.jsx"
import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadToys, removeToy, saveToy } from "../store/actions/toy.actions.js"
import { getTruthyValues } from "../services/util.service.js"
import { SET_TOYS, SET_FILTER } from "../store/reducers/toy.reducer.js"
import { store } from "../store/store.js"

import { Link, useSearchParams } from 'react-router-dom'
import { PaginationBtns } from '../cmps/PaginationBtns.jsx'
import { ToySort } from '../cmps/ToySort.jsx'

export function ToyIndex() {
    const dispatch = useDispatch()

    const toys = useSelector(storeState => storeState.toyModule.toys)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)
    const filterBy = useSelector(storeState => storeState.toyModule.filterBy)

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams(getTruthyValues(filterBy))

        loadToys(filterBy)
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load toys')
            })

    }, [filterBy])

    function onSetFilterBy(filterBy) {
        dispatch({ type: SET_FILTER, filterBy })
    }

    function onRemoveToy(toyId) {
        const confirmation = confirm('Are you sure?')
        if (!confirmation) return
        removeToy(toyId)
            .then(() => {
                const updatedToys = toys.filter(toy => toy._id !== toyId)
                store.dispatch({ type: SET_TOYS, toys: updatedToys })
                showSuccessMsg(`Toy removed`)
            })

            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove toy ' + toyId)
            })
    }


    function onChangePageIdx(diff) {
        let newPageIdx = +filterBy.pageIdx + diff
        let maxPage = toyService.getMaxPage(toys.length)
        if (newPageIdx < 0) newPageIdx = maxPage - 1
        if (newPageIdx >= maxPage) newPageIdx = 0
        onSetFilterBy({ ...filterBy, pageIdx: newPageIdx, })
    }
    // if (!toys.length) return <div className="empty">No toys to show...</div>

    return (
        <section className="toy-index container">
            <ToySort filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <ToyFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <div>
                <Link to="/toy/edit" className="btn" >Add Toy</Link>
            </div>
            <h2>Toys List</h2>
            {isLoading ? <div className="loader"></div> :
                <Fragment>
                    <ToyList toys={toys} onRemoveToy={onRemoveToy} />
                    <hr />
                    <PaginationBtns filterBy={filterBy} onChangePageIdx={onChangePageIdx} />

                </Fragment>
            }
        </section>
    )
}