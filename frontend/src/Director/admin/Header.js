import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export const Header = () => {
    const history = useHistory()
    const auth = useContext(AuthContext)
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
        <nav class="main-header navbar navbar-expand-md navbar-light bg-light">
            <div class="container-fluid">
                <a className="nav-link" data-widget="pushmenu" role="button"><i className="fas fa-bars" /></a>
                <button className="btn nav-link a aktive" onClick={goBack} >Bosh menyu</button>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="btn nav-link a aktive" to="/director" >Hisobot</Link>
                        </li>
                        <li className="nav-item  dropdown">
                            <button class="w-100 nav-link dropdown-toggle btn a" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Boshqaruv
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <Link className="dropdown-item aktive" to="/director/editdirector" >Direktor</Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item aktive" to="/director/editreseption" >Qabul</Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item aktive" to="/director/editcashier" >Kassa</Link>
                                </li>
                            </ul>

                        </li>
                        <li className="nav-item">
                            <Link className="btn nav-link a aktive" to="/director/marketing" >Marketing</Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link text-center" data-widget="fullscreen" role="button">
                                <i className="fas fa-expand-arrows-alt" />
                            </a>
                        </li>
                        <li className="nav-item ll" >
                            <span style={{ backgroundColor: "#EA5353" }} className="nav-link btn text-white" href="" onClick={logoutHandler} >Chiqish</span>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}
