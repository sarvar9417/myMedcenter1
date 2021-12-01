import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { CreateClient } from './reseptionPages/CreateClient'
import { ClientsPages } from './reseptionPages/ClientsPages'
import { AuthPage } from './reseptionPages/ReseptionAuth'
import { Home } from './reseptionPages/Home'
import { Sayt } from '../Sayt/sayt'
import { EditClient } from './reseptionPages/EditClient'
import { CreateCost } from './reseptionPages/CreateCost'
import { CostsPages } from './reseptionPages/CostsPages'
import { Reciept } from './reseptionPages/CreateCleint/Reciept'
import { ClientsOnPages } from './reseptionPages/ClientsOnPages'
import { CreateOnlineClient } from './reseptionPages/CreateOnlineClient'
import { ClientHistory } from './reseptionPages/CreateCleint/ClientHistory'
import { ClientAllHistory } from './reseptionPages/CreateCleint/ClientAllHistory'

export const ReseptionRoutes = (isAuthenticated) => {
    if (isAuthenticated ) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/reseption" exact >
                        <Home />
                    </Route>
                    <Route path="/reseption/qabul"  >
                        <CreateClient />
                    </Route>
                    <Route path="/reseption/onlineqabul"  >
                        <CreateOnlineClient />
                    </Route>
                    <Route path="/reseption/clients" >
                        <ClientsPages />
                    </Route>
                    <Route path="/reseption/onlineclients" >
                        <ClientsOnPages />
                    </Route>
                    <Route path="/reseption/reciept/:id" >
                        <Reciept />
                    </Route>
                    <Route path="/reseption/edit/:id" >
                        <EditClient />
                    </Route>
                    <Route path="/reseption/cost" >
                        <CreateCost />
                    </Route>
                    <Route path="/reseption/costs" >
                        <CostsPages />
                    </Route>
                    <Route path="/reseption/clienthistory/:id" >
                        <ClientHistory />
                    </Route>
                    <Route path="/reseption/clientallhistory/:id" >
                        <ClientAllHistory />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>
                    <Redirect to="/reseption" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/reseption" >
                <AuthPage />
            </Route>
            <Redirect to="/reseption" />
        </Switch>
    )
}
