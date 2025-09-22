import { Formik, Form, Field } from 'formik';
import * as Yup from 'Yup';
import Button from '@mui/material/Button';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
import { login, signup } from '../store/actions/user.actions.js'
import { useSelector } from 'react-redux'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router'
import { ImgUploader } from './ImgUploader.jsx';

const SignupSchema = Yup.object().shape({
    fullname: Yup.string()
        .min(4, 'Too short')
        .max(50, 'Too long')
        .when('isSignup', {
            is: true,
            then: (schema) => schema.required('Required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    username: Yup.string().min(2).max(50).required('Required'),
    email: Yup.string().required('Email is required')
        .test('unique-email', 'Email is already in use',
            async function (value) {
                return await userService.checkEmailExists(value)
                    .then(() => { return true })
                    .catch(() => { return false })
            }),
    password: Yup.string().min(5).required('Required'),
    gender: Yup.string().oneOf(['male', 'female'], 'Select gender')
        .when('isSignup', {
            is: true,
            then: (schema) => schema.required('Required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    imgUrl: Yup.string().url('Must be a valid URL').when('isSignup', {
        is: true,
        then: (schema) => schema.required('Image is required'),
        otherwise: (schema) => schema.notRequired()
    })
})

function CustomInput({ field }) {
    return (
        <div>
            <label htmlFor="gender-f">Female
                <input
                    id="gender-f"
                    type="radio"
                    value="female"
                    name={field.name}
                    checked={field.value === 'female'}
                    onChange={field.onChange}
                />
            </label>

            <label htmlFor="gender-m">Male
                <input
                    id="gender-m"
                    type="radio"
                    value="male"
                    name={field.name}
                    checked={field.value === 'male'}
                    onChange={field.onChange}
                />
            </label>
        </div>
    )
}

export function FormikLoginSignUp() {

    // const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
    const loggedinUser = useSelector(storeState => storeState.loggedinUser)

    const navigate = useNavigate()
    const location = useLocation()
    const isSignup = location.pathname.includes('signup')


    useEffect(() => {

    }, [loggedinUser])

    async function onLogin(credentials) {
        if (isSignup) {
            try {
                await signup(credentials)
                showSuccessMsg('Signed up successfully')
                navigate('/toy')

            } catch (err) {

                showErrorMsg("Had problem signing in")
            }
        } else {
            try {
                await login(credentials)
                showSuccessMsg('Logged in successfully')
                navigate('/toy')

            } catch (err) {
                showErrorMsg("Had problem logging in")
            }
        }
    }

    function formValidationClass(errors, touched) {
        const isError = !!Object.keys(errors).length
        const isTouched = !!Object.keys(errors).length

        if (isTouched) return ''
        return isError ? 'error' : 'valid'
    }

    return (
        <section className="form-container">
            <h2>{isSignup ? 'Signup' : 'Login'}</h2>

            <div className="my-form">
                <Formik
                    initialValues={userService.getEmptyCredentials()}
                    validationSchema={SignupSchema}
                    validateOnChange={false}
                    validateOnBlur={true}
                    onSubmit={(values) => {
                        onLogin(values)
                    }}
                >
                    {({ errors, touched, setFieldValue }) => {
                        const validationClass = formValidationClass(errors, touched)

                        return (
                            <Form className={`formik ${validationClass}`}>
                                {isSignup && (
                                    <>
                                        <Field label="fullname" name="fullname" placeholder='Your full name'
                                        />
                                        {errors.fullname && touched.fullname && (
                                            <div className="errors">{errors.fullname}</div>
                                        )}
                                    </>
                                )}
                                <Field label="username" name="username" placeholder='Username'
                                />
                                {errors.username && touched.username && (
                                    <div className="errors">{errors.username}</div>
                                )}
                                <Field label="password" type="password" name="password" placeholder='Your password'
                                />
                                {errors.password && touched.password && (
                                    <div className="errors">{errors.password}</div>
                                )}
                                <Field label="email" type="email" name="email" placeholder='example@email.com'
                                />
                                {errors.email && touched.email && (
                                    <div className="errors">{errors.email}</div>
                                )}
                                {isSignup && (
                                    <>
                                        <Field component={CustomInput} label="gender" name="gender" />
                                        {errors.gender && touched.gender && (
                                            <div className="errors">{errors.gender}</div>
                                        )}
                                        <ImgUploader onUploaded={(imgUrl) => setFieldValue('imgUrl', imgUrl)} />
                                    </>
                                )}
                                <Button className={validationClass} variant="contained" type="submit">
                                    {isSignup ? 'Signup' : 'Login'}
                                </Button>
                            </Form>
                        )
                    }}
                </Formik >


            </div>

        </section >
    );
};


// ReactDOM.render(<WithMaterialUI />, document.getElementById('root'));
