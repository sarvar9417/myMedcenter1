import React from 'react'
import {SimpleChart} from './SimpleChart'
import './chart.css'
import { BarCharts } from './BarCharts'
export const Chart = () => {
    return (
        <>
            <div className="row" >
                <div className="col-lg-6">
                    <SimpleChart />
                </div>
                <div className="col-lg-6">
                    <BarCharts />
                </div>
            </div>
        </>
    )
}