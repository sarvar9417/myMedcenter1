import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const Doctors = () => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [doctors, setDoctors] = useState([])

    const getDoctors = useCallback(async () => {
        try {
            const fetch = await request('/api/auth/doctor/director', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(fetch);
            setDoctors(fetch)
        } catch (error) {

        }
    })

    useEffect(()=>{
        if (doctors.length === 0) {
            getDoctors()
        }
    }, [getDoctors])
    return (
        <div>
            <div className="container-lg" style={{ padding: "20px 0" }}>
                <div className="row" style={{ justifyContent: "center" }}>
                    <div class=" col-lg-3 col-md-4 col-sm-6" style={{ padding: "15px", margin: "15px", boxShadow: "2px 2px 13px rgb(0 0 0 / 10%)" }}>
                        <div class="doc-img" style={{ position: "relative", overflow: "hidden", zIndex: "1" }}>
                            <Link>
                                <img alt="Card Image" style={{ borderRadius: "5px", width: "100%" }} src="https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg" class="card-img-top" />
                            </Link>
                        </div>
                        <div className="doc-body pt-3" >
                            <h3 style={{ fontSize: "20px", fontWeight: "500" }}>{}</h3>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}>Uzbekiston Navoiy MedCenter Kardiolog </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> Navoiy, Uzbekiston </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> 17 avgust 2003 </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> $100 - $400 </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button className="btn profile-button" style={{ padding: "5px 15px", border: "2px solid #0d6efd", color: "#0d6efd" }}>
                                View Profile
                            </button>
                            <button className="btn btn-primary profile-button" style={{ padding: "5px 15px" }}>
                                Edit
                            </button>
                        </div>
                    </div>
                    <div class=" col-lg-3 col-md-4 col-sm-6" style={{ padding: "15px", margin: "15px", boxShadow: "2px 2px 13px rgb(0 0 0 / 10%)" }}>
                        <div class="doc-img" style={{ position: "relative", overflow: "hidden", zIndex: "1" }}>
                            <Link>
                                <img alt="Card Image" style={{ borderRadius: "5px", width: "100%" }} src="https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg" class="card-img-top" />
                            </Link>
                        </div>
                        <div className="doc-body pt-3" >
                            <h3 style={{ fontSize: "20px", fontWeight: "500" }}>{ }</h3>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}>Uzbekiston Navoiy MedCenter Kardiolog </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> Navoiy, Uzbekiston </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> 17 avgust 2003 </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> $100 - $400 </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button className="btn profile-button" style={{ padding: "5px 15px", border: "2px solid #0d6efd", color: "#0d6efd" }}>
                                View Profile
                            </button>
                            <button className="btn btn-primary profile-button" style={{ padding: "5px 15px" }}>
                                Edit
                            </button>
                        </div>
                    </div>
                    <div class=" col-lg-3 col-md-4 col-sm-6" style={{ padding: "15px", margin: "15px", boxShadow: "2px 2px 13px rgb(0 0 0 / 10%)" }}>
                        <div class="doc-img" style={{ position: "relative", overflow: "hidden", zIndex: "1" }}>
                            <Link>
                                <img alt="Card Image" style={{ borderRadius: "5px", width: "100%" }} src="https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg" class="card-img-top" />
                            </Link>
                        </div>
                        <div className="doc-body pt-3" >
                            <h3 style={{ fontSize: "20px", fontWeight: "500" }}>{ }</h3>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}>Uzbekiston Navoiy MedCenter Kardiolog </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> Navoiy, Uzbekiston </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> 17 avgust 2003 </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> $100 - $400 </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button className="btn profile-button" style={{ padding: "5px 15px", border: "2px solid #0d6efd", color: "#0d6efd" }}>
                                View Profile
                            </button>
                            <button className="btn btn-primary profile-button" style={{ padding: "5px 15px" }}>
                                Edit
                            </button>
                        </div>
                    </div>
                    <div class=" col-lg-3 col-md-4 col-sm-6" style={{ padding: "15px", margin: "15px", boxShadow: "2px 2px 13px rgb(0 0 0 / 10%)" }}>
                        <div class="doc-img" style={{ position: "relative", overflow: "hidden", zIndex: "1" }}>
                            <Link>
                                <img alt="Card Image" style={{ borderRadius: "5px", width: "100%" }} src="https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg" class="card-img-top" />
                            </Link>
                        </div>
                        <div className="doc-body pt-3" >
                            <h3 style={{ fontSize: "20px", fontWeight: "500" }}>{ }</h3>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}>Uzbekiston Navoiy MedCenter Kardiolog </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> Navoiy, Uzbekiston </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> 17 avgust 2003 </p>
                            <p style={{ color: "#757575", fontSize: "14px", fontWeight: "500" }}> $100 - $400 </p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <button className="btn profile-button" style={{ padding: "5px 15px", border: "2px solid #0d6efd", color: "#0d6efd" }}>
                                View Profile
                            </button>
                            <button className="btn btn-primary profile-button" style={{ padding: "5px 15px" }}>
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
