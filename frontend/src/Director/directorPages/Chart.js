import React from 'react'
import BarCharts from './BarCharts';
import PieCharts from './PieCharts';
import SimpleChart from './SimpleChart';

export const Chart = () => {
    return(
        <>
            <div style={{display:"flex"}}>
                <SimpleChart />
                <PieCharts />
                <BarCharts />
            </div>
        </>
    )
}