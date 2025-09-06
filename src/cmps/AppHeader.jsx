import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { UserMsg } from "./UserMsg.jsx"
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


export function AppHeader() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const [isSignup, setIsSignUp] = useState(false)
    const navigate = useNavigate()

    const { t, i18n } = useTranslation()

    const lngs = {
        en: { nativeName: 'English' },
        ru: { nativeName: 'Russian' },
        he: { nativeName: 'Hebrew' },
    }

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

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>'React' Toy App</h1>
                {Object.keys(lngs).map(lng => (
                    <button
                        key={lng}
                        className="btn"
                        onClick={() => i18n.changeLanguage(lng)}
                        disabled={i18n.resolvedLanguage === lng}
                    >
                        {lngs[lng].nativeName}
                    </button>
                ))}

                <nav className="app-nav">
                    <NavLink to="/">{t('home')}</NavLink>
                    <NavLink to="/toy">{t('toys')}</NavLink>
                    <NavLink to="/dashboard">{t('dashboard')}</NavLink>
                    <NavLink to="/about">{t('about')}</NavLink>

                    {loggedinUser ? (
                        < section>
                            <Link to={`/user/${loggedinUser._id}`}>{t('hello')} {loggedinUser.fullname} <span className="balance">{loggedinUser.balance}</span></Link>
                            <button onClick={onLogout}>{t('logout')}</button>
                        </ section >
                    ) : (<button onClick={handleAuthToggle}>
                        {isSignup ?
                            t('signup') :
                            t('login')}
                    </button>)
                    }
                </nav>
            </section >
            <UserMsg />
        </header >
    )
}
