

import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveToy } from "../store/actions/toy.actions.js"
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useConfirmTabClose } from "../hooks/useConfirmTabClose.js"
import { ImgUploader } from '../cmps/ImgUploader.jsx';

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

export function ToyEdit() {

    const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
    const navigate = useNavigate()
    const { toyId } = useParams()
    const labels = toyService.getToyLabels()
    const setHasUnsavedChanges = useConfirmTabClose()

    useEffect(() => {
        if (!toyId) return
        loadToy()

    }, [])

    async function loadToy() {
        try {
            const toy = await toyService.get(toyId)
            setToyToEdit(toy)
        } catch (error) {
            console.log('Had issued in toy edit:', error)
            navigate('/toy')
            showErrorMsg('Toy not found!')
        }
    }

    const ToySchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Too Short!')
            .max(50, 'Too Long!'),
        price: Yup.number()
            .required('Price is required')
            .min(1, 'Price must be at least 1'),
        inStock: Yup.boolean(),
        labels: Yup.array().of(Yup.string()).required('Select at least one label'),
        imgUrl: Yup.string().url('Must be a valid URL')
    })

    function customHandleChange(ev, handleChange) {
        handleChange(ev)
        setHasUnsavedChanges(true)
    }

    function onSaveToy(toyToEdit, { resetForm }) {
        saveToy(toyToEdit)
            .then((savedToy) => {
                showSuccessMsg(`Toy Saved (id: ${savedToy._id})`)
                navigate('/toy')
            })
            .catch(err => {
                showErrorMsg('Cannot save toy')
                console.log('err:', err)
            })
            .finally(() => {
                resetForm()
            })
    }

    return (
        <section className="toy-edit">
            <h2>{toyToEdit._id ? 'Edit' : 'Add'} Toy</h2>
            <Formik
                enableReinitialize
                initialValues={toyToEdit}
                validationSchema={ToySchema}
                onSubmit={onSaveToy}
            >
                {({ errors, touched, values, handleChange, setFieldValue }) => (
                    <Form>
                        <Field
                            as={TextField}
                            label="Name"
                            variant="outlined"
                            name="name"
                            required
                            margin="normal"
                            error={touched.name && !!errors.name}
                            helperText={touched.name && errors.name}
                            onChange={e => customHandleChange(e, handleChange)}
                            value={values.name}
                        />

                        <Field
                            as={TextField}
                            label="Price"
                            variant="outlined"
                            type="number"
                            name="price"
                            required
                            margin="normal"
                            inputProps={{ min: 1 }}
                            error={touched.price && !!errors.price}
                            helperText={touched.price && errors.price}
                            onChange={e => customHandleChange(e, handleChange)}
                            value={values.price}
                        />
                        <ImgUploader onUploaded={(imgUrl) => setFieldValue('imgUrl', imgUrl)} />

                        <FormControl margin="normal" style={{ minWidth: '20vw' }} variant="outlined">
                            <InputLabel id="labels-label">Labels</InputLabel>
                            <Select
                                labelId="labels-label"
                                id="labels"
                                multiple
                                name="labels"
                                value={values.labels}
                                onChange={ev => {
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

                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="inStock"
                                    checked={values.inStock}
                                    onChange={e => customHandleChange(e, handleChange)}
                                />

                            }
                            label="In stock"
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {toyToEdit._id ? 'Save' : 'Add'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </section>
    )
}
