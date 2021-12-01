import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import { Cashier } from './Cashier/Cashier'
import { Director } from './Director/Director'
import { Doctor } from './Doctor/Doctor'
import { Reseption } from './Reseption/Reseption'
import { Sayt } from './Sayt/sayt'
import { Turn } from './Turn/Turn'

export const useRoutes = () => {
    return (
        <Switch>
            <Route path="/reseption"  >
                <Reseption />
            </Route>
            <Route path="/doctor" >
                <Doctor />
            </Route>
            <Route path="/director" >
                <Director />
            </Route>
            <Route path="/cashier" >
                <Cashier />
            </Route>
            <Route path="/turn" >
                <Turn />
            </Route>
            <Route path="/" >
                <Sayt />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}