import { debounce } from "../services/util.service.js"

import { useState, useEffect, useRef } from 'react'


export function ToySort({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedSetFilterRef = useRef(debounce(onSetFilterBy, 500))


    useEffect(() => {
        // Notify parent
        debouncedSetFilterRef.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(field) {
        // const field = target.name
        // let value = target.value

        // switch (target.type) {
        //     case 'number':
        //     case 'range':
        //         value = +value || ''
        //         break

        //     case 'checkbox':
        //         value = target.checked
        //         break

        //     default: break
        // }

        setFilterByToEdit(prev => ({
            ...prev,
            sort: field === prev.sort ? '' : field
        }))
    }
    function toggleSortDirection() {
        setFilterByToEdit(prev => ({
            ...prev,
            sortDir: prev.sortDir === 'asc' ? 'desc' : 'asc'
        }))
    }

    return (
        <div className="sort-container">
            <h4>Sort by:</h4>

            <label>
                <input
                    type="checkbox"
                    checked={filterByToEdit.sort === 'txt'}
                    onChange={() => handleChange('txt')}
                />
                Name
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={filterByToEdit.sort === 'createdAt'}
                    onChange={() => handleChange('createdAt')}
                />
                Created Time
            </label>

            <label>
                <input
                    type="checkbox"
                    checked={filterByToEdit.sort === 'price'}
                    onChange={() => handleChange('price')}
                />
                Price
            </label>

            {/* {filterByToEdit.sort && ( */}
                <button onClick={toggleSortDirection}>
                    {filterByToEdit.sortDir === 'asc' ? '⬆️ ' : '⬇️'}
                </button>
            {/* )} */}
        </div>
    )
}
