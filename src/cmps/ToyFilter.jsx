import { debounce } from "../services/util.service.js"
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { useState, useEffect, useRef } from 'react'
import { useEffectUpdate } from "../hooks/useEffectUpdate.js"

export function ToyFilter({ filterBy, onSetFilterBy, toyLabels }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(debounce(onSetFilterBy, 500)).current

    const animatedComponents = makeAnimated()
    const labelOptions = toyLabels.map(label => ({
        value: label,
        label: label
    }))

    const selectedOptions = labelOptions.filter(option => filterByToEdit.labels?.includes(option.value))

    useEffectUpdate(() => {
        onSetFilterDebounce(filterByToEdit)
    }, [filterByToEdit])

    function handleChange(event, meta) {
        if (meta?.name === 'labels') {
            const selectedLabels = event.map(option => option.value)
            setFilterByToEdit(prev => ({ ...prev, labels: selectedLabels }))
            return
        }

        const target = event.target
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

            default: break
        }
        if (field === 'inStock') {
        if (value === true || value === 'true') value = true
        else if (value === false || value === 'false') value = false
        else value = ''
    }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, price, inStock, labels } = filterByToEdit
    return (
        <section className="container">
            <h2>Filter Toys</h2>
            <form className="toy-filter container" onSubmit={onSubmitFilter}>
                {toyLabels && (<div>
                    <Select
                        closeMenuOnSelect={false}
                        isMulti
                        name="labels"
                        options={labelOptions}
                        components={animatedComponents}
                        value={selectedOptions}
                        onChange={handleChange}
                        placeholder="Filter by labels..." /></div>
                )}
                <input value={txt || ''} onChange={handleChange}
                    type="search" placeholder="By Txt" id="txt" name="txt"
                />
                <input style={{ width: '80px' }} value={price || ''} onChange={handleChange}
                    type="number" placeholder="By Price" id="price" name="price"
                />

                <div className="radio-btns">

                    <label htmlFor="inStock-all">
                        <input value='' id="inStock-all" type="radio" onChange={handleChange} name="inStock"
                            checked={filterByToEdit.inStock === ''} />All
                    </label>
                    <label htmlFor="inStock-true">
                        <input value="true" id="inStock-true" type="radio" onChange={handleChange} name="inStock"
                            checked={filterByToEdit.inStock === true} />In Stock
                    </label>
                    <label htmlFor="inStock-false">
                        <input value="false" id="inStock-false" type="radio" onChange={handleChange} name="inStock"
                            checked={filterByToEdit.inStock === false} />Out of stock
                    </label>
                </div>

                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}