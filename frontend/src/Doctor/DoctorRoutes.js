import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Adoption } from './DoctorPages/Adoption'
import { AuthPage } from './DoctorPages/DoctorAuth'
import { Home } from './DoctorPages/Home'
import { Sayt } from '../Sayt/sayt'
import { ClientsPages } from './DoctorPages/ClientsPages'
import { EditAdoption } from './DoctorPages/EditAdoption'
import { ClientAllHistory } from './DoctorPages/ClientAllHistory'

export const DoctorRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "57px" }} >
                <Switch >
                    <Route path="/doctor" exact >
                        <Home />
                    </Route>
                    <Route path="/doctor/clients" >
                        <ClientsPages />
                    </Route>
                    <Route path="/doctor/adoption/:id" >
                        <Adoption />
                    </Route>
                    <Route path="/doctor/edit/:id" >
                        <EditAdoption />
                    </Route>
                    <Route path="/doctor/clienthistory/:id" >
                        <ClientAllHistory />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>
                    <Redirect to="/doctor" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/doctor" >
                <AuthPage />
            </Route>
            <Redirect to="/doctor" />
        </Switch>
    )
}