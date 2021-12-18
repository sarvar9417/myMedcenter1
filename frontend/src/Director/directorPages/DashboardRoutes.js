import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Doctors } from './Others/Doctors'
import { ClientsPages } from './Others/ClientsPages'
import { Chart } from './Others/Chart'
import { AddDoctor } from './Others/AddDoctor'
import { EditDoctor } from './Others/EditDoctor'
import { Directions } from './Others/Directions'
import { AddDirection } from './Others/AddDirection'
import { EditDirection } from './Others/EditDirection'
import { ClientAllHistory } from '../directorPages/Others/ClientAllHistory'
import { ClientHistory  } from '../directorPages/Others/ClientHistory'
import { AddLogo } from './Others/AddLogo'
import { EditDirector } from './Others/EditDirector'
import { EditReseption } from './Others/EditReseption'
import { EditCashier } from './Others/EditCashier'
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
                <Route path='/director/adddoctor' >
                    <AddDoctor />
                </Route>
                <Route path='/director/editdoctor/:id' >
                    <EditDoctor />
                </Route>
                <Route path='/director/directions' >
                    <Directions />
                </Route>
                <Route path='/director/adddirection' >
                    <AddDirection />
                </Route>
                <Route path='/director/directionedit/:id' >
                    <EditDirection />
                </Route>
                <Route path='/director/clientallhistory/:id' >
                    <ClientAllHistory />
                </Route>
                <Route path='/director/clienthistory/:id' >
                    <ClientHistory />
                </Route>
                <Route path='/director/editdirector' >
                    <EditDirector />
                </Route>
                <Route path='/director/editreseption' >
                    <EditReseption />
                </Route>
                <Route path='/director/editcashier' >
                    <EditCashier />
                </Route>
                <Route path='/director/logo' >
                    <AddLogo />
                </Route>
                <Redirect to="/director" />
            </Switch>
        </div>
    )
}
