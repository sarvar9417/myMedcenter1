import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Sayt } from '../Sayt/sayt'
import { AuthPage } from './CallCenterPages/CallCenterAuth'
import { Home } from './CallCenterPages/Home'
import { ClientsPages } from './CallCenterPages/ClientsPages'
import {  EditClient } from './CallCenterPages/EditClient'

export const CallCenterRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/callcenter" exact >
                        <Home />
                    </Route>
                    <Route path="/callcenter/clients" >
                        <ClientsPages />
                    </Route>
                    <Route path="/callcenter/edit/:id" >
                        <EditClient />
                    </Route>
                    <Redirect to="/callcenter" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/callcenter" >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/callcenter" />
        </Switch>
    )
}
