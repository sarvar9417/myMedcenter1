import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Doctors } from './Others/Doctors'
import { ClientsPages } from './Others/ClientsPages'
import { Chart } from './Others/Chart'
export const DashboardRoutes = () => {
    return (
        <div style={{ overflow: "auto" }}>
            <Switch>
                <Route path="/director" exact>
                    <Chart />
                </Route>
                <Route path="/director/info"  >
                    <ClientsPages />
                </Route>
                <Route path='/director/doctors' >
                    <Doctors />
                </Route>
                <Redirect to="/director" />
            </Switch>
        </div>
    )
}
