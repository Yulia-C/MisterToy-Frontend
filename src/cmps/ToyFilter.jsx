import { debounce } from "../services/util.service.js"
import  Select  from 'react-select'
import makeAnimated from 'react-select/animated';
import { useState, useEffect, useRef } from 'react'

export function ToyFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(debounce(onSetFilterBy, 500)).current

    // put a hook to check if it is a first render to prevent react to render twice
    useEffect(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            // default: break
            default:
                if (field === 'inStock') {
                    if (value === 'true') value = true
                    else if (value === 'false') value = false
                    else value = ''
                }
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, price, inStock} = filterByToEdit
    return (
        <section className="toy-filter container">
            <h2>Filter Toys</h2>
            <form onSubmit={onSubmitFilter}>
                <input value={txt || ''} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <input value={price || ''} onChange={handleChange}
                    type="number" placeholder="By Price" id="price" name="price"
                />
                <div className="radio-btns">

                    <label htmlFor="inStock-all">All
                        <input value='' id="inStock-all" type="radio" onChange={handleChange} name="inStock"
                            checked={filterByToEdit.inStock === ''} />
                    </label>
                    <label htmlFor="inStock-true">In Stock
                        <input value="true" id="inStock-true" type="radio" onChange={handleChange} name="inStock"
                            checked={filterByToEdit.inStock === true} />
                    </label>
                    <label htmlFor="inStock-false">Out of stock
                        <input value="false" id="inStock-false" type="radio" onChange={handleChange} name="inStock"
                            checked={filterByToEdit.inStock === false} />
                    </label>
                </div>
                {/* {toyLabels && } */}
                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}