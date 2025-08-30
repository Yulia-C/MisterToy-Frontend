import { toyService } from "../services/toy.service.js"
// import { toyService } from "../services/toy.service.local.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveToy } from "../store/actions/toy.actions.js"
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Select from "react-select"
import makeAnimated from 'react-select/animated'
import { useConfirmTabClose } from "../hooks/useConfirmTabClose.js"

export function ToyEdit() {

    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
    const navigate = useNavigate()
    const params = useParams()
    const toyLabels = useSelector(storeState => storeState.toyModule.toyLabels)
    const animatedComponents = makeAnimated()
    const labelOptions = toyLabels.map(label => ({
        value: label,
        label: label
    }))

    const selectedOptions = labelOptions.filter(option => toyToEdit.labels?.includes(option.value))

    const setHasUnsavedChanges = useConfirmTabClose()

    useEffect(() => {
        if (params.toyId) loadToy()
    }, [toyLabels])

    function loadToy() {
        toyService.get(params.toyId)
            .then(setToyToEdit)
            .catch(err => console.log('err:', err))
    }

    function handleChange(event, meta) {
        console.log('ev:', event)

        let field
        let value
        if (meta?.name === 'labels') {
            field = meta.name
            value = event.map(option => option.value)
        } else {
            const target = event.target
            field = target.name
            value = target.value

            switch (target.type) {
                case 'number':
                case 'range':
                    value = +value || ''
                    break

                case 'checkbox':
                    value = target.checked
                    break

                default:
                    break
            }
        }
        setToyToEdit(prevToyToEdit => ({ ...prevToyToEdit, [field]: value }))
        setHasUnsavedChanges(true)
    }

    function onSaveToy(ev) {
        ev.preventDefault()
        saveToy(toyToEdit)
            .then((savedToy) => {
                navigate('/toy')
                showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save toy')
                console.log('err:', err)
            })
    }

    const { txt, price, inStock } = toyToEdit
    if (!toyLabels?.length) return <div>Loading labels...</div>

    return (
        <section className="toy-edit">
            <form onSubmit={onSaveToy} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="price">Price:</label>
                <input onChange={handleChange} value={price} type="number" name="price" id="price" />

                {toyToEdit._id && (<label htmlFor="inStock">
                    <input onChange={handleChange} value={toyToEdit.inStock} type="checkbox"
                        checked={toyToEdit.inStock} name="inStock" id="inStock" />
                    In Stock</label>
                )}
                <Select
                    closeMenuOnSelect={false}
                    isMulti
                    name="labels"
                    options={labelOptions}
                    components={animatedComponents}
                    value={selectedOptions}
                    onChange={handleChange}
                    placeholder="Labels..."
                />
                <button>Save</button>
            </form>
        </section>
    )
}