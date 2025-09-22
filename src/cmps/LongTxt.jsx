import { useState } from 'react'
export function LongTxt({ children, length = 100 }) {
    const txt = children
    const [isShowFullTxt, setIsShowFullTxt] = useState(false)

    function onToggleIsShowFullTxt() {
        setIsShowFullTxt(prev => !prev)
    }

    const isLongText = txt.length > length
    const textToShow = (isShowFullTxt || !isLongText) ? txt : (txt.substring(0, length)) + '...'
    return (
        <section className={`review-txt ${isShowFullTxt ? 'expanded' : ''}`}>
            <p>{textToShow}
            </p>
            {isLongText &&
                <>
                    <p className="show-txt" onClick={onToggleIsShowFullTxt}>
                        {isShowFullTxt ? '...Show Less' : 'See more'}
                    </p>
                </>
            }
        </section>
    )
}