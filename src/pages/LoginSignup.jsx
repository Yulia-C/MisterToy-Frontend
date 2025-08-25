import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
// import { userService } from '../services/user.service.js'
import { userService } from '../services/user.service.local.js'
import { login, signup } from '../store/actions/user.actions.js'
import { useSelector } from 'react-redux'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from 'react-router-dom'

export function LoginSignup() {

    const [credentials, setCredentials] = useState(userService.getEmptyCredentials())
    const loggedinUser = useSelector(storeState => storeState.loggedinUser)

    const navigate = useNavigate()
    const location = useLocation()
    const isSignup = location.pathname.includes('signup')

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }
    useEffect(() => {

    }, [loggedinUser])

    function handleSubmit(ev) {
        ev.preventDefault()
        onLogin(credentials)
    }

    function onLogin(credentials) {
        if (isSignup) {
            signup(credentials)
                .then(() => {
                    showSuccessMsg('Signed in successfully')
                    navigate('/toy')
                })
                .catch(err => showErrorMsg("Had problem signing in"))
        } else {
            login(credentials)
                .then(() => {
                    showSuccessMsg('Logged in successfully')
                    navigate('/toy')
                })
                .catch(err => showErrorMsg("Had problem logging in"))
        }
    }


    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>
                <input
                    id='username'
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                    />
                <label htmlFor='password'>Password:</label>
                <input
                    id='password'
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                <label htmlFor='fullname'>Full Name:</label>
                {isSignup && <input
                    type="text"
                    id='fullname'
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />}
                <button>{isSignup ? 'Signup' : 'Login'}</button>
            </form>
            <div className="btns">

                {/* <a href="/auth" onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a > */}

            </div>
        </div >
    )
}
