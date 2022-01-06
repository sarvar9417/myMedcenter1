import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { useHttp } from '../hooks/http.hook'
import './cashier.css'
import { AuthContext } from '../context/AuthContext'
import { toast } from "react-toastify"

toast.configure()
export const CheckStatsionar = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const notify = (e) => {
        toast.error(e)
    }
    let num = 0
    let num2 = 0
    const [modal1, setModal1] = useState(false)
    const [debitor, setDebitor] = useState(0)
    const [pay, setPays] = useState(0)
    let allPrice = 0
    let paymented = 0
    let back = 0

    const [clientId, setClientId] = useState(useParams().id)
    const [connectorId, setConnectorId] = useState(useParams().connector)
    const [clientid, setClientid] = useState()
    const [sections, setSections] = useState()
    const [services, setServices] = useState()
    const [connector, setConnector] = useState()
    const [client, setClient] = useState()
    const { request, error, clearError, loading } = useHttp()

    const [payment, setPayment] = useState({
        client: clientId,
        connector: connectorId,
        type: "",
        total: 0,
        cash: 0,
        card: 0,
        transfer: 0,
        position: "statsionar"
    })

    const setPay = (event) => {
        if (event.target.id === "card") {
            setPayment({
                ...payment,
                [event.target.id]: parseInt(event.target.value),
                total: payment.cash + payment.transfer + parseInt(event.target.value)
            })
        }

        if (event.target.id === "cash") {
            setPayment({
                ...payment,
                [event.target.id]: parseInt(event.target.value),
                total: payment.card + payment.transfer + parseInt(event.target.value)
            })
        }

        if (event.target.id === "transfer") {
            setPayment({
                ...payment,
                [event.target.id]: parseInt(event.target.value),
                total: payment.cash + payment.card + parseInt(event.target.value)
            })
        }
    }

    const setAllPayment = (event) => {
        if (event.target.id === "card") {
            setPayment({
                ...payment,
                total: debitor,
                type: event.target.id,
                cash: 0,
                transfer: 0,
                [event.target.id]: debitor,
            })
        }
        if (event.target.id === "cash") {
            setPayment({
                ...payment,
                total: debitor,
                type: event.target.id,
                card: 0,
                transfer: 0,
                [event.target.id]: debitor,
            })
        }
        if (event.target.id === "transfer") {
            setPayment({
                ...payment,
                total: debitor,
                type: event.target.id,
                cash: 0,
                card: 0,
                [event.target.id]: debitor,
            })
        }
        if (event.target.id === "mixed") {
            setPayment({
                ...payment,
                total: debitor,
                type: event.target.id,
                cash: 0,
                card: 0,
                transfer: 0
            })
        }
    }

    const getClient = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/cashier/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, clientId, auth, setClient])

    const getConnector = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDebitor(fetch.prepayment)
            setPays(fetch.prepayment)
            setConnector(fetch)
            setPayment({ ...payment, position: fetch.type })
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setConnector, setPays, setDebitor])

    const getSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/cashierconnector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSections(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setSections])

    const getServices = useCallback(async () => {
        try {
            const fetch = await request(`/api/service/cashierconnector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setServices(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setServices])

    const inputPriceSection = (event, key) => {
        document.getElementById(`checkbox${key}`).checked = false
        if (parseInt(event.target.value) > sections[key].price) {
            return notify("Iltimos to'lovdan ortiqcha summa kiritmang")
        }
        if (parseInt(event.target.value) === sections[key].price) {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: parseInt(event.target.value), payment: "to'langan", commentCashier: " " },
                }))
        } else {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: parseInt(event.target.value), payment: "kutilmoqda" },
                }))
        }
    }

    const inputPriceService = (event, key) => {
        document.getElementById(`checkboxservice${key}`).checked = false
        if (parseInt(event.target.value) > services[key].price) {
            return notify("Iltimos to'lovdan ortiqcha summa kiritmang")
        }
        if (parseInt(event.target.value) === services[key].price) {
            setServices(
                Object.values({
                    ...services,
                    [key]: { ...services[key], priceCashier: parseInt(event.target.value), payment: "to'langan", commentCashier: " " },
                }))
        } else {
            setServices(
                Object.values({
                    ...services,
                    [key]: { ...services[key], priceCashier: parseInt(event.target.value), payment: "kutilmoqda" },
                }))
        }
    }

    const checkPrices = () => {
        let k = 0

        if (payment.total > debitor) {
            return notify("Diqqat! Iltimos mijozdan umumiy summadan ortiq to'lov qabul qilmang.")
        }
        if (!k) {
            window.scrollTo({ top: 0 })
            setModal1(true)
        }
    }
    const patchPaymentSections = useCallback(async (section) => {
        try {
            const fetch = await request(`/api/section/cashier/${section._id}`, 'PATCH', { ...section }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth])

    const patchPaymentServices = useCallback(async (service) => {
        try {
            const fetch = await request(`/api/service/cashier/${service._id}`, 'PATCH', { ...service }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth])

    const createPayment = useCallback(async () => {
        try {
            const fetch = await request(`/api/payment/register`, 'POST', { ...payment }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth, payment])

    const patchConnector = useCallback(async () => {
        try {
            setConnector({ ...connector, prepayment: debitor - payment.total })
            const fetch = await request(`/api/connector/cashier/${connectorId}`, 'PATCH', {
                ...connector
            }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth, connectorId, connector, setConnector, payment])

    const setPayments = () => {
        sections && sections.map((section) => {
            patchPaymentSections(section)
        })
        services && services.map((service) => {
            patchPaymentServices(service)
        })
        patchConnector()
        createPayment()
        history.push({
            pathname: `/cashier/recieptstatsionar/${clientId}/${connectorId}`
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

    const Paymented = () => {
        let p = 0
        let s = [...services]
        s.map((service, key) => {
            p = p + service.price
            service.priceCashier = service.price
            service.payment = "to'langan"
        })
        setServices(s)
        s = [...sections]
        s.map((section, key) => {
            p = p + section.price
            section.priceCashier = section.price
            section.payment = "to'langan"
        })
        setSections(s)
        connector && setDebitor(p - connector.prepaymentCashier)
    }

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!sections) {
            getSections()
        }
        if (!client) {
            getClient()
        }
        if (!connector) {
            getConnector()
        }
        if (!services) {
            getServices()
        }
    }, [notify, clearError])
    return (
        <>
            <div className="m-3" style={{ minWidth: "700px", maxWidth: "1000px", padding: "20px 10px", border: "1px solid #999", borderRadius: "5px" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="col-sm-6 col-lg-4 input_box" >
                        <input
                            disabled
                            value={client && client.id}
                            name='ID'
                            type="number"
                            className="form-control inp w-75 d-inline-block mr-3 mb-2"
                            placeholder=""
                            style={{ background: "#fff" }}
                            onChange={getchangeSections}
                        />
                        <label className="labels">Mijoznig ID raqami</label>
                        {/* <button onClick={() => { getClient(); getAllSections() }} className="btn text-white" style={{ backgroundColor: "#45D3D3", marginLeft: "5px" }}><FontAwesomeIcon icon={faSearch} /></button> */}
                    </div>
                    <div className="col-sm-6 col-md-4 input_box" >
                        <input
                            disabled
                            value={connector && connector.prepaymentCashier}
                            name='ID'
                            type="number"
                            className="form-control inp w-75 d-inline-block mr-3 mb-2"
                            placeholder=""
                            style={{ background: "#fff" }}
                            onChange={getchangeSections}
                        />
                        <label className="labels">Oldindan to'lov</label>
                        {/* <button onClick={() => { getClient(); getAllSections() }} className="btn text-white" style={{ backgroundColor: "#45D3D3", marginLeft: "5px" }}><FontAwesomeIcon icon={faSearch} /></button> */}
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
                            <th style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                            <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                            <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>To'lov <input onChange={Paymented} type="checkbox" className="check" /></th>
                        </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #999" }}>
                        {
                            sections && sections.map((section, key) => {
                                allPrice = allPrice + section.price
                                paymented = paymented + section.priceCashier
                                num++
                                if (section.payment === "to'lanmagan") {
                                    back = back + section.price
                                }
                                return (
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{num}</td>
                                        <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                            {section.name}
                                        </td>
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                                        <td style={{ width: "25%", padding: "10px 0" }}>
                                            <input disabled onChange={event => inputPriceSection(event, key)} value={section.priceCashier} type="number" className="form-control" style={{ width: "80%", margin: "auto", display: "inline" }} />
                                        </td>

                                    </tr>
                                )
                            })
                        }
                        {
                            services && services.map((service, key) => {
                                allPrice = allPrice + service.price
                                paymented = paymented + service.priceCashier
                                num++
                                if (service.payment === "to'lanmagan") {
                                    back = back + service.price
                                }
                                return (
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{num}</td>
                                        <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                            {service.name}
                                        </td>
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.price}</td>
                                        <td style={{ width: "25%", padding: "10px 0" }}>
                                            <input disabled onChange={event => inputPriceService(event, key)} value={service.priceCashier} type="number" className="form-control" style={{ width: "80%", margin: "auto", display: "inline" }} />
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
                            <div className="fw-bold text-warning">Oldindan to'lov:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-warning">{connector && connector.prepaymentCashier}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-success">To'lanayotgan summa:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-success">{payment.card + payment.cash + payment.transfer}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-danger">Qarz:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-danger">{debitor + pay - (payment.card + payment.cash + payment.transfer)}</div>
                        </div>
                        <hr />
                    </div>
                    <div className='row border-top border-bottom p-3'>
                        <div className='col-md-3 col-4 text-center '>
                            <label className='mx-3 ' >
                                <input onChange={setAllPayment} id='card' type="radio" name="payment" /> Plastik
                            </label>
                            <input
                                value={payment.card}
                                type="number"
                                id='card'
                                onChange={setPay}
                                disabled={payment.type !== "mixed" ? true : false}
                                className='form-control'
                            />
                        </div>
                        <div className='col-md-3 col-4 text-center'>
                            <label className='mx-3'>
                                <input onChange={setAllPayment} id='cash' type="radio" name="payment" id='cash' /> Naqt
                            </label>
                            <input
                                value={payment.cash}
                                type="number"
                                id='cash'
                                onChange={setPay}
                                disabled={payment.type !== "mixed" ? true : false}
                                className='form-control'
                            />
                        </div>
                        <div className='col-md-3 col-4 text-center'>
                            <label className='mx-3'>
                                <input onChange={setAllPayment} id='transfer' type="radio" name="payment" /> O'tkazma
                            </label>
                            <input
                                value={payment.transfer}
                                type="number"
                                id='transfer'
                                onChange={setPay}
                                disabled={payment.type !== "mixed" ? true : false}
                                className='form-control'
                            />
                        </div>
                        <div className='col-md-3 col-4 text-center'>
                            <label className='mx-3'>
                                <input onChange={setAllPayment} id='mixed' type="radio" name="payment" /> Aralash
                            </label>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <div className="col-12 text-center">
                            <button className="btn button-success" onClick={checkPrices}>To'lovni tasdiqlash</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal1 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>  {client && client.lastname} {client && client.firstname} {client && client.fathername}
                            </div>

                        </div>
                        <div className="card-body">
                            <table className="w-100 mt-3" style={{ overflow: "scroll" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #999" }} >
                                        <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>№</th>
                                        <th style={{ width: "20%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                                        <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                                        <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>To'langan</th>
                                        <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>To'lanmagan</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderBottom: "1px solid #999" }}>

                                    {
                                        sections && sections.map((section, key) => {
                                            num2++
                                            return (
                                                <tr >
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{num2}</td>
                                                    <td style={{ width: "20%", textAlign: "center", padding: "10px 0" }}>
                                                        {section.name}
                                                    </td>
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                                                    <td className="text-success" style={{ width: "10%", padding: "10px 0", textAlign: "center" }}>
                                                        {section.priceCashier}
                                                    </td>
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0", color: "red" }}>
                                                        {section.payment !== "to'lanmagan" ? section.price - section.priceCashier : 0}
                                                    </td>


                                                </tr>
                                            )
                                        })
                                    }

                                    {
                                        services && services.map((service, key) => {
                                            num2++
                                            return (
                                                <tr >
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{num2}</td>
                                                    <td style={{ width: "20%", textAlign: "center", padding: "10px 0" }}>
                                                        {service.name}
                                                    </td>
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.price}</td>
                                                    <td className="text-success" style={{ width: "10%", padding: "10px 0", textAlign: "center" }}>
                                                        {service.priceCashier}
                                                    </td>
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0", color: "red" }}>
                                                        {service.payment !== "to'lanmagan" ? service.price - service.priceCashier : 0}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }


                                </tbody>
                            </table>

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
                                    <div className="fw-bold text-warning">Oldindan to'lov:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-warning">{connector && connector.prepaymentCashier}</div>
                                </div>
                                <hr />
                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-success">To'lanayotgan summa:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-success">{payment.card + payment.cash + payment.transfer}</div>
                                </div>
                                <hr />
                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-danger">Qarz:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-danger">{debitor - (payment.card + payment.cash + payment.transfer)}</div>
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={setPayments} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal1(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
