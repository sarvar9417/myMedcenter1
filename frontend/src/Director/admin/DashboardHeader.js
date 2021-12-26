import React from 'react'

export const DashboardHeader = () => {
    return (
        <div className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <nav className="navbar navbar-expand">
                            {/* <h1 className="m-0">Boshqaruv</h1> */}
                            <ul className="navbar-nav">
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
    )
}
