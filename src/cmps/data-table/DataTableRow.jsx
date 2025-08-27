import { useState, Fragment } from 'react'

import { Link } from 'react-router-dom'

export function DataTableRow({ toy, onRemoveToy }) {

    const [isExpanded, setIsExpanded] = useState(false)

    return <Fragment>
        <tr>
            <td  className="toggle-expand" onClick={() => {
                setIsExpanded(!isExpanded)
            }}>
                {(isExpanded) ? '-' : '+'}
            </td>
            <td>{toy._id}</td>
            <td className={(toy.inStock)? 'done' : ''}>{toy.txt}</td>
            <td>{toy.price}</td>
            <td>
                <Link to={`/toy/${toy._id}`}>Details</Link> |
                <Link to={`/toy/edit/${toy._id}`}>Edit</Link>
            </td>
        </tr>
        <tr hidden={!isExpanded}>
            <td colSpan="5" className="toy-info">
                <h5>{toy.txt}</h5>
                <img src={`https://robohash.org/${toy._id}`} style={{ maxWidth: '50px' }} />
                <p>{toy.txt}s are best for lorem ipsum dolor</p>
                <button onClick={() => onRemoveToy(toy._id)}>Remove Toy</button>
            </td>
        </tr>
    </Fragment>
}
