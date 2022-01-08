import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthPage } from './cashierPages/CashierAuth'
import { CreateCheck } from './cashierPages/CreateCheck'
import { Home } from './cashierPages/Home'
import { Sayt } from '../Sayt/sayt'
import { EditCheck } from './cashierPages/EditCheck'
import { Reciept } from './cashierPages/Reciept'
import { RecieptAll } from './cashierPages/RecieptAll'
import { ClientsStatsionarPages } from './cashierPages/statsionar/ClientsStatsionarPages'
import { CreatePrepayment } from './cashierPages/statsionar/CreatePrepayment'
import { StatsionarCheckClient } from './cashierPages/statsionar/StatsionarCheckCreate'
import { RecieptStatsionar } from './cashierPages/statsionar/RecieptStatsionar'


export const CashierRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/cashier" exact >
                        <Home />
                    </Route>
                    <Route path="/cashier/pay/:id/:connector" >
                        <CreateCheck />
                    </Route>
                    <Route path="/cashier/paystatsionar/:id/:connector" >
                        <StatsionarCheckClient />
                    </Route>
                    <Route path="/cashier/payedit/:id/:connector" >
                        <EditCheck />
                    </Route>
                    <Route path="/cashier/reciept/:id/:connector" >
                        <Reciept />
                    </Route>
                    <Route path="/cashier/recieptall/:id" >
                        <RecieptAll />
                    </Route>
                    <Route path="/cashier/statsionar" >
                        <ClientsStatsionarPages />
                    </Route>
                    <Route path="/cashier/prepayment/:client/:connector" >
                        <CreatePrepayment />
                    </Route>
                    <Route path="/cashier/recieptstatsionar/:id/:connector" >
                        <RecieptStatsionar />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/cashier" >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/cashier" />
        </Switch>
    )
}
