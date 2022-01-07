
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'

export const Menu = () => {
    const [logo, setLogo] = useState()
    const auth = useContext(AuthContext)
    const { request, error, clearError } = useHttp()

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

        <aside className="main-sidebar sidebar-dark-primary elevation-4" style={{ minHeight: "100vh", height: "100% !important" }} >
            {/* Brand Logo */}
            <span className="brand-link">
                <img src={logo && logo.logo} alt="AdminLTE Logo" className="w-100" />
            </span>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel (optional) */}
                <div className="user-panel mt-3 pb-3 mb-3 ">
                    <div className="info">
                        <div className="d-block text-white fs-4">{logo && logo.name}</div>
                        <div className="d-block text-white"> Tel: +{logo && logo.phone1}</div>
                        <div className="d-block text-white">+{logo && logo.phone2}</div>
                        <div className="d-block text-white">+{logo && logo.phone3}</div>
                        <div className="d-block text-white">INN: {logo && logo.inn}</div>
                    </div>
                </div>
                <div className="user-panel mt-3 pb-3 mb-3 ">
                    <div className="image  w-100">
                        <img src={auth.director && auth.director.image} className="img-circle d-inline-block" alt="User Image" />
                    </div>
                    <br />
                    <div className="info">
                        <div className="d-block text-white fs-4">{auth.director && auth.director.lastname}</div>
                        <div className="d-block text-white fs-5">{auth.director && auth.director.firstname}</div>
                        <div className="d-block text-white fs-6">{auth.director && auth.director.fathername}</div>
                        <div className="d-block text-white">{auth.director && new Date(auth.director.born).toLocaleDateString()}</div>
                        <div className="d-block text-white">+{auth.director && auth.director.phone}</div>
                        <div className="d-block text-white fs-3">{auth.director && auth.director.section}</div>
                    </div>
                </div>

            </div>
            {/* /.sidebar */}
        </aside>

    )
}
