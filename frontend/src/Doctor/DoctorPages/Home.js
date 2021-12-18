import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import './home.css'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import {Loader} from '../components/Loader'

toast.configure()
export const Home = () => {
    const auth = useContext(AuthContext)

    const { loading, request, error, clearError } = useHttp()
    const [online, setOnline] = useState([])
    const [offline, setOffline] = useState({
        firstname: "",
        lastname: "",
        fathername: "",
        turn: ""
    })
    const [clientOffline, setClientOffline] = useState([])
    const [clientOnline, setClientOnline] = useState([])

    const getOnline = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctoronline/${auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            getClientOnline(fetch.client)
            setOnline(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth])

    const getClientOnline = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/clients/doctor/${id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClientOnline(fetch)
        } catch (e) {
            notify(error)
        }
    }, [request, auth])

    const getOffline = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctoroffline/${auth.doctor.section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            getClientOffline(fetch.client)
            setOffline(fetch)
        } catch (e) {

        }
    }, [request, auth])

    const getClientOffline = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/clients/doctor/${id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClientOffline(fetch)
        } catch (e) {

        }
    }, [request, auth])



    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        getOnline()
        getOffline()

    }, [getOnline, getOffline])

    const notify = (e) => {
        toast.error(e)
    }

    const [time, setTime] = useState(new Date().toLocaleTimeString())
    setInterval(() => {
        setTime(new Date().toLocaleTimeString())
    }, 1000)

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className="cc mb-5">
                <div className="row text-white" style={{ backgroundColor: "#45D3D3" }}>
                    <div className="d-lg-block col-4  d-none " >
                        <h3 className="p-3">{new Date().toLocaleDateString()}</h3>
                    </div>
                    <div className="d-md-block col-md-6 col-lg-4 d-none" style={{ textAlign: "center" }}>
                        <h3 className="p-3">{auth.doctor ? auth.doctor.section : ""}: {auth.doctor && auth.doctor.lastname} {auth.doctor && auth.doctor.firstname[0]}</h3>
                    </div>
                    <div className="col-md-4" style={{ textAlign: "right" }}>
                        <h3 className="p-3">{time}</h3>
                    </div>
                </div>
            </div>
            <div className="container" >
                <article className="linkk orangee" style={{ maxWidth: "700px", margin: "auto" }}>
                    <div className="row w-100" >
                        <div className="col-12">
                            <h4>
                                Mijoz: {clientOffline.lastname} {clientOffline.firstname}  {clientOffline.fathername}
                            </h4>
                            <h4>
                                ID: {clientOffline.id}
                            </h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6" >
                            <h4>Navbat : {
                                offline.turn
                            }
                            </h4>
                        </div>
                        <div className="col-6 text-end" >
                            <Link to={`/doctor/adoption/${offline._id}`} className="btn text-white" style={{ backgroundColor: "#FCAE49", width: "50%", marginLeft: "5%" }}>Kirish</Link>
                        </div>
                    </div>


                </article>
                <article className={`linkk blue mt-5 ${clientOnline.length === 0 ? "d-none" : "d-block"}`} style={{ maxWidth: "700px", margin: "auto" }}>
                    <div className="row w-100" >
                        <div className="col-12">
                            <h4>
                                Mijoz: {clientOnline.lastname} {clientOnline.firstname}  {clientOnline.fathername}
                            </h4>
                            <h4>
                                ID: {clientOnline.id}
                            </h4>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6" >
                            <h4>Vaqti : {
                                online.bronTime
                            }
                            </h4>
                        </div>
                        <div className="col-6 text-end" >
                            <Link to={`/doctor/adoption/${online._id}`} className="btn text-white" style={{ backgroundColor: "#539EF1", width: "50%", marginLeft: "5%" }}>Kirish</Link>

                        </div>
                    </div>


                </article>

            </div>




            {/* <hr></hr>
            <div className="container">
                <div className="col-md-12">
                    <article className="linkk blue mt-5" >
                        <h1>MedCenter Director</h1>
                        <div className="row mt-5">
                            <div className="col-md-4">
                            </div>
                            <div className="col-md-6">
                                <h2>Nosirov Islom</h2>
                                <p style={{ fontSize: "20px" }}>17 avgust 2003</p>
                                <p style={{ fontSize: "20px" }}>MedCenter Director MedCenter Director MedCenter Director MedCenter Director MedCenter Director</p>
                                <p style={{ fontSize: "20px" }}>+998 93 123 21 23</p>
                                <p style={{ fontSize: "20px" }}>nosirovislom07@gmail.com</p>
                                <p style={{ textAlign: "right" }}>
                                    <button className="btn text-white" style={{ backgroundColor: "rgb(83, 158, 241)", width: "20%", marginLeft: "5%" }}>Edit</button>
                                </p>

                            </div>

                        </div>

                    </article>
                </div>

            </div> */}

        </>
    )
}