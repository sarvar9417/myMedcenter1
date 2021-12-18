import React from 'react'
import { Link } from 'react-router-dom'
import { DashboardMenu } from './DashboardMenu'
import { DashboardRoutes } from './DashboardRoutes'
// import { BrowserRouter } from 'react-router-dom'


export const Dashboard = () => {
    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <nav className="navbar navbar-expand">
                                {/* <h1 className="m-0">Boshqaruv</h1> */}
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link className="btn nav-link a aktive" to="/director/logo" >Klinika</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn nav-link a aktive" to="/director/editdirector" >Raxbar</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn nav-link a aktive" to="/director/editreseption" >Qabul</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn nav-link a aktive" to="/director/editcashier" >Kassa</Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    {/* <BrowserRouter> */}
                    <DashboardMenu />
                    <DashboardRoutes />
                    {/* </BrowserRouter> */}
                </div>
            </section>
        </div>

    )
}
