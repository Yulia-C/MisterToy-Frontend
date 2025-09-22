import { useState } from "react"

export function ToyPreview({ toy }) {
    const [isImgLoading, setImgLoading] = useState(true)


    function handleImageLoaded() {
        setImgLoading(false)
    }

    return (
        <article className="toy-preview">
            <div className="img-container">
                {isImgLoading && <div className="skeleton-loader"></div>}
                <img className={`toy-img` + (isImgLoading ? '' : 'loaded')}
                    src={toy.imgUrl || `https://robohash.org/${toy._id}`}
                    onLoad={handleImageLoaded}
                    style={{ maxWidth: '200px' }} />
            </div>
            <h3 className={`toy-h2 ${toy.inStock ? '' : 'out'}`}>
                {toy.name}
            </h3>
            <h4> ${toy.price}</h4>
            {toy.inStock ?
                <p style={{ color: 'rgba(24, 151, 41, 1)' }}>In stock</p> :
                <p style={{ color: 'rgba(241, 71, 71, 1)' }}>Out of stock</p>}
        </article >
    )
}
