import { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ToyFilter } from "../cmps/ToyFilter.jsx"
import { ToyList } from "../cmps/ToyList.jsx"
import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadToys, removeToy, saveToy, setFilterBy } from "../store/actions/toy.actions.js"
import { getTruthyValues } from "../services/util.service.js"
import { SET_TOYS, SET_FILTER } from "../store/reducers/toy.reducer.js"
import { store } from "../store/store.js"

import { Link, useSearchParams } from 'react-router-dom'
import { PaginationBtns } from '../cmps/PaginationBtns.jsx'
import { ToySort } from '../cmps/ToySort.jsx'

export function ToyIndex() {

    const toys = useSelector(storeState => storeState.toyModule.toys)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)
    const filterBy = useSelector(storeState => storeState.toyModule.filterBy)
    const toyLabels = useSelector(storeState => storeState.toyModule.toyLabels)
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
        setFilterBy(filterBy)
    }

   async function onRemoveToy(toyId) {
    const confirmation = confirm('Are you sure?')
    if (!confirmation) return

    try {
        await removeToy(toyId)
        const updatedToys = toys.filter(toy => toy._id !== toyId)
        store.dispatch({ type: SET_TOYS, toys: updatedToys })
        showSuccessMsg('Toy removed')
    } catch (err) {
        console.log('err:', err)
        showErrorMsg('Cannot remove toy ' + toyId)
    }
}

    function onChangePageIdx(diff) {
        let newPageIdx = +filterBy.pageIdx + diff

        let maxPage = toyService.getMaxPage(toys.length)
        if (newPageIdx < 0) return
        if (newPageIdx >= maxPage - 1) return
        onSetFilterBy({ ...filterBy, pageIdx: newPageIdx })
    }

    return (
        <section className="toy-index container">
            <section className="toy-sort-filter">
                <ToyFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} toyLabels={toyLabels} />
                <ToySort filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            </section>
            <div className="container">
                <Link to="/toy/edit" className="btn" >Add Toy</Link>
            </div>
            {isLoading ? (<div className="loader"></div>) :
                (<Fragment>
                    <ToyList toys={toys} onRemoveToy={onRemoveToy} />
                    <hr />
                    <PaginationBtns filterBy={filterBy} onChangePageIdx={onChangePageIdx} />
                </Fragment>)}
        </section>
    )
}