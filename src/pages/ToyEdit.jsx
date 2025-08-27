import { toyService } from "../services/toy.service.js"
// import { toyService } from "../services/toy.service.local.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveToy } from "../store/actions/toy.actions.js"

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function ToyEdit() {

    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.toyId) loadToy()
    }, [])

    function loadToy() {
        toyService.get(params.toyId)
            .then(setToyToEdit)
            .catch(err => console.log('err:', err))
    }

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

            default:
                break
        }

        setToyToEdit(prevToyToEdit => ({ ...prevToyToEdit, [field]: value }))
    }

    function onSaveToy(ev) {
        ev.preventDefault()
        saveToy(toyToEdit)
            .then((savedToy ) => {
                navigate('/toy')
                showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save toy')
                console.log('err:', err)
            })
    }

    const { txt, price, inStock } = toyToEdit

    return (
        <section className="toy-edit">
            <form onSubmit={onSaveToy} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="price">Price:</label>
                <input onChange={handleChange} value={price} type="number" name="price" id="price" />

                <label htmlFor="inStock">
                    <input onChange={handleChange} value={inStock} type="checkbox" name="inStock" id="inStock" />
                    In Stock</label>


                <button>Save</button>
            </form>
        </section>
    )
}