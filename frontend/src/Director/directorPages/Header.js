import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Header = () => {
    const history = useHistory()
    const auth =  useContext(AuthContext)
    const logoutHandler = (event) => {
        event.preventDefault()
        auth.logout()
        history.push('/director')
    }
    return (
        <nav className="main-header navbar navbar-expand">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu"  role="button"><i className="fas fa-bars" /></a>
                </li>
                <li className="nav-item">
                    <Link className="nav-link a aktive" to="/sayt">Bosh sahifa</Link>
                </li>
            </ul>
            {/* Right navbar links */}
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a className="nav-link" data-widget="fullscreen" role="button">
                        <i className="fas fa-expand-arrows-alt" />
                    </a>
                </li>
                <li className="nav-item ll" >
                    <span style={{ backgroundColor: "#EA5353" }} className="nav-link btn text-white" href="" onClick={logoutHandler} >Chiqish</span>
                </li>
            </ul>
        </nav>


    )
}
