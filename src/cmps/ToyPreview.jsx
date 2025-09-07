export function ToyPreview({ toy }) {
    return (
        <article className="toy-preview">
            <h2 className={`toy-h2 ${toy.inStock ? '' : 'out'}`}>
                {toy.name}
            </h2>
           <h4>Toy Price: ${toy.price}</h4>
            <img src={`https://robohash.org/${toy._id}`} style={{ maxWidth: '100px' }} />
            {toy.inStock ?
                <p style={{ color: 'rgba(97, 240, 116, 1)' }}>In stock</p> :
                <p style={{color: 'rgba(241, 71, 71, 1)' }}>Out of stock</p>}
        </article >
    )
}
