import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { UserMsg } from "./UserMsg.jsx"
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { logout } from '../store/actions/user.actions.js'

import { Link, NavLink, useNavigate } from 'react-router-dom'
import { toggleCart } from '../store/actions/toy.actions.js'
import { ShoppingCart } from './ShoppingCart.jsx'
import { NicePopup } from './NicePopup.jsx'


export function AppHeader() {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)
    const [isSignup, setIsSignUp] = useState(false)

    const showCart = useSelector((state) => state.toyModule.showCart)
    const cart = useSelector((state) => state.toyModule.cart)


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


    function getCartTotal(cart) {
        return cart.reduce((acc, toy) => acc + toy, 0)
    }
    const cartCount = getCartTotal(cart)

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>Toy Haven</h1>
                <nav className="app-nav">

                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/about" >About</NavLink>
                    <NavLink to="/toy" >Toys</NavLink>
                    <NavLink to="/review" >Reviews</NavLink>
                    <NavLink to="/dashboard" >Dashboard</NavLink>
                    <button className="material-symbols-outlined cart" onClick={() => toggleCart()}>
                        {showCart ? 'hide': 'shopping_cart'}
                        {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}

                    </button>
                    {/* <span className="material-symbols-outlined cart">
                        shopping_cart
                    </span> */}

                    {loggedinUser ? (

                        < section className="user-nav">
                            <img src={loggedinUser.imgUrl} style={{ width: '50px' }} />
                            <Link to={`/user/${loggedinUser._id}`}>
                                {loggedinUser.fullname}
                            </Link>
                            <span className="balance">${loggedinUser.balance}
                            </span>

                            <a onClick={onLogout}> Logout</a>
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
            <NicePopup
                header={<h3>Shopping Cart</h3>}
                isOpen={showCart}
                onClose={toggleCart}>
                <ShoppingCart onClose={toggleCart}/>
            </NicePopup>

        </header >
    )
}
