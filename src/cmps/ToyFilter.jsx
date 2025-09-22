import { debounce } from "../services/util.service.js"
// import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { useState, useEffect, useRef } from 'react'
import { useEffectUpdate } from "../hooks/useEffectUpdate.js"
import { toyService } from "../services/toy.service.js"

import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'Yup'


export function ToyFilter({ filterBy, onSetFilterBy }) {
    const labels = toyService.getToyLabels()

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(debounce(onSetFilterBy, 500)).current

    // const animatedComponents = makeAnimated()
    // const labelOptions = labels.map(label => ({
    //     value: label,
    //     label: label
    // }))

    // const selectedOptions = labels.filter(option => filterByToEdit.labels?.includes(option))

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
        if (value === 'labels') {
            value = Array.from(target.selectedOptions, option => option.value || [])
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(filterByToEdit) {
        // ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { txt, price, inStock } = filterByToEdit
    return (
        <section className="container">
            <h2>Filter Toys</h2>
            <div className="toy-filter">

                <form onSubmit={onSubmitFilter}>
                    <input value={txt || ''} onChange={handleChange}
                        type="search" placeholder="By Txt" id="txt" name="txt"
                    />
                    <input style={{ width: '80px' }} value={price || ''} onChange={handleChange}
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

                </form>
                <Formik className="formik-filter"
                    enableReinitialize
                    initialValues={filterByToEdit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <FormControl margin="normal" style={{ minWidth: '20vw' }} variant="outlined">
                                <InputLabel id="labels-label">Labels</InputLabel>
                                <Select
                                    labelId="labels-label"
                                    id="labels"
                                    multiple
                                    name="labels"
                                    value={values.labels}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setFieldValue('labels', ev.target.value)
                                    }}
                                    renderValue={selected => selected.join(', ')}
                                    label="Labels"
                                >
                                    {labels.map(label => (
                                        <MenuItem key={label} value={label}>
                                            <Checkbox checked={values.labels.includes(label)} />
                                            <ListItemText primary={label} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Form>
                    )}
                </Formik>
            </div>

        </section >

    )
}