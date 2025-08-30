import { ToyPreview } from "./ToyPreview.jsx"
import { Link } from 'react-router-dom'

export function ToyList({ toys, onRemoveToy }) {

    if (!toys) return <div className="loading">loading</div>

    return (
        <ul className="toy-list container">
            {toys.map(toy =>
                <li key={toy._id}>
                    <ToyPreview toy={toy} />
                    <section className="toy-list-btns">
                        <button onClick={() => onRemoveToy(toy._id)}>Remove</button>
                        <button><Link to={`/toy/${toy._id}`}>Details</Link></button>
                        <button><Link to={`/toy/edit/${toy._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}