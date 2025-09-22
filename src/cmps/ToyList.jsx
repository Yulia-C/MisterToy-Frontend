import { useSelector } from "react-redux"
import { ToyPreview } from "./ToyPreview.jsx"
import { Link } from 'react-router-dom'
import { addToCart } from "../store/actions/toy.actions.js"
import { showErrorMsg } from "../services/event-bus.service.js"

export function ToyList({ toys, onRemoveToy }) {
    const loggedinUser = useSelector(storeState => storeState.userModule.loggedinUser)

    if (!toys) return <div className="loader"></div>
    if (!toys.length) return <div className="loading">No toys to show...</div>

    function onAddToCart(toy) {
        try {
            const addedToy = addToCart(toy)
            showErrorMsg('Added to cart')
            return addedToy
        } catch (err) {
            showErrorMsg('Har problem adding to cart...')
            console.log('err:', err)
        }
    }

    return (
        <ul className="toy-list container">
            {toys.map(toy =>
                <li key={toy._id}>
                    <Link to={`/toy/${toy._id}`}>
                        <ToyPreview toy={toy} />
                    </Link>
                    <section className="toy-list-btns">
                        {loggedinUser && loggedinUser.isAdmin &&
                            <>
                                <button onClick={() => onRemoveToy(toy._id)}>Remove</button>
                                <button><Link to={`/toy/edit/${toy._id}`}>Edit</Link></button>
                            </>
                        }
                        <button onClick={() => onAddToCart(toy)}>Add to cart</button>
                </section>
                </li>
    )
}
        </ul >
    )
}