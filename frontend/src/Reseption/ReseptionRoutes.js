import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { CreateClient } from './Offline/CreateClient'
import { ClientsPages } from './Offline/ClientsPages'
import { CreateServiceClient } from './Offline/CreateServiceClient'
import { AuthPage } from './reseptionPages/ReseptionAuth'
import { Home } from './reseptionPages/Home'
import { Sayt } from '../Sayt/sayt'
import { EditClient } from './Offline/EditClient'
import { Reciept } from './reseptionPages/CreateCleint/Reciept'
import { ClientsOnPages } from './Online/ClientsOnPages'
import { CreateOnlineClient } from './Online/CreateOnlineClient'
import { ClientHistory } from './reseptionPages/CreateCleint/ClientHistory'
import { ClientAllHistory } from './reseptionPages/CreateCleint/ClientAllHistory'
import { ClientsCallCenter } from './CallCenter/ClientsCallCenter'
import { NewCallCenterClient } from './CallCenter/NewCallCenterClient'
import { CreateStatsionarClient } from './Statsionar/CreateStatsionarClient'
import { ClientsStatsionarPages } from './Statsionar/ClientsStatsionarPages'
import { EditStatClient } from './Statsionar/EditStatClient'
import { RecieptStatsionar } from './Statsionar/RecieptStatsionar'

export const ReseptionRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/reseption" exact >
                        <Home />
                    </Route>
                    <Route path="/reseption/qabul"  >
                        <CreateClient />
                    </Route>
                    <Route path="/reseption/statsionar"  >
                        <CreateStatsionarClient />
                    </Route>
                    <Route path="/reseption/addstatsionar/:id"  >
                        <EditStatClient />
                    </Route>
                    <Route path="/reseption/onlineqabul"  >
                        <CreateOnlineClient />
                    </Route>
                    <Route path="/reseption/clients" >
                        <ClientsPages />
                    </Route>
                    <Route path="/reseption/clientsstatsionar" >
                        <ClientsStatsionarPages />
                    </Route>
                    <Route path="/reseption/onlineclients" >
                        <ClientsOnPages />
                    </Route>
                    <Route path="/reseption/reciept/:id/:connector" >
                        <Reciept />
                    </Route>
                    <Route path="/reseption/statsionarreciept/:id/:connector" >
                        <RecieptStatsionar />
                    </Route>
                    <Route path="/reseption/edit/:id" >
                        <EditClient />
                    </Route>
                    <Route path="/reseption/clienthistory/:id" >
                        <ClientHistory />
                    </Route>
                    <Route path="/reseption/clientallhistory/:id" >
                        <ClientAllHistory />
                    </Route>
                    <Route path="/reseption/callcenter" >
                        <ClientsCallCenter />
                    </Route>
                    <Route path="/reseption/acceptcallcenter/:id" >
                        <NewCallCenterClient />
                    </Route>
                    <Route path="/reseption/addservices/:client/:connector" >
                        <CreateServiceClient />
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
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/reseption" />
        </Switch>
    )
}
