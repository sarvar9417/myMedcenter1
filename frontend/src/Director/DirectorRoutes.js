import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthPage } from './directorPages/DirectorAuth'
import { Sayt } from '../Sayt/sayt'
import { Chart } from './directorPages/Others/Chart'
import { RouterComponent } from './RouterComponent'
import { Marketing } from './marketing/Marketing'
import { ClientsDoctor } from './directorPages/Others/ClientsDoctor'


import { Doctors } from './directorPages/Others/Doctors'
import { ClientsPages } from './directorPages/Others/ClientsPages'
import { AddDoctor } from './directorPages/Others/AddDoctor'
import { EditDoctor } from './directorPages/Others/EditDoctor'
import { Directions } from './directorPages/Others/Directions'
import { AddDirection } from './directorPages/Others/AddDirection'
import { EditDirection } from './directorPages/Others/EditDirection'
import { ClientAllHistory } from './directorPages/Others/ClientAllHistory'
import { ClientHistory } from './directorPages/Others/ClientHistory'
import { EditDirector } from './directorPages/Others/EditDirector'
import { EditReseption } from './directorPages/Others/EditReseption'
import { EditCashier } from './directorPages/Others/EditCashier'
import { CounterAgents } from './marketing/counteragents/CounterAgents'
import { AddCounterAgent } from './marketing/counteragents/AddCounterAgent'
import { EditCounterAgent } from './marketing/counteragents/EditCounterAgent'
import { ClientsCounterAgent } from './marketing/counteragents/ClientsCounterAgent'
import { Advertisements } from './marketing/advertising/Advertisements'
import { AddAdvertisement } from './marketing/advertising/AddAdvertisement'
import { EditAdvertisement } from './marketing/advertising/EditAdvertisement'
import { ClientsAdvertisements } from './marketing/advertising/ClientsAdvertisement'

export const DirectorRoutes = (isAuthenticated) => {
    if (isAuthenticated) {
        return (
            <div>
                <Switch>
                    <Route path="/director" exact >
                        <RouterComponent component={<Chart />} menu={true} />
                    </Route>
                    <Route path="/director/info"  >
                        <RouterComponent component={<ClientsPages />} menu={true} />
                    </Route>
                    <Route path='/director/doctors' >
                        <RouterComponent component={<Doctors />} menu={true}/>
                    </Route>
                    <Route path='/director/adddoctor' >
                        <RouterComponent component={<AddDoctor />} menu={true} />
                    </Route>
                    <Route path='/director/editdoctor/:id' >
                        <RouterComponent component={<EditDoctor />} menu={true} />
                    </Route>
                    <Route path='/director/directions' >
                        <RouterComponent component={<Directions />} menu={true} />
                    </Route>
                    <Route path='/director/adddirection' >
                        <RouterComponent component={<AddDirection />} menu={true} />
                    </Route>
                    <Route path='/director/directionedit/:id' >
                        <RouterComponent component={<EditDirection />} menu={true}/>
                    </Route>
                    <Route path='/director/clientallhistory/:id' >
                        <RouterComponent component={<ClientAllHistory />} menu={true} />
                    </Route>
                    <Route path='/director/clienthistory/:id' >
                        <RouterComponent component={<ClientHistory />} menu={true} />
                    </Route>
                    <Route path='/director/editdirector' >
                        <RouterComponent component={<EditDirector />} menu={false} />
                    </Route>
                    <Route path='/director/editreseption' >
                        <RouterComponent component={<EditReseption />} />
                    </Route>
                    <Route path='/director/editcashier' >
                        <RouterComponent component={<EditCashier />} />
                    </Route>
                    <Route path='/director/doctorprocient/:id' >
                        <RouterComponent component={<ClientsDoctor />} menu={true} />
                    </Route>
                    <Route path='/director/marketing' >
                        <RouterComponent component={<Marketing component={<Doctors/>} />}  />
                    </Route>
                    <Route path='/director/counteragents' >
                        <RouterComponent component={<Marketing component={<CounterAgents />} />} />
                    </Route>
                    <Route path='/director/addcounteragent' >
                        <RouterComponent component={<Marketing component={<AddCounterAgent/>} />} />
                    </Route>
                    <Route path='/director/editcounteragent/:id' >
                        <RouterComponent component={<Marketing component={<EditCounterAgent />} />} />
                    </Route>
                    <Route path='/director/counteragentprocient/:id' >
                        <RouterComponent component={<Marketing component={<ClientsCounterAgent />} />} />
                    </Route>
                    <Route path='/director/advertisements' >
                        <RouterComponent component={<Marketing component={<Advertisements />} />} />
                    </Route>
                    <Route path='/director/addadvertisements' >
                        <RouterComponent component={<Marketing component={<AddAdvertisement />} />} />
                    </Route>
                    <Route path='/director/editadvertisement/:id' >
                        <RouterComponent component={<Marketing component={<EditAdvertisement />} />} />
                    </Route>
                    <Route path='/director/clientsadvertisiments/:id' >
                        <RouterComponent component={<Marketing component={<ClientsAdvertisements />} />} />
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
