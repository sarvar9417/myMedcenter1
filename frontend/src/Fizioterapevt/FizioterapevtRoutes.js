import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthPage } from './fizioterapevtPages/FizioteapevtAuth'
import { Home } from './fizioterapevtPages/Home'
import { Sayt } from '../Sayt/sayt'
import { ClientsStatsionarPages } from './fizioterapevtPages/ClientsStatsionarPages'
import { EditStatClient } from './fizioterapevtPages/EditStatClient'
import { Reciept } from './fizioterapevtPages/Reciept'

export const FizioterapevtRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/fizioterapevt" exact >
                        <Home />
                    </Route>
                    <Route path="/fizioterapevt/clients" >
                        <ClientsStatsionarPages />
                    </Route>
                    <Route path="/fizioterapevt/addstatsionar/:id" >
                        <EditStatClient />
                    </Route>
                    <Route path="/fizioterapevt/statsionarreciept/:id/:connector" >
                        <Reciept />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>

                    <Redirect to="/fizioterapevt" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/fizioterapevt" >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/fizioterapevt" />
        </Switch>
    )
}
