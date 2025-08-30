import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { UserMsg } from "./UserMsg.jsx"
import { LoginSignup } from '../pages/LoginSignup.jsx'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'

import { Link, NavLink, useNavigate } from 'react-router-dom'


export function AppHeader() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const [isSignup, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    function handleAuthToggle() {
        const newSignupState = !isSignup
        setIsSignUp(newSignupState)
        navigate(newSignupState ? '/auth/signup' : 'auth/login')
    }

    function onLogout() {
        logout()
            .then(() => showSuccessMsg('Logged out'))
            .catch(err => {
                showErrorMsg('OOPs try again')
            })
    }
    // const formattedPercent = toys ? progressStats.toFixed(2) + '%' : null

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>'React' Toy App</h1>
                <nav className="app-nav">

                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/toy" >Toys</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>

                    {loggedinUser ? (

                        < section >
                            <Link to={`/user/${loggedinUser._id}`}>Hello {loggedinUser.fullname} <span className="balance">{loggedinUser.balance}</span></Link>
                            <button onClick={onLogout}>Logout</button>
                        </ section >
                    ) : (<button onClick={handleAuthToggle}>
                        {isSignup ?
                            'Already a member? Login' :
                            'New user? Signup here'}
                    </button>)
                    }
                </nav>
            </section >
            <UserMsg />
        </header >
    )
}
