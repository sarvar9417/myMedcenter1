import React from 'react'
import { BarCharts } from './BarCharts'
export const ChartsMarketing = () => {
    return (
        <>
            <div className="row" >
                <div className="col-lg-6">
                    <BarCharts />
                </div>
                <div className="col-lg-6">
                    {/* <SimpleChart /> */}
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