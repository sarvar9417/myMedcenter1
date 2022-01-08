import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthPage } from './medsestraPages/MedsestraAuth'
import { Home } from './medsestraPages/Home'
import { Sayt } from '../Sayt/sayt'
import { ClientsStatsionarPages } from './medsestraPages/ClientsStatsionarPages'
import { EditStatClient } from './medsestraPages/EditStatClient'
import { Reciept } from './medsestraPages/Reciept'

export const MedsestraRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/medsestra" exact >
                        <Home />
                    </Route>
                    <Route path="/medsestra/clients" >
                        <ClientsStatsionarPages />
                    </Route>
                    <Route path="/medsestra/addstatsionar/:id" >
                        <EditStatClient />
                    </Route>
                    <Route path="/medsestra/statsionarreciept/:id/:connector" >
                        <Reciept />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>

                    <Redirect to="/medsestra" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/medsestra" >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/medsestra" />
        </Switch>
    )
}
