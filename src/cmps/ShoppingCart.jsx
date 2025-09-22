import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { toggleCart } from '../store/actions/toy.actions.js'
import { updateBalance } from '../store/actions/user.actions.js'
import { REMOVE_FROM_CART } from '../store/reducers/toy.reducer.js'
import { useSelector, useDispatch } from 'react-redux'


// import { ShoppingCartIcon } from '@mui/icons-material/ShoppingCart';

export function ShoppingCart({ onClose }) {
    const user = useSelector((state) => state.userModule.loggedinUser)
    const cart = useSelector((state) => state.toyModule.cart)
    const showCart = useSelector((state) => state.toyModule.showCart)

    console.log('🧾 Cart contents:', cart)


    const dispatch = useDispatch()

    function removeFromCart(toyId) {
        console.log(`Todo: remove: ${toyId} from cart`)
        dispatch({ type: REMOVE_FROM_CART, toyId })
    }

    function getCartTotal() {
        return cart.reduce((acc, toy) => acc + toy.price, 0)
    }

    async function onCheckout() {
        const amount = getCartTotal()
        try {
            const userBalance = await updateBalance(-amount)
            showSuccessMsg(`Charged you: $ ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`
            )
            setTimeout(() => {
                if (onClose)
                    toggleCart()
            }, 1500)

        } catch (err) {
            showErrorMsg(`Couldn't checkout`)
        }
    }

    if (!showCart) return <span></span>

    const total = getCartTotal()
    return (
        <section className="cart">
            <h4>{cart.length} items in cart</h4>
            <ul>
                {cart.map((toy, idx) => (
                    <li key={idx} className="clean-list cart-item">
                        <p>
                            {toy.name} | {toy.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </p>
                        <button onClick={() => removeFromCart(toy._id)}>x</button>
                    </li>
                ))}
            </ul>
            <p>Total: {total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
            <button disabled={!user || !total} onClick={onCheckout}>
                Checkout
            </button>
        </section>
    )
}
