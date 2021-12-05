import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Home } from '../Home'

export const DashboardRoutes = () => {
    return (
        <div>
            <Switch>
                <Route path="/director/home" exact >
                    <Home />
                </Route>
                <Redirect to="/director" />
            </Switch>
        </div>
    )
}
