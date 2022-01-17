import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../../components/Loader'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSort, faPrint } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const ClientsStatsionarPages = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const [modal, setModal] = useState(false)
    const [client, setClient] = useState(0)
    const options = [
        { value: 'all', label: 'Barcha' },
        { value: 'davolanishda', label: 'Davolanishda' },
        { value: 'yakunlangan', label: 'Yakunlangan' }
    ]

    let paid = 0
    let unpaid = 0
    let k = 0
    let kk = 0
    const [type, setType] = useState("all")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const { loading, request, error, clearError } = useHttp()
    const [clientId, setClientId] = useState('')
    const [all, setAll] = useState()
    const getConnectors = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/cashierstatsionar`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })

            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll])

    const getConnectorsDate = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/cashierstatsionar/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            // console.log(fetch);
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll, startDate, endDate])

    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/statsionar/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/statsionarborn/${born}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, born, setAll])


    const notify = (e) => {
        toast.error(e);
    };

    const searchDate = () => {
        getConnectorsDate()
    }

    const sortOnOff = (event) => {
        setType(event.value)
    }

    const searchId = () => {
        getId()
    }

    const searchBornDate = () => {
        getBorn()
    }

    const history = useHistory()
    const [connectorId, setConnectorId] = useState(0)
    const endStatsionar = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/endstatsionar/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            // history.pushState(`/reseption/endstatsionar/${connectorId}`)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, connectorId])

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!all) {
            getConnectors()
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container m-5 mx-auto" style={{ minWidth: "1250px" }}  >
            <div className="row mb-3">
                <div className=" col-2">
                    <DatePicker className="form-control mb-2" selected={startDate} onChange={(date) => { setStartDate(date) }} />
                </div>
                <div className="col-2">
                    <DatePicker className="form-control mb-2" selected={endDate} onChange={(date) => setEndDate(date)} />
                </div>
                <div className="col-1">
                    <button onClick={searchDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}> <FontAwesomeIcon icon={faSearch} /> </button>
                </div>
                <div className="col-2">
                    <input style={{ marginRight: "5px", width: "115px" }} defaultValue={clientId} onChange={(event) => { setClientId(parseInt(event.target.value)) }} className="form-control pb-2 d-inline-block" type="number" placeholder="ID qidiruvi" />
                    <button onClick={searchId} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <input className="form-control mb-2" type="date" onChange={(event) => { setBorn(new Date(event.target.value)) }} />
                </div>
                <div className="col-1">
                    <button onClick={searchBornDate} className="btn text-white mb-2" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="col-2">
                    <Select onChange={(event) => sortOnOff(event)} defaultValue={options[0]} options={options} />
                </div>
            </div>
            <div className="row">
                <div className="offset-11 col-1 text-end">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>

            </div>
            <div>
                <div style={{ minWidth: "1100px" }} >
                    <table id="" className="table-striped table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center" >F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Tug'ilgan yili <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Xona <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="diagnos text-center">Tashxis <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Oldindan to'lov miqdori <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center">Oldindan to'lov <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center">To'lov  </th>
                                <th scope="" className="cek text-center"> Chek <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <div className="d-none" >
                <table id="reseptionReport" className=" table-hover"  >
                    <thead className=" ">
                        <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                        <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="fish text-center" >F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="date text-center" >Tug'ilgan yili <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="phone text-center">Xona <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="diagnos text-center">Tashxis <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="phone text-center">Oldindan to'lov <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="fish text-center"> Holati <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="cek text-center"> Kelgan vaqti  </th>
                        <th scope="" className="cek text-center"> Ketgan vaqti<FontAwesomeIcon icon={faSort} /></th>
                    </thead>
                    <tbody className="" >
                        {all && all.connectors.map((connector, key) => {
                            if (type === "all") {
                                kk++
                                return (
                                    <tr key={key} >
                                        <td className="no" >{kk}</td>
                                        <td className="date" >{new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleTimeString()}</td>
                                        <td className="fish text-uppercase text-success" style={{ fontWeight: "600" }} >{all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}</td>
                                        <td className="date" >{all && new Date(all.clients[key].born).toLocaleDateString()}</td>
                                        <td className="id" >{all && all.clients[key].id}</td>
                                        <td className="phone">{all && all.rooms[key].roomname}</td>
                                        <td className="diagnos ">  {connector.diagnosis} </td>
                                        <td className="phone">{connector.prepaymentCashier}</td>
                                        <td scope="" className="fish text-center">
                                            {connector.position}
                                        </td>
                                        <td scope="" className="cek text-center">
                                            {new Date(all.rooms[key].beginDay).toLocaleDateString()}
                                        </td>
                                        <td scope="" className="cek text-center">
                                            {new Date(all.rooms[key].endDay).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )
                            } else {
                                if (type === connector.position) {
                                    kk++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{kk}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish text-uppercase text-success" style={{ fontWeight: "600" }} >{all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}</td>
                                            <td className="id" >{all && all.clients[key].id}</td>
                                            <td className="phone">{all && all.rooms[key].roomname}</td>
                                            <td className="diagnos ">  {connector.diagnosis} </td>
                                            <td className="phone">{connector.prepaymentCashier}</td>
                                            <td scope="" className="fish text-center">
                                                {connector.position}
                                            </td>
                                            <td scope="" className="cek text-center">
                                                {new Date(all.rooms[key].beginDay).toLocaleDateString()}
                                            </td>
                                            <td scope="" className="cek text-center">
                                                {new Date(all.rooms[key].endDay).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    )
                                }
                            }
                        }
                        )
                        }

                    </tbody>
                </table>
            </div>

            <div className="overflow-auto" style={{ height: "65vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {all && all.connectors.map((connector, key) => {
                            if (type === "all") {
                                k++
                                return (
                                    <tr key={key} >
                                        <td className="no" >{k}</td>
                                        <td className="date" >{new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleTimeString()}</td>
                                        <td className="fish text-success text-uppercase" style={{ fontWeight: "600" }} > {all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}</td>
                                        <td className="date" >{all && new Date(all.clients[key].born).toLocaleDateString()}</td>
                                        <td className="id" >{all && all.clients[key].id}</td>
                                        <td className="phone">{all && all.rooms[key].roomname}</td>
                                        <td className="diagnos ">  {connector.diagnosis} </td>
                                        <td className="phone">{connector.prepaymentCashier}</td>
                                        <td scope="" className="fish text-center">
                                            {connector.position === "davolanishda" ? <Link className='btn button-success' to={`/cashier/prepayment/${all.clients[key]._id}/${connector._id}`}> Qo'shish</Link> : "Xizmat yakunlangan"}
                                        </td>
                                        <td scope="" className="cek text-center">
                                            {connector.position === "yakunlangan" ? <Link to={`/cashier/paystatsionar/${all.clients[key]._id}/${connector._id}`} className='btn button-danger' >Qabul qilish </Link> : "Xizmat yakunlanmagan"}
                                        </td>
                                        <td scope="" className="cek text-center">
                                            <Link to={`/cashier/recieptstatsionar/${all && all.clients[key]._id}/${connector._id}`} > <FontAwesomeIcon icon={faPrint} className="fa-2x" /> </Link>
                                        </td>
                                    </tr>
                                )
                            } else {
                                if (type === connector.position) {
                                    k++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{k}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(connector._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish text-uppercase text-success" style={{ fontWeight: "600" }} >{all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}</td>
                                            <td className="id" >{all && all.clients[key].id}</td>
                                            <td className="phone">{all && all.rooms[key].roomname}</td>
                                            <td className="diagnos ">  {connector.diagnosis} </td>
                                            <td className="phone">{connector.prepaymentCashier}</td>
                                            <td scope="" className="fish text-center">
                                                {connector.position === "davolanishda" ? <Link className='btn button-success' to={`/cashier/prepayment/${all.clients[key]._id}/${connector._id}`}> Qo'shish</Link> : "Xizmat yakunlangan"}
                                            </td>
                                            <td scope="" className="cek text-center">
                                                {connector.position === "yakunlangan" ? <Link to={`/cashier/paystatsionar/${all.clients[key]._id}/${connector._id}`} className='btn button-danger' >Qabul qilish </Link> : "Xizmat yakunlanmagan"}
                                            </td>
                                            <td scope="" className="cek text-center">
                                                <Link to={`/cashier/recieptstatsionar/${all && all.clients[key]._id}/${connector._id}`} > <FontAwesomeIcon icon={faPrint} className="fa-2x" /> </Link>
                                            </td>
                                        </tr>
                                    )
                                }
                            }
                        }
                        )
                        }
                    </tbody>

                </table>
            </div>



            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-4" style={{ fontFamily: "times" }}>
                        <div className="text-center fs-4 fw-bold text-secondary">
                            <span className="text-dark">Mijoz: </span>  {client && client.lastname} {client && client.firstname} {client && client.fathername} ga ko'rsatilgan xizmatlar yakunlanganini tasdiqlaysizmi?
                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={endStatsionar} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
