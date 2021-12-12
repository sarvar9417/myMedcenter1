import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export const Menu = () => {
    const auth = useContext(AuthContext)
    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            {/* Brand Logo */}
            <span className="brand-link">
                <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: '.8' }} />
                <span className="brand-text font-weight-light">MedCenter</span>
            </span>
            {/* Sidebar */}
            <div className="sidebar">
                {/* Sidebar user panel (optional) */}
                <div className="user-panel mt-3 pb-3 mb-3 ">
                    <div className="image  w-100">
                        <img src={auth.director && auth.director.image} className="img-circle d-inline-block" alt="User Image" />
                    </div>
                    <br/>
                    <div className="info">
                        <div className="d-block text-white fs-4">{auth.director && auth.director.lastname}</div>
                        <div className="d-block text-white fs-5">{auth.director && auth.director.firstname}</div>
                        <div className="d-block text-white fs-6">{auth.director && auth.director.fathername}</div>
                        <p className="d-block text-white">{auth.director && new Date( auth.director.born).toLocaleDateString()}</p>
                        <p className="d-block text-white fs-3">{auth.director && auth.director.section}</p>
                    </div>
                </div>
                
            </div>
            {/* /.sidebar */}
        </aside>


    )
}
