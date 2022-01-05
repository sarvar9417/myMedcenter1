import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { useHttp } from '../hooks/http.hook'
import './cashier.css'
import { AuthContext } from '../context/AuthContext'
import { toast } from "react-toastify"

toast.configure()
export const CheckCashier = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const notify = (e) => {
        toast.error(e)
    }
    const [modal1, setModal1] = useState(false)

    const [clientId, setClientId] = useState(useParams().id)
    const [connectorId, setConnectorId] = useState(useParams().connector)
    const [connector, setConnector] = useState()
    const [client, setClient] = useState()
    const { request, error, clearError } = useHttp()

    const [payment, setPayment] = useState({
        client: clientId,
        connector: connectorId,
        type: "",
        total: 0,
        cash: 0,
        card: 0,
        transfer: 0,
        position: ""
    })

    const setPay = (event) => {
        setPayment({
            ...payment,
            [event.target.id]: parseInt(event.target.value),
            total: paymented
        })
    }

    const setAllPayment = (event) => {
        if (event.target.id === "mixed") {
            setPayment({
                total: paymented,
                type: event.target.id,
            })
        }
        if (event.target.id === "card") {
            setPayment({
                ...payment,
                total: paymented,
                type: event.target.id,
                cash: 0,
                transfer: 0,
                [event.target.id]: paymented,
            })
        }
        if (event.target.id === "cash") {
            setPayment({
                ...payment,
                total: paymented,
                type: event.target.id,
                card: 0,
                transfer: 0,
                [event.target.id]: paymented,
            })
        }
        if (event.target.id === "transfer") {
            setPayment({
                ...payment,
                total: paymented,
                type: event.target.id,
                cash: 0,
                card: 0,
                [event.target.id]: paymented,
            })
        }
        if (event.target.id === "mixed") {
            setPayment({
                ...payment,
                total: paymented,
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
            setConnector(fetch)
            setPayment({ ...payment, position: fetch.type })
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setConnector])

    const patchConnector = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/cashier/${connectorId}`, 'PATCH', { ...section }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth, connectorId])


    const createPayment = useCallback(async () => {
        try {
            const fetch = await request(`/api/payment/register`, 'POST', { ...payment }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth, payment])

    const setPayments = () => {
        sections && sections.map((section) => {
            patchPaymentSections(section)
        })
        services && services.map((service) => {
            patchPaymentServices(service)
        })
        createPayment()
        history.push({
            pathname: `/cashier/reciept/${clientId}/${connectorId}`
        })
    }


    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!client) {
            getClient()
        }
        if (!connector) {
            getConnector()
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
                            <th style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>Mavjud summa</th>
                            <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>yangi summa</th>
                            <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>Qo'shish</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #999" }}>
                        <tr >
                            <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>1</td>
                            <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                {connector.prepaymentCashier}
                            </td>
                            <td style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>
                                <input type="number" className='form-control' />
                            </td>
                            <td style={{ width: "25%", padding: "10px 0" }}>
                                <button className='btn button-success'>Qo'shish</button>
                            </td>
                        </tr>

                    </tbody>
                </table>

                <div className="">
                    <div className="row ms-3 mt-3 me-5 ">
                        <div className="col-6">
                            <div className="fw-bold text-primary">Mavjud to'lov:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end ">{connector.prepaymentCashier}</div>
                        </div>
                        <hr />

                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-success">Yangi to'lov:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-success">{p}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-warning">Jami:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-warning">{ }</div>
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
                            <button className="btn button-success" >To'lovni tasdiqlash</button>
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
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={setPayments} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal1(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal2 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>
                                {client && client.lastname} {client && client.firstname} {client && client.fathername}ga ko'rsatilayotgan
                                <span className='text-danger'> {delService && delService.name + " " + delService.type}</span> xizmati mijozning xizmatlar bo'limidan o'chiriladi. O'chirishni tasdiqlaysizmi?
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={DeleteService} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal2(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal3 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>
                                {client && client.lastname} {client && client.firstname} {client && client.fathername}ga ko'rsatilayotgan
                                <span className='text-danger'> {delSection && delSection.name + " " + delSection.subname}</span> xizmati(yoki ashyosi) mijozning xizmatlar bo'limidan o'chiriladi. O'chirishni tasdiqlaysizmi?
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={DeleteSection} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal3(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
