import React from 'react'
import { SimpleChart } from './SimpleChart'
import './chart.css'
import { BarCharts } from './BarCharts'
import { BarChartsStatsionar } from './BarChartsStatsionar'
import { SimpleChartStatsionar } from './SimpleChartStatsionar'
export const Chart = () => {
    return (
        <>
            <div className="row" >
                <div className="col-lg-6">
                    <BarCharts />
                </div>
                <div className="col-lg-6">
                    <SimpleChart />
                </div>
                <div className="col-lg-6">
                    <BarChartsStatsionar />
                </div>
                <div className="col-lg-6">
                    <SimpleChartStatsionar />
                </div>
            </div>
        </>
    )
}