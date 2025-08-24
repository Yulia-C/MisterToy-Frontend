
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

export function AppFooter() {
    // TOY: move to store state
    const dispatch = useDispatch()
    const loggedinUser = useSelector(storeState   => storeState.userModule.loggedinUser)


    useEffect(() => {

    }, [loggedinUser])


    return (
        <footer className="app-footer">
            <p>Coffeerights &copy; 2024 </p>
       
        </footer>
    )
}