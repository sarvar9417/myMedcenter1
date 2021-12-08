import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthPage } from './directorPages/DirectorAuth'
import { Sayt } from '../Sayt/sayt'
import { Admin } from './directorPages/Admin'

export const DirectorRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div>
                <Switch>
                    <Route path="/director" exact >
                        <Admin />
                    </Route>
                    <Route path="/sayt" >
                        <Sayt />
                    </Route>
                    <Redirect to="/director" />
                </Switch>
            </div>
        )
    }
    return (
        <Switch>
            <Route path="/director"  >
                <AuthPage />
            </Route>
            <Redirect to="/director" />
        </Switch>
    )
}
