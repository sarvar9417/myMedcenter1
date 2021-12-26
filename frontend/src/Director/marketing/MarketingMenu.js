import React from 'react'
import { Link } from 'react-router-dom'
import { Agents } from './menu/Agents'
import { CallCenter } from './menu/CallCenter'
import { Sources } from './menu/Sources'
import { Statistika } from './menu/Statistika'


export const MarketingMenu = () => {

    return (
        <div  >
            <div className="row mt-3">
                <Statistika/>
                {/* ./col */}
                <Agents/>
                {/* ./col */}
                <Sources/>
                <CallCenter/>
            </div>
            <hr />
        </div>
    )
}