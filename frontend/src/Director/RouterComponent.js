import React from 'react'
import { Dashboard } from './admin/Dashboard'
import { Footer } from './admin/Footer'
import { Header } from './admin/Header'
import { Menu } from './admin/Menu'

export const RouterComponent = (props) => {
    return (
        <div >
            <Header/>
            <Menu />
            <Dashboard component={props.component} menu={props.menu}/>
            <Footer/>
        </div>
    )
}
