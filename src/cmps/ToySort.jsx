import { useEffectUpdate } from "../hooks/useEffectUpdate.js"
import { debounce } from "../services/util.service.js"

import { useState, useEffect, useRef } from 'react'


export function ToySort({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedSetFilterRef = useRef(debounce(onSetFilterBy, 500))


    useEffectUpdate(() => {
        debouncedSetFilterRef.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.type === 'number' ? +target.value : target.value
        if (field === 'sortDir') value = target.checked ? -1 : 1

        setFilterByToEdit(prevSort => ({
            ...prevSort,
            [field]: value,
        }))
    }


    return (
        <div className="toy-sort container">
            <h4>Sort by:</h4>

            <select name="sort" value={filterByToEdit.sort} onChange={handleChange}>
                <option value="">Sort by</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Date</option>
            </select>
            <label>
                <input
                    type="checkbox"
                    name="sortDir"
                    checked={filterByToEdit.sortDir < 0}
                    onChange={handleChange}
                />
                Descending
            </label>
        </div>
    )
}
