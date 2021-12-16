import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import "aos/dist/aos.css"
import { AuthContext } from '../context/AuthContext'
import './nav.css'
import { useHttp } from '../hooks/http.hook'
import { toast } from 'react-toastify'

toast.configure()
export const Navbar = () => {

    const { request, loading, error, clearError } = useHttp()
    const [logo, setLogo] = useState()
    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null)
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [request, setLogo])

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

    const notify = (e) => {
        toast(e)
    }
    useEffect(() => {
        if (!logo) {
            getLogo()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    const [show, setShow] = useState(true)
    return (
        <nav className="navbar navbar-expand-lg navbar-light shadow fixed-top bg-light" data-aos="fade-down" data-aos-duration="1000" >
            <div className="container" >
                <button className="navbar-brand btn p-0" onClick={goBack}>
                    <img width="100px" src={logo && logo.logo} alt="Bosh sahifa" />
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
