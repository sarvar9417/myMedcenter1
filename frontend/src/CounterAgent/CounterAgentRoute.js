import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Sayt } from '../Sayt/sayt'
import { AuthPage } from './CounterAgentPages/CounterAgentAuth'
import { AddCounterDoctor } from './CounterAgentPages/counterdoctors/AddCounterDoctor'
import { CounterDoctors } from './CounterAgentPages/counterdoctors/Counterdoctors'
import { EditCounterDoctor } from './CounterAgentPages/counterdoctors/EditCounterDoctor'
import { Home } from './CounterAgentPages/Home'

export const CounterAgentRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div style={{ marginTop: "90px" }} >
                <Switch >
                    <Route path="/counteragent" exact >
                        <Home />
                    </Route>
                    <Route path="/counteragent/doctors" >
                        <CounterDoctors />
                    </Route>
                    <Route path="/counteragent/adddoctor" >
                        <AddCounterDoctor />
                    </Route>
                    <Route path="/counteragent/edit/:id" >
                        <EditCounterDoctor />
                    </Route>
                    <Redirect to="/counteragent" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/counteragent" >
                <AuthPage />
            </Route>
            <Route path="/sayt" >
                <Sayt />
            </Route>
            <Redirect to="/counteragent" />
        </Switch>
    )
}
