import { Rating } from "@mui/material"
import { useEffect, useState } from "react"
import { Formik, Form, Field } from 'formik';
import { useSelector } from "react-redux";
import * as Yup from 'Yup';
import { addReview, loadReviews } from "../store/actions/review.actions";
import { useParams } from "react-router-dom";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service";
import { loadToys } from "../store/actions/toy.actions";


export function ReviewEdit({ onClose }) {
    const toys = useSelector(storeState => storeState.toyModule.toys)

    const { toyId } = useParams()
    const toy = toys.find(t => t._id === toyId)

    useEffect(() => {
        loadToys()

    }, [toy])

    async function onAddreview(review) {
        try {
            await addReview(review)
            loadReviews()
            showSuccessMsg('Review added')

        } catch (err) {
            showErrorMsg('Cannot add review')
        }

    }
    return (
        <Formik
            initialValues={{ txt: '', rating: '', aboutToyId: toy?._id }}
            onSubmit={(values, { resetForm }) => {
                const reviewToSave = {
                    ...values,
                }

                console.log('Review saved:', reviewToSave)
                onAddreview(reviewToSave)
                resetForm()
                setTimeout(() => {
                    if (onClose) onClose();
                }, 300);
            }}
        >

            {({ setFieldValue, values }) => (
                <Form className="review-form">
                    <div className='review-div'>


                        <label name="aboutToyId" value={values.aboutUserId} >
                            <h3>Review about {toy?.name}</h3>
                        </label>


                        <label htmlFor="txt">Review</label>
                        <Field name="txt" as="textarea" />

                        <label htmlFor="rating">Rating</label>
                        <Rating
                            name="rating"
                            value={values.rating}
                            onChange={(event, newValue) => {
                                setFieldValue('rating', newValue);
                            }}
                        />

                        <button type="submit">Submit</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}