import React from 'react'
import { Dashboard } from './Dashboard'
import { Footer } from './Footer'
import { Header } from './Header'
import { Menu } from './Menu'
import { BrowserRouter } from 'react-router-dom'


export const Admin = () => {
    return (
        <div class="hold-transition sidebar-mini layout-fixed">
            <div class="wrapper">
                <BrowserRouter>
                    <Header />
                    <Menu />
                    <Dashboard />
                    <Footer />
                </BrowserRouter>
            </div>
        </div>
    )
}
