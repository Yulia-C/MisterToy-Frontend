import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js"
import { userService } from "../services/user.service.local.js"
// import { userService } from "../services/user.service.js"
import { updateUserDetails } from "../store/actions/user.actions.js"
import { useOnlineStatus } from '../hooks/useOnlineStatus.js'

export function UserPage() {

    const [user, setUser] = useState(null)

    const params = useParams()
    const navigate = useNavigate()
    const isOnline = useOnlineStatus()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }
    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setUser(prevDetails => ({ ...prevDetails, [field]: value }))
    }

    function onSaveUser(ev) {
        ev.preventDefault()
        updateUserDetails()
            .then(({ updated: updatesUser }) => {
                navigate('/toy')
                showSuccessMsg(`Toy Saved (id: ${updatedUser._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save toy')
                console.log('err:', err)
            })
    }

    if (!user) return <div>Loading...</div>

    return <section className="user-page">
        <pre>

            <h2>Username: {user.username}</h2>
            <h2>User Id: {user._id}</h2>
            <p>{isOnline ? '✅ Online' : '❌ Disconnected'}</p>
        </pre>
        <h1>Full Name {user.fullname}</h1>
        <form onSubmit={onSaveUser}>
            <input type='text' value={user.fullname} name="fullname" onChange={handleChange} />
        </form>
        <Link to="/toy">Back</Link>
    </section>
}