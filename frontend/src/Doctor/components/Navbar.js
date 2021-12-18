import React, {useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../context/AuthContext'
import './nav.css'
import { toast } from 'react-toastify'

toast.configure()
export const Navbar = () => {

    const history = useHistory()
    const auth = useContext(AuthContext)

    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push('/doctor')
    }

    const goBack = () => {
        history.push('/sayt')
        window.location.reload()
    }


    const [show, setShow] = useState(true)
    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow fixed-top bg-light" >
            <div className="container" >
                <button className="navbar-brand btn p-0" onClick={goBack}>
                    Bosh menyu
                </button>
                <button onClick={() => setShow(!show)} className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-label="Toggle navigation">
                    <FontAwesomeIcon icon={faBars} className="navbar-icon" />
                </button>
                <div className={show ? "collapse navbar-collapse" : "collapse navbar-collapse show"} id="navbarNav">
                    <ul className="navbar-nav ms-auto ull">
                        <li className="nav-item">
                            <Link className="nav-link a aktive" to="/doctor">Bosh sahifa</Link>
                        </li>
                        <li className="nav-item" >
                            <Link className="nav-link a" to="/doctor/clients">Mijozlar</Link>
                        </li>
                        <li className="nav-item" >
                            <Link className="nav-link a" to="/doctor/templates">Shablonlar</Link>
                        </li>

                    </ul>
                    <li className="nav-item ll" >
                        <span style={{ backgroundColor: "#EA5353" }} className="nav-link btn text-white" href="" onClick={logoutHandler} >Chiqish</span>
                    </li>
                </div>
            </div>
        </nav>
    )
}
