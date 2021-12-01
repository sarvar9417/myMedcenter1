import React, { useState } from 'react'
import { Kardiolog } from './Kardiolog'
import './turn.css'
export const Turn = () => {

    const [time, setTime] = useState(new Date().toLocaleTimeString())
    setInterval(() => {
        setTime(new Date().toLocaleTimeString())
    }, 1000)

    return (
        <div className="body">
            <div className="cc mb-5">
                <div className="row text-white" style={{ backgroundColor: "#45D3D3" }}>
                    <div className="col-4" >
                        <h1 className="p-4">{new Date().toLocaleDateString()}</h1>
                    </div>
                    <div className="col-4" style={{ textAlign: "center" }}>
                        <h1 className="p-4">MedicalCenter</h1>
                    </div>
                    <div className="col-4" style={{ textAlign: "right" }}>
                        <h1 className="p-4">{time}</h1>
                    </div>
                </div>
            </div>
            <div className="row" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <Kardiolog />
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
            </div>
            <div className="row mt-3" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
            </div>
            <div className="row mt-3" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">

                </div>
            </div>
        </div>
    )
}