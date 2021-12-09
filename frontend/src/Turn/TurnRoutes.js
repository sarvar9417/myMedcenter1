import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Turn } from './TurnPages/Turn'

export const TurnRoutes = () => {
    return (
        <div >
            <Switch >
                <Route path="/turn" exact >
                    <Turn />
                </Route>
                <Redirect to="/" />
            </Switch>
        </div>
    )

}