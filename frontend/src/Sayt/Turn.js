import React, { useState } from 'react'

export const Turn = () => {

    const [time, setTime] = useState(new Date().toLocaleTimeString())
    setInterval(() => {
       setTime(new Date().toLocaleTimeString())
    }, 1000)

    return (
        <div className="body">
            <div className="cc mb-5">
                <div className="row text-white" style={{ backgroundColor: "#45D3D3"}}>
                    <div className="col-4" >
                        <h1 className="p-4">{new Date().toLocaleDateString()}</h1>
                    </div>
                    <div className="col-4" style={{ textAlign: "center" }}>
                        <h1 className="p-4">MedicalCenter</h1>
                    </div>
                    <div  className="col-4" style={{ textAlign: "right" }}>
                        <h1 className="p-4">{ time }</h1>
                    </div>
                </div>
            </div>
            <div className="row" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-3" style={{ overflowX: "hidden" }}>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                    <div className="kard" style={{ width: "90%", margin: "auto" }}>
                        <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                            <h2 className="text">Lor</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-8" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                                <h5>Navbat</h5>
                                <h1 style={{ color: "green" }}>46</h1>
                            </div>
                            <div className="col-4" style={{ textAlign: "center" }}>
                                <div className="image">
                                    <h5>Xona</h5>
                                    <h1 style={{ color: "#e3342f" }}>7</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
