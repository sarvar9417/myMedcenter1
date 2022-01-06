import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './cashier.css'
import { AuthContext } from '../context/AuthContext'
import { toast } from "react-toastify"
import { useHttp } from '../hooks/http.hook'
const mongoose = require('mongoose')

toast.configure()
export const CheckHistory = () => {
    let num = 0
    let num2 = 0
    const auth = useContext(AuthContext)
    const history = useHistory()
    const { request, error, clearError, loading } = useHttp()
    const notify = (e) => {
        toast.error(e)
    }
    const [modal, setModal] = useState(false)

    let allPrice = 0
    let paymented = 0
    let back = 0

    const [clientId, setClientId] = useState(useParams().id)
    const [clientid, setClientid] = useState(useParams().id)
    const [sections, setSections] = useState()
    const [services, setServices] = useState()
    const [client, setClient] = useState()

    const getClient = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/cashier/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, clientId, setClient, auth])


    const getAllSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/cashier/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSections(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, clientId, setSections, auth])

    const getAllServices = useCallback(async () => {
        try {
            const fetch = await request(`/api/service/cashier/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setServices(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, clientId, setServices, auth])

    const setPayments = () => {
        history.push({
            pathname: `/cashier/recieptall/${clientId}`,
        })
    }

    const getchangeSections = useCallback(async (event) => {
        try {
            const fetch = await request(`/api/clients/cashierid/${parseInt(event.target.value)}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClientId(fetch[0]._id)
        } catch (e) {
            notify(e)
        }
    }, [request, clientid, auth, setClientId])


    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!sections) {
            getAllSections()
        }
        if (!client) {
            getClient()
        }
        if (!services) {
            getAllServices()
        }
    }, [notify, clearError])


    return (
        <>
            <div className="m-3" style={{ maxWidth: "1000px", padding: "20px 10px", border: "1px solid #999", borderRadius: "5px" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="col-sm-6 col-lg-4 input_box" >
                        <input
                            defaultValue={client && client.id}
                            name='ID'
                            type="number"
                            className="form-control inp w-75 d-inline-block mr-3 mb-2"
                            placeholder=""
                            onChange={getchangeSections}
                        />
                        <label className="labels">Mijoznig ID raqami</label>
                        <button onClick={() => { getClient(); getAllSections() }} className="btn text-white" style={{ backgroundColor: "#45D3D3", marginLeft: "5px" }}><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                    <div className="col-sm-6 col-lg-4 input_box" >
                        <input
                            value={client && client.lastname + " " + client.firstname + " " + client.fathername}
                            disabled
                            name='FIO'
                            type="text"
                            className="form-control inp"
                            placeholder=""
                            style={{ background: "#fff" }}
                        />
                        <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>F.I.O</label>
                    </div>
                </div>
                <table className="w-100 mt-3">
                    <thead>
                        <tr style={{ borderBottom: "1px solid #999" }} >
                            <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>№</th>
                            <th style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                            <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                            <th style={{ width: "20%", textAlign: "center", padding: "10px 0" }}>To'langan</th>
                            <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>To'lanmagan</th>
                            <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>Kuni</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #999" }}>
                        {
                            sections && sections.map((section, key) => {
                                allPrice = allPrice + section.price
                                paymented = paymented + section.priceCashier
                                if (section.payment === "to'lanmagan") {
                                    back = back + section.price
                                }
                                return (
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{++num}</td>
                                        <td style={{ width: "30%", textAlign: "", padding: "10px 0" }}>
                                            {section.name} {section.subname}
                                        </td>
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.payment !== "to'lanmagan" ? section.price : "Rad etilgan"}</td>
                                        <td style={{ width: "20%", padding: "10px 0", textAlign: "center" }}>
                                            {section.payment !== "to'lanmagan" ? section.priceCashier : "Rad etilgan"}
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px 0", color: "green" }}>
                                            {section.payment !== "to'lanmagan" ? section.price - section.priceCashier : "Rad etilgan"}
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px 0" }}>
                                            {new Date(section.bronDay).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {
                            services && services.map((service, key) => {
                                allPrice = allPrice + service.price
                                paymented = paymented + service.priceCashier

                                if (service.payment === "to'lanmagan") {
                                    back = back + service.price
                                }
                                return (
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{++num}</td>
                                        <td style={{ width: "30%", textAlign: "", padding: "10px 0" }}>
                                            {service.name} {service.type}
                                        </td>
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.payment !== "to'lanmagan" ? service.price : "Rad etilgan"}</td>
                                        <td style={{ width: "20%", padding: "10px 0", textAlign: "center" }}>
                                            {service.payment !== "to'lanmagan" ? service.priceCashier : "Rad etilgan"}
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px 0", color: "green" }}>
                                            {service.payment !== "to'lanmagan" ? service.price - service.priceCashier : "Rad etilgan"}
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px 0" }}>
                                            {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="">
                    <div className="row ms-3 mt-3 me-5 ">
                        <div className="col-6">
                            <div className="fw-bold text-primary">Jami to'lov:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end ">{allPrice}</div>
                        </div>
                        <hr />

                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-success">To'langan:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-success">{paymented}</div>
                        </div>
                        <hr />

                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-warning">Qarz:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-warning">{allPrice - paymented - back}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-danger">Rad etilgan:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-danger">{back}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn button-success" onClick={() => { setModal(true) }}>Chekni chop etish</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>  {client && client.lastname} {client && client.firstname} {client && client.fathername}
                            </div>
                        </div>
                        <div className="card-body">
                            <table className="w-100 mt-3">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #999" }} >
                                        <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>№</th>
                                        <th style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                                        <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                                        <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>To'langan</th>
                                        <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>To'lanmagan</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderBottom: "1px solid #999" }}>
                                    {
                                        sections && sections.map((section, key) => {
                                            return (
                                                <tr >
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                                                    <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                                        {section.name}
                                                    </td>
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.payment !== "to'lanmagan" ? section.price : "Rad etilgan"}</td>
                                                    <td style={{ width: "25%", padding: "10px 0", textAlign: "center" }}>
                                                        {section.payment !== "to'lanmagan" ? section.priceCashier : "Rad etilgan"}
                                                    </td>
                                                    <td style={{ textAlign: "center", padding: "10px 0", color: "green" }}>
                                                        {section.payment !== "to'lanmagan" ? section.price - section.priceCashier : "Rad etilgan"}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    {
                                        services && services.map((service, key) => {
                                            return (
                                                <tr >
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{++num}</td>
                                                    <td style={{ width: "30%", textAlign: "", padding: "10px 0" }}>
                                                        {service.name} {service.type}
                                                    </td>
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.payment !== "to'lanmagan" ? service.price : "Rad etilgan"}</td>
                                                    <td style={{ width: "20%", padding: "10px 0", textAlign: "center" }}>
                                                        {service.payment !== "to'lanmagan" ? service.priceCashier : "Rad etilgan"}
                                                    </td>
                                                    <td style={{ textAlign: "center", padding: "10px 0", color: "green" }}>
                                                        {service.payment !== "to'lanmagan" ? service.price - service.priceCashier : "Rad etilgan"}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            <div className="">
                                <div className="row ms-3 mt-3 me-5 ">
                                    <div className="col-6">
                                        <div className="fw-bold text-primary">Jami to'lov:</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="fw-bold  text-end ">{allPrice}</div>
                                    </div>
                                    <hr />

                                </div>
                                <div className="row ms-3 me-5">
                                    <div className="col-6">
                                        <div className="fw-bold text-success">To'langan:</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="fw-bold  text-end text-success">{paymented}</div>
                                    </div>
                                    <hr />

                                </div>
                                <div className="row ms-3 me-5">
                                    <div className="col-6">
                                        <div className="fw-bold text-warning">Qarz:</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="fw-bold  text-end text-warning">{allPrice - paymented - back}</div>
                                    </div>
                                    <hr />
                                </div>
                                <div className="row ms-3 me-5">
                                    <div className="col-6">
                                        <div className="fw-bold text-danger">Rad etilgan:</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="fw-bold  text-end text-danger">{back}</div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={setPayments} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Chekka chiqarish</button>
                                    <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
