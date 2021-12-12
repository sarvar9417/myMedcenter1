import React from 'react'
import { DashboardMenu } from './DashboardMenu'
import { DashboardRoutes } from './DashboardRoutes'
import { BrowserRouter } from 'react-router-dom'


export const Dashboard = () => {
    return (
        <div className="content-wrapper">
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Boshqaruv</h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container-fluid">
                    <BrowserRouter>
                        <DashboardMenu />
                        <DashboardRoutes />
                    </BrowserRouter>
                </div>
            </section>
        </div>

    )
}
