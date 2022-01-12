import React from 'react'
import { BarCharts } from './charts/BarCharts'
import { Reklama } from './charts/Reklama'
export const ChartsMarketing = () => {
    return (
        <>
            <div className="row" >
                <div className="col-lg-6">
                    <BarCharts />
                </div>
                <div className="col-lg-6">
                    <Reklama />
                </div>
                <div className="col-lg-6">
                    {/* <BarChartsStatsionar /> */}
                </div>
                <div className="col-lg-6">
                    {/* <SimpleChartStatsionar /> */}
                </div>
            </div>
        </>
    )
}