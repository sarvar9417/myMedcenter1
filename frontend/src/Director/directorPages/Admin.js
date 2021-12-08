import React from 'react'
import { Dashboard } from './Dashboard'
import { Footer } from './Footer'
import { Header } from './Header'
import { Menu } from './Menu'

export const Admin = () => {
    return (
        <div class="hold-transition sidebar-mini layout-fixed">
            <div class="wrapper">
                    <Header />
                    <Menu />
                    <Dashboard />
                    <Footer/>
            </div>
        </div>
    )
}
