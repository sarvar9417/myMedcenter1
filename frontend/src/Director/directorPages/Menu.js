
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { useHttp } from '../hooks/http.hook'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'

export const Menu = () => {
    const [logo, setLogo] = useState()
    const auth = useContext(AuthContext)
    const { request, error, clearError, loading } = useHttp()
    const history = useHistory()

    const notify = (e) => {
        toast.error(e)
    }

    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setLogo])

    useEffect(() => {
        if (!logo) {
            getLogo()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <span className="brand-link">
                <img src={logo && logo.logo} alt="AdminLTE Logo" className="w-100" />
                <span className="brand-text font-weight-light">MedCenter</span>
            </span>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel (optional) */}
                <div className="user-panel mt-3 pb-3 mb-3 ">
                    <div className="image  w-100">
                        <img src={auth.director && auth.director.image} className="img-circle d-inline-block" alt="User Image" />
                    </div>
                    <br />
                    <div className="info">
                        <div className="d-block text-white fs-4">{auth.director && auth.director.lastname}</div>
                        <div className="d-block text-white fs-5">{auth.director && auth.director.firstname}</div>
                        <div className="d-block text-white fs-6">{auth.director && auth.director.fathername}</div>
                        <p className="d-block text-white">{auth.director && new Date(auth.director.born).toLocaleDateString()}</p>
                        <p className="d-block text-white fs-3">{auth.director && auth.director.section}</p>
                    </div>
                </div>

            </div>
            {/* /.sidebar */}
        </aside>


    )
}
