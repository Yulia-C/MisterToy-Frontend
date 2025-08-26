import { debounce } from "../services/util.service.js"

import { useState, useEffect, useRef } from 'react'


export function ToySort({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedSetFilterRef = useRef(debounce(onSetFilterBy, 500))


    useEffect(() => {
        // Notify parent
        debouncedSetFilterRef.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break


            default: break
        }
        if (field === 'sortDir') value = target.checked ? -1 : 1
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))

        // setFilterByToEdit(prev => ({
        //     ...prev,
        //     sort: field === prev.sort ? '' : field
        // }))
    }


    return (
        <div className="sort-container">
            <h4>Sort by:</h4>

            <select name="type" value={filterByToEdit.type} onChange={handleChange}>
                <option value="">Sort by</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Date</option>
            </select>
            <label>
                <input
                    type="checkbox"
                    name="sortDir"
                    checked={filterByToEdit.sortDir<0}
                    onChange={handleChange}
                />
                Descending
            </label>
        </div>
    )
}
