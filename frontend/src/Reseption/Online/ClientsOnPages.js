import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faSyncAlt, faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import './../CSS/tableStyle.css'
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const ClientsOnPages = () => {
    let allPrice = 0
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)

    const options = [
        { value: 'all', label: 'Barcha' },
        { value: 'kelgan', label: 'Kelgan' },
        { value: 'kutilmoqda', label: 'Kutilmoqda' },
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
            const fetch = await request(`/api/connector/reseptiononline/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(fetch)
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])

    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseptiononline/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseptionbornonline/${born}`, 'GET', null, {
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
        getConnectors()
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

    const [connector, setConnector] = useState()
    const [sections, setSections] = useState()
    const [client, setClient] = useState()
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)

    const Delete = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/section/reseption/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth])

    const DeleteConnector = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/connector/reseption/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth])

    const Remove = () => {
        sections.map((section) => {
            Delete(section._id)
        })
        DeleteConnector(connector._id)
        window.location.reload()
    }

    const Update = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/section/reseption/${id}`, 'PUT', { position: "kelgan" }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth])

    const Confirm = () => {
        sections.map((section) => {
            Update(section._id)
        })
        window.location.reload()
    }


    const setDelete = (connector, sections, client) => {
        setConnector(connector)
        setSections(sections)
        setClient(client)
        setModal2(true)
    }

    const setConfirm = (connector, sections, client) => {
        setClient(client)
        setConnector(connector)
        setSections(sections)
        setModal1(true)
    }


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
                                <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="edit text-center">Tasdiqlash <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center"> Rad etish <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Holati <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="turn text-center">Kelish vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <div className="d-none" >
                <table id="reseptionReport" className=" table-hover"  >
                    <thead className=" ">
                        <tr>
                            <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                            <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="date text-center" > Holati <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="turn text-center">Kelish vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">Qarz <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {
                            all &&
                            all.connectors.map((connector, key) => {
                                if (type === "all") {
                                    if (all.sections[key].length !== 0) {
                                        k++
                                    }
                                    return (
                                        all && all.sections[key].map((section, index) => {
                                            if (index === 0) {
                                                if (section.payment !== "to'lanmagan") {
                                                    paid = paid + section.priceCashier
                                                    unpaid = unpaid + (section.price - section.priceCashier)
                                                }
                                                return (
                                                    <tr key={index} className=' border-top' >
                                                        <td
                                                            className="no border-right"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {k}
                                                        </td>
                                                        <td
                                                            className="fish text-uppercase ps-3 fw-bold text-success"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {new Date(all.clients[key].born).toLocaleDateString()}
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {all.clients[key].id}
                                                        </td>
                                                        <td
                                                            className="phone"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            +{all.clients[key].phone}
                                                        </td>
                                                        <td className="date text-center" >{section.position}</td>
                                                        <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                                        <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                    </tr>
                                                )
                                            } else {
                                                if (section.payment !== "to'lanmagan") {
                                                    paid = paid + section.priceCashier
                                                    unpaid = unpaid + (section.price - section.priceCashier)
                                                }
                                                return (
                                                    <tr key={index}  >
                                                        <td className="date fw-normal"  >{section.position}</td>
                                                        <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span> </td>
                                                        <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                        <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    )
                                } else {
                                    if (type === all.sections[key][0].position) {
                                        if (all.sections[key].length !== 0) {
                                            k++
                                        }
                                        return (
                                            all && all.sections[key].map((section, index) => {
                                                if (index === 0) {
                                                    if (section.payment !== "to'lanmagan") {
                                                        paid = paid + section.priceCashier
                                                        unpaid = unpaid + (section.price - section.priceCashier)
                                                    }
                                                    return (
                                                        <tr key={index} className=' border-top' >
                                                            <td
                                                                className="no border-right"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {k}
                                                            </td>
                                                            <td
                                                                className="fish text-uppercase ps-3 fw-bold text-success"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {new Date(all.clients[key].born).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {all.clients[key].id}
                                                            </td>
                                                            <td
                                                                className="phone"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                +{all.clients[key].phone}
                                                            </td>
                                                            <td className="date text-center" >{section.position}</td>
                                                            <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    if (section.payment !== "to'lanmagan") {
                                                        paid = paid + section.priceCashier
                                                        unpaid = unpaid + (section.price - section.priceCashier)
                                                    }
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal"  >{section.position}</td>
                                                            <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span> </td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        )
                                    }
                                }
                            }
                            )

                        }
                    </tbody>
                    <tfooter className=" ">
                        <tr>
                            <th className="no text-end text-right" scope="" colSpan="8" > Jami </th>
                            <th scope="" className="prices text-center"> {unpaid + paid}</th>
                            <th scope="" className="prices text-center"> {paid}</th>
                            <th scope="" className="prices text-center">{unpaid}</th>
                        </tr>
                    </tfooter>

                </table>
            </div>

            <div className="overflow-auto" style={{ height: "65vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {all &&
                            all.connectors.map((connector, key) => {
                                if (type === "all") {
                                    if (all.sections[key].length !== 0) {
                                        kk++
                                    }
                                    return (
                                        all && all.sections[key].map((section, index) => {
                                            if (index === 0) {
                                                return (
                                                    <tr key={index} className=' border-top border-success' >
                                                        <td
                                                            className="no border-right border-success"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {kk}
                                                        </td>
                                                        <td
                                                            className="fish text-uppercase ps-3"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                {all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}
                                                            </Link>
                                                            <br />
                                                            <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all.clients[key]._id}`} >
                                                                <FontAwesomeIcon icon={faPenAlt} />
                                                            </Link>
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {new Date(all.clients[key].born).toLocaleDateString()}
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {all.clients[key].id}
                                                        </td>
                                                        <td
                                                            className="phone"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            +{all.clients[key].phone}
                                                        </td>
                                                        <td
                                                            className="edit"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {section.position === "kutilmoqda" ?
                                                                <button className='btn button-success text-success' onClick={() => { setConfirm(connector, all.sections[key], all.clients[key]) }} >
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </button>
                                                                :
                                                                ""}
                                                        </td>
                                                        <td
                                                            className="cek"
                                                            rowSpan={all.sections[key].length}
                                                        >
                                                            {section.position === "kutilmoqda" ?
                                                                <button className='btn button-danger' onClick={() => { setDelete(connector, all.sections[key], all.clients[key]) }} >
                                                                    <FontAwesomeIcon icon={faTrashAlt} />
                                                                </button>
                                                                :
                                                                ""}
                                                        </td>
                                                        <td className="date text-center border-left border-success" >{section.position}</td>
                                                        <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                        <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                        <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                    </tr>
                                                )
                                            } else {
                                                return (
                                                    <tr key={index}  >
                                                        <td className="date fw-normal border-left border-success "  >{section.position}</td>
                                                        <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                        <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                        <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                    </tr>
                                                )
                                            }
                                        })
                                    )

                                } else {
                                    if (type === all.sections[key][0].position) {
                                        if (all.sections[key].length !== 0) {
                                            kk++
                                        }
                                        return (
                                            all && all.sections[key].map((section, index) => {
                                                if (index === 0) {
                                                    return (
                                                        <tr key={index} className=' border-top border-success' >
                                                            <td
                                                                className="no border-right border-success"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {kk}
                                                            </td>
                                                            <td
                                                                className="fish text-uppercase ps-3"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                    {all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}
                                                                </Link>
                                                                <br />
                                                                <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all.clients[key]._id}`} >
                                                                    <FontAwesomeIcon icon={faPenAlt} />
                                                                </Link>
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {new Date(all.clients[key].born).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {all.clients[key].id}
                                                            </td>
                                                            <td
                                                                className="phone"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                +{all.clients[key].phone}
                                                            </td>
                                                            <td
                                                                className="edit"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {
                                                                    section.position === "kutilmoqda" ?
                                                                        <button className='btn button-success text-success' onClick={() => { setConfirm(connector, all.sections[key], all.clients[key]) }} >
                                                                            <FontAwesomeIcon icon={faCheck} />
                                                                        </button>
                                                                        : ""
                                                                }
                                                            </td>
                                                            <td
                                                                className="cek"
                                                                rowSpan={all.sections[key].length}
                                                            >
                                                                {
                                                                    section.position === "kutilmoqda" ?
                                                                        <button className='btn button-danger' onClick={() => { setDelete(connector, all.sections[key], all.clients[key]) }} >
                                                                            <FontAwesomeIcon icon={faTrashAlt} />
                                                                        </button> : ""
                                                                }
                                                            </td>
                                                            <td className="date text-center border-left border-success" >{section.position}</td>
                                                            <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal border-left border-success "  >{section.position}</td>
                                                            <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td className={section.price === section.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        )

                                    }
                                }
                            })
                        }
                    </tbody>

                </table>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal1 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-3">
                        <div className="text-center fs-4 fw-bold text-secondary">
                            <span className="text-dark">Mijoz: </span>  {client && client.lastname} {client && client.firstname} {client && client.fathername}
                        </div>
                        <table className="w-100 mt-3">
                            <thead>
                                <tr style={{ borderBottom: "1px solid #999" }} >
                                    <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>№</th>
                                    <th style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Kuni</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Soati</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderBottom: "1px solid #999" }}>

                                {
                                    sections && sections.map((section, key) => {
                                        allPrice = allPrice + section.price
                                        return (
                                            <tr key={key}>
                                                <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                                                <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                                                    {section.name}
                                                </td>
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{new Date(section.bronDay).toLocaleDateString()}</td>
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.bronTime}</td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>

                        <div className="row m-1 mt-3">
                            <div className="col-6">
                                <div className="fw-bold text-primary">Jami to'lov:</div>
                            </div>
                            <div className="col-6">
                                <div className="fw-bold  text-end ">{allPrice}</div>
                            </div>
                            <hr />

                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={Confirm} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal1(false)} className="btn btn-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal2 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-3">
                        <div className='card-body fs-3 text-danger'>
                            Diqqat! Ushbu {client && client.lastname + " " + client.firstname} xizmatlari mijoz kelmaganligi sababli xizmatlar ro'yxatidan o'chirishni tasdiqlaysizmi?
                        </div>

                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={Remove} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal2(false)} className="btn btn-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


