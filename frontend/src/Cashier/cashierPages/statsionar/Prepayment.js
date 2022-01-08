import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { useHttp } from '../../hooks/http.hook'
import '../cashier.css'
import { AuthContext } from '../../context/AuthContext'
import { toast } from "react-toastify"

toast.configure()
export const Prepayment = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const notify = (e) => {
        toast.error(e)
    }
    const [modal1, setModal1] = useState(false)
    const [paymented, setPaymented] = useState()
    const [clientId, setClientId] = useState(useParams().client)
    const [connectorId, setConnectorId] = useState(useParams().connector)
    const [connector, setConnector] = useState()
    const [client, setClient] = useState()
    const { request, error, clearError } = useHttp()
    const [old, setOld] = useState(0)

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
        setPayment({
            ...payment,
            [event.target.id]: parseInt(event.target.value),
            total: paymented
        })
    }

    const changePrepayment = (event) => {
        setPaymented(parseInt(event.target.value))
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
            setOld(fetch.prepaymentCashier)
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setConnector])

    const patchConnector = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/cashier/${connectorId}`, 'PATCH', { ...connector }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth, connectorId, connector])


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
        patchConnector()
        createPayment()
        history.push({
            pathname: `/cashier/reciept/${clientId}/${connectorId}`
        })
    }

    const confirm = () => {
        setConnector({ ...connector, prepaymentCashier: parseInt(connector.prepaymentCashier) + paymented })
        setModal1(true)
        window.scrollTo({ top: 0 })
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
                        // onChange={getchangeSections}
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
                            <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>Yangi summa</th>
                            <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>Jami</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #999" }}>
                        <tr >
                            <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>1</td>
                            <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                {connector && connector.prepaymentCashier}
                            </td>
                            <td style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>
                                <input onChange={changePrepayment} defaultValue={paymented && paymented} type="number" className='form-control' />
                            </td>
                            <td style={{ width: "25%", padding: "10px 20px" }} className='text-center' >
                                {paymented && old + paymented}
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
                            <div className="fw-bold  text-end ">{connector && connector.prepaymentCashier}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-success">Yangi to'lov:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-success">{paymented && paymented}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-warning">Jami:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-warning">{paymented && paymented + old}</div>
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
                            <button onClick={confirm} className="btn button-success" >To'lovni tasdiqlash</button>
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
                            <table className="w-100 mt-3">
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #999" }} >
                                        <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>№</th>
                                        <th style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>Mavjud summa</th>
                                        <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>Yangi summa</th>
                                        <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>Jami</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderBottom: "1px solid #999" }}>
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>1</td>
                                        <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                            {old}
                                        </td>
                                        <td style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>
                                            <input onChange={changePrepayment} disabled defaultValue={paymented && paymented} type="number" className='form-control' />
                                        </td>
                                        <td style={{ width: "25%", padding: "10px 0" }} className='text-center'>
                                            {connector && connector.prepaymentCashier}
                                        </td>
                                    </tr>

                                </tbody>
                            </table>

                            <div className="row ms-3 mt-3 me-5 ">
                                <div className="col-6">
                                    <div className="fw-bold text-primary">Mavjud to'lov:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end ">{old}</div>
                                </div>
                                <hr />
                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-success">Yangi to'lov:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-success">{paymented && paymented}</div>
                                </div>
                                <hr />
                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-warning">Jami:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-warning">{connector && connector.prepaymentCashier}</div>
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={setPayments} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => { setConnector({ ...connector, prepaymentCashier: old }); setModal1(false) }} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
