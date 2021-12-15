import React, { useContext } from 'react'
    import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Header = () => {
    const history = useHistory()
    const auth =  useContext(AuthContext)
    const logoutHandler = (event) => {
        event.preventDefault()
        history.push('/sayt')
        auth.logout()
        
    }
    const goBack = () => {
        history.push('/sayt')
        window.location.reload()
    }
    return (
        <nav className="main-header navbar navbar-expand">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu"  role="button"><i className="fas fa-bars" /></a>
                </li>
                <li className="nav-item">
                    <button className="btn nav-link a aktive" onClick={goBack} >Bosh menyu</button>
                </li>
                <li className="nav-item">
                    <Link className="btn nav-link a aktive" to="/director/logo" >Logotip</Link>
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
