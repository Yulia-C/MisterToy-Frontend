import { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { ToyFilter } from "../cmps/ToyFilter.jsx"
import { ToyList } from "../cmps/ToyList.jsx"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { loadToys, removeToyOptimistic, setFilterBy } from "../store/actions/toy.actions.js"
import { getTruthyValues } from "../services/util.service.js"

import { Link, useSearchParams } from 'react-router-dom'
import { PaginationBtns } from '../cmps/PaginationBtns.jsx'
import { ToySort } from '../cmps/ToySort.jsx'

export function ToyIndex() {

    const toys = useSelector(storeState => storeState.toyModule.toys)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)
    const filterBy = useSelector(storeState => storeState.toyModule.filterBy)
    // const toyLabels = useSelector(storeState => storeState.toyModule.toyLabels)
    const maxPage = useSelector(storeState => storeState.toyModule.maxPage)
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams(getTruthyValues(filterBy))
        // loadToys(filterBy)
        //     .catch(err => {
        //         console.log('err:', err)
        //         showErrorMsg('Cannot load toys')
        //     })
        loadToys(filterBy)

    }, [filterBy])


    function onSetFilterBy(filterBy) {
        setFilterBy(filterBy)
    }

    async function onRemoveToy(toyId) {
        try {
            await removeToyOptimistic(toyId)
            loadToys()
            showSuccessMsg('Toy removed')
        } catch (error) {
            console.log('Cannot remove toy', error)
            showErrorMsg('Cannot remove toy')
        }
    }


    function onChangePageIdx(diff) {
        let newPageIdx = +filterBy.pageIdx + diff
        if (newPageIdx < 0) newPageIdx = maxPage - 1
        if (newPageIdx >= maxPage) newPageIdx = 0
        onSetFilterBy({ pageIdx: newPageIdx })
    }

    return (
        <section className="toy-index ">
            <section className="toy-sort-filter">
                <ToyFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <ToySort filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            </section>
            {loggedinUser &&
                <div className="container">
                    <Link to="/toy/edit" className="btn" >Add Toy</Link>
                </div>
            }
            {isLoading ? (<div className="loader"></div>) :
                (<Fragment>
                    <ToyList toys={toys} onRemoveToy={onRemoveToy} />
                    <hr />
                    <PaginationBtns filterBy={filterBy} onChangePageIdx={onChangePageIdx} />
                </Fragment>)}
        </section>
    )
}