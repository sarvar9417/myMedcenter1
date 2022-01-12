import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../../components/Loader'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const ClientsPages = () => {
    let mmm = -1
    //Avtorizatsiyani olish
    const { loading, request, error, clearError } = useHttp()

    const auth = useContext(AuthContext)
    const [options, setOptions] = useState()

    const getOptions = useCallback(async () => {
        try {
            const data = await request("/api/direction/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            const fetch = await request("/api/warehouse/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            let m = [{
                _id: "123",
                __v: 0,
                value: "all",
                label: "All",
                subvalue: " ",
                price: 0
            }]
            data.map((section) => {
                let k = 0
                m.map((mm) => {
                    if (mm.value === section.section) {
                        k++
                    }
                })
                if (!k) {
                    m.push({
                        value: section.section,
                        label: section.section,
                        subvalue: " ",
                        price: 0
                    })
                }
            })
            fetch.map((ware) => {
                let k = 0
                m.map((mm) => {
                    if (mm.value === ware.name) {
                        k++
                    }
                })
                if (!k) {
                    m.push({
                        value: ware.name,
                        label: ware.name,
                        subvalue: " ",
                        price: 0
                    })
                }
            })
            setOptions(m)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setOptions, options])

    let paid = 0
    let unpaid = 0
    let k = 0
    let kk = 0
    const [type, setType] = useState("all")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const [clientId, setClientId] = useState('')
    const [all, setAll] = useState()
    const getConnectors = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseption/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])

    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseption/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseptionborn/${born}`, 'GET', null, {
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

    //====================================================================================
    //====================================================================================
    //====================================================================================
    // Bo'limlar bo'yicha sartirovka

    const getSortSection = useCallback(async (section) => {
        try {
            console.log(section)
            const fetch = await request(`/api/connector/director/${startDate}/${endDate}/${section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])
    const sortOnOff = (event) => {
        if (event.label === "all") {
            getConnectors()
        } else {
            getSortSection(event.label)
        }
    }

    const searchId = () => {
        getId()
    }

    const searchBornDate = () => {
        getBorn()
    }

    //=================================================================================
    //=================================================================================
    //=================================================================================
    // FISH bilan qidirish
    const [fish, setFish] = useState()
    const searchName = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseptionoffline/${startDate}/${endDate}/${fish}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setAll, startDate, endDate, fish])

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!all) {
            getConnectors()
        }
        if (!options) {
            getOptions()
        }
    }, [notify, clearError])

    // if (loading) {
    //     return <Loader />
    // }

    return (
        <div className="container m-5 mx-auto" style={{ minWidth: "1100px" }}  >
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
                    <Select onChange={(event) => sortOnOff(event)} defaultValue={options && options[0]} options={options} />
                </div>
            </div>
            <div className="row">
                <div className='col-2 '>
                    <input onChange={(event) => { setFish(event.target.value) }} className='form-control' placeholder='Mijoz ism-familiyasi' />
                </div>
                <div className='col-1'>
                    <button onClick={(event) => (searchName((event.target.value)))} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                </div>
                <div className="offset-8 col-1 text-end">
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
                                <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'lanmagan <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">Izoh <FontAwesomeIcon icon={faSort} /></th>
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
                            <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="turn text-center">Navbati <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">Qarz <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">Izoh <FontAwesomeIcon icon={faSort} /></th>
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
                                    return (<>
                                        {
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
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {k}
                                                            </td>
                                                            <td
                                                                className="fish text-uppercase ps-3 fw-bold text-success"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {new Date(all.clients[key].born).toLocaleDateString()}
                                                            </td>
                                                            <td
                                                                className="id"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                {all.clients[key].id}
                                                            </td>
                                                            <td
                                                                className="phone"
                                                                rowSpan={all.sections[key].length + all.services[key].length}
                                                            >
                                                                +{all.clients[key].phone}
                                                            </td>
                                                            <td className="date text-center" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                            <td className="date text-center" >{section.commentCashier}</td>
                                                        </tr>
                                                    )
                                                } else {
                                                    if (section.payment !== "to'lanmagan") {
                                                        paid = paid + section.priceCashier
                                                        unpaid = unpaid + (section.price - section.priceCashier)
                                                    }
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal"  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span> </td>
                                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                            <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                            <td className="date text-center" >{section.commentCashier}</td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                        {all && all.sections[key].length === 0 ?
                                            <>{
                                                all && all.services[key].map((service, index) => {
                                                    if (index === 0) {
                                                        if (service.payment !== "to'lanmagan") {
                                                            paid = paid + service.priceCashier
                                                            unpaid = unpaid + (service.price - service.priceCashier)
                                                        }
                                                        return (
                                                            <tr className=' border-top border-success' >
                                                                <td
                                                                    className="no border-right border-success"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    {++k}
                                                                </td>
                                                                <td
                                                                    className="fish text-uppercase ps-3"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                        {all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}
                                                                    </Link>
                                                                    <br />
                                                                    <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key]._id}`} >
                                                                        <FontAwesomeIcon icon={faPenAlt} />
                                                                    </Link>
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all.services[key].length}
                                                                >
                                                                    {all && new Date(all.clients[key].born).toLocaleDateString()}
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    {all && all.clients[key].id}
                                                                </td>
                                                                <td
                                                                    className="phone"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    +{all && all.clients[key].phone}
                                                                </td>
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                <td className='turn'></td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                                <td className="date text-center" >{service.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    } else {
                                                        if (service.payment !== "to'lanmagan") {
                                                            paid = paid + service.priceCashier
                                                            unpaid = unpaid + (service.price - service.priceCashier)
                                                        }
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                <td className='turn'></td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                                <td className="date text-center" >{service.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    }
                                                })


                                            }
                                            </> :
                                            <>{
                                                all && all.services[key].map((service, index) => {
                                                    if (service.payment !== "to'lanmagan") {
                                                        paid = paid + service.priceCashier
                                                        unpaid = unpaid + (service.price - service.priceCashier)
                                                    }
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                            <td className='turn'></td>
                                                            <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                            <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                            <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                            <td className="date text-center" >{service.commentCashier}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                        }
                                    </>
                                    )
                                } else {
                                    if (type === connector.type) {
                                        if (all.sections[key].length !== 0) {
                                            k++
                                        }
                                        return (<>
                                            {
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
                                                                    rowSpan={all.sections[key].length + all.services[key].length}
                                                                >
                                                                    {k}
                                                                </td>
                                                                <td
                                                                    className="fish text-uppercase ps-3 fw-bold text-success"
                                                                    rowSpan={all.sections[key].length + all.services[key].length}
                                                                >
                                                                    {all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all.sections[key].length + all.services[key].length}
                                                                >
                                                                    {new Date(all.clients[key].born).toLocaleDateString()}
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all.sections[key].length + all.services[key].length}
                                                                >
                                                                    {all.clients[key].id}
                                                                </td>
                                                                <td
                                                                    className="phone"
                                                                    rowSpan={all.sections[key].length + all.services[key].length}
                                                                >
                                                                    +{all.clients[key].phone}
                                                                </td>
                                                                <td className="date text-center" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                                                <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                                <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                                <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                                <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                                <td className="date text-center" >{section.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    } else {
                                                        if (section.payment !== "to'lanmagan") {
                                                            paid = paid + section.priceCashier
                                                            unpaid = unpaid + (section.price - section.priceCashier)
                                                        }
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal"  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span> </td>
                                                                <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                                                <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price}</td>
                                                                <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.priceCashier}</td>
                                                                <td >{section.payment === "to'lanmagan" ? "Rad etilgan" : section.price - section.priceCashier}</td>
                                                                <td className="date text-center" >{section.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    }
                                                })
                                            }
                                            {all && all.sections[key].length === 0 ?
                                                <>{
                                                    all && all.services[key].map((service, index) => {
                                                        if (index === 0) {
                                                            if (service.payment !== "to'lanmagan") {
                                                                paid = paid + service.priceCashier
                                                                unpaid = unpaid + (service.price - service.priceCashier)
                                                            }
                                                            return (
                                                                <tr className=' border-top border-success' >
                                                                    <td
                                                                        className="no border-right border-success"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        {++k}
                                                                    </td>
                                                                    <td
                                                                        className="fish text-uppercase ps-3"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                            {all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}
                                                                        </Link>
                                                                        <br />
                                                                        <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key]._id}`} >
                                                                            <FontAwesomeIcon icon={faPenAlt} />
                                                                        </Link>
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all.services[key].length}
                                                                    >
                                                                        {all && new Date(all.clients[key].born).toLocaleDateString()}
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key].id}
                                                                    </td>
                                                                    <td
                                                                        className="phone"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        +{all && all.clients[key].phone}
                                                                    </td>
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                    <td className='turn'></td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                                    <td className="date text-center" >{service.commentCashier}</td>
                                                                </tr>
                                                            )
                                                        } else {
                                                            if (service.payment !== "to'lanmagan") {
                                                                paid = paid + service.priceCashier
                                                                unpaid = unpaid + (service.price - service.priceCashier)
                                                            }
                                                            return (
                                                                <tr key={index}  >
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                    <td className='turn'></td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                    <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                                    <td className="date text-center" >{service.commentCashier}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    })


                                                }
                                                </> :
                                                <>{
                                                    all && all.services[key].map((service, index) => {
                                                        if (service.payment !== "to'lanmagan") {
                                                            paid = paid + service.priceCashier
                                                            unpaid = unpaid + (service.price - service.priceCashier)
                                                        }
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase"> {service.name} {service.type}</td>
                                                                <td className='turn'></td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.priceCashier}</td>
                                                                <td className={service.price === service.priceCashier ? "prices fw-bold text-success" : "prices fw-bold text-danger"} >{service.price - service.priceCashier}</td>
                                                                <td className="date text-center" >{service.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            }
                                        </>
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

            <div className="overflow-auto" style={{ height: "55vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {all &&
                            all.connectors.map((connector, key) => {
                                if (type === "all") {
                                    if (all.sections[key].length !== 0) {
                                        kk++
                                    }
                                    return (<>
                                        {all && all.sections[key].map((section, index) => {
                                            if (index === 0) {
                                                return (
                                                    <tr key={index} className=' border-top border-success' >
                                                        <td
                                                            className="no border-right border-success"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            {kk}
                                                        </td>
                                                        <td
                                                            className="fish text-uppercase ps-3"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            <Link className='text-success' style={{ fontWeight: "600" }} to={`/cashier/reciept/${all.clients[key]._id}/${all.connectors[key]._id}`} >
                                                                {all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}
                                                            </Link>
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            {new Date(all.clients[key].born).toLocaleDateString()}
                                                        </td>
                                                        <td
                                                            className="id"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            {all.clients[key].id}
                                                        </td>
                                                        <td
                                                            className="phone"
                                                            rowSpan={all.sections[key].length + all.services[key].length}
                                                        >
                                                            +{all.clients[key].phone}
                                                        </td>
                                                        <td className="date text-center border-left border-success" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                        <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                        <td className="prices text-primary fw-bold">{section.price}</td>
                                                        <td className="prices text-success fw-bold">{section.priceCashier}</td>
                                                        <td className="prices text-danger fw-bold">{section.price - section.priceCashier}</td>
                                                        <td className="date text-center" >{section.commentCashier}</td>
                                                    </tr>
                                                )
                                            } else {
                                                return (
                                                    <tr key={index}  >
                                                        <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                        <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                        <td className="prices text-primary fw-bold">{section.price}</td>
                                                        <td className="prices text-success fw-bold">{section.priceCashier}</td>
                                                        <td className="prices text-danger fw-bold">{section.price - section.priceCashier}</td>
                                                        <td className="date text-center" >{section.commentCashier}</td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                        {all && all.sections[key].length === 0 ?
                                            <>{
                                                all && all.services[key].map((service, index) => {
                                                    if (index === 0) {
                                                        return (
                                                            <tr className=' border-top border-success' >
                                                                <td
                                                                    className="no border-right border-success"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    {++kk}
                                                                </td>
                                                                <td
                                                                    className="fish text-uppercase ps-3"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                        {all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}
                                                                    </Link>
                                                                    <br />
                                                                    <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key]._id}`} >
                                                                        <FontAwesomeIcon icon={faPenAlt} />
                                                                    </Link>
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all.services[key].length}
                                                                >
                                                                    {all && new Date(all.clients[key].born).toLocaleDateString()}
                                                                </td>
                                                                <td
                                                                    className="id"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    {all && all.clients[key].id}
                                                                </td>
                                                                <td
                                                                    className="phone"
                                                                    rowSpan={all && all.services[key].length}
                                                                >
                                                                    +{all && all.clients[key].phone}
                                                                </td>
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                <td className="prices text-primary fw-bold">{service.price}</td>
                                                                <td className="prices text-success fw-bold">{service.priceCashier}</td>
                                                                <td className="prices text-danger fw-bold">{service.price - service.priceCashier}</td>
                                                                <td className="date text-center" >{service.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    } else {
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                <td className="prices text-primary fw-bold">{service.price}</td>
                                                                <td className="prices text-success fw-bold">{service.priceCashier}</td>
                                                                <td className="prices text-danger fw-bold">{service.price - service.priceCashier}</td>
                                                                <td className="date text-center" >{service.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    }
                                                })


                                            }
                                            </> :
                                            <>{
                                                all && all.services[key].map((service, index) => {
                                                    return (
                                                        <tr key={index}  >
                                                            <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                            <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                            <td className="prices text-primary fw-bold">{service.price}</td>
                                                            <td className="prices text-success fw-bold">{service.priceCashier}</td>
                                                            <td className="prices text-danger fw-bold">{service.price - service.priceCashier}</td>
                                                            <td className="date text-center" >{service.commentCashier}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                        }
                                    </>
                                    )
                                } else {
                                    if (all.sections[key].length !== 0) {
                                        kk++
                                    }
                                    return (
                                        <>
                                            {
                                                all && all.sections[key].map((section, index) => {
                                                    if (section.name === type) {
                                                        mmm++
                                                        if (mmm === 0) {
                                                            return (
                                                                <tr key={index} className=' border-top border-success' >
                                                                    <td
                                                                        className="no border-right border-success"
                                                                        rowSpan={all.sections[key].length + all.services[key].length}
                                                                    >
                                                                        {mmm}
                                                                    </td>
                                                                    <td
                                                                        className="fish text-uppercase ps-3"
                                                                        rowSpan={all.sections[key].length + all.services[key].length}
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
                                                                        rowSpan={all.sections[key].length + all.services[key].length}
                                                                    >
                                                                        {new Date(all.clients[key].born).toLocaleDateString()}
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all.sections[key].length + all.services[key].length}
                                                                    >
                                                                        {all.clients[key].id}
                                                                    </td>
                                                                    <td
                                                                        className="phone"
                                                                        rowSpan={all.sections[key].length + all.services[key].length}
                                                                    >
                                                                        +{all.clients[key].phone}
                                                                    </td>
                                                                    <td className="date text-center border-left border-success" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                                    <td className="prices text-primary fw-bold">{section.price}</td>
                                                                    <td className="prices text-success fw-bold">{section.priceCashier}</td>
                                                                    <td className="prices text-danger fw-bold">{section.price - section.priceCashier}</td>
                                                                    <td className="date text-center" >{section.commentCashier}</td>
                                                                </tr>
                                                            )
                                                        } else {
                                                            return (
                                                                <tr key={index}  >
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} className={section.summary !== " " ? "prices fw-bold text-success" : "prices fw-bold text-danger"} > {section.name} <br /> <span style={{ fontSize: "10pt" }}>{section.subname}</span> </Link></td>
                                                                    <td className="prices text-primary fw-bold">{section.price}</td>
                                                                    <td className="prices text-success fw-bold">{section.priceCashier}</td>
                                                                    <td className="prices text-danger fw-bold">{section.price - section.priceCashier}</td>
                                                                    <td className="date text-center" >{section.commentCashier}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    }
                                                })}
                                            {all && all.sections[key].length === 0 ?
                                                <>{
                                                    all && all.services[key].map((service, index) => {
                                                        if (index === 0) {
                                                            return (
                                                                <tr className=' border-top border-success' >
                                                                    <td
                                                                        className="no border-right border-success"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        {++kk}
                                                                    </td>
                                                                    <td
                                                                        className="fish text-uppercase ps-3"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        <Link className='text-success' style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${all.clients[key]._id}`} >
                                                                            {all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}
                                                                        </Link>
                                                                        <br />
                                                                        <Link className='btn button-success text-success' style={{ fontWeight: "600" }} to={`/reseption/edit/${all && all.clients[key]._id}`} >
                                                                            <FontAwesomeIcon icon={faPenAlt} />
                                                                        </Link>
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all.services[key].length}
                                                                    >
                                                                        {all && new Date(all.clients[key].born).toLocaleDateString()}
                                                                    </td>
                                                                    <td
                                                                        className="id"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        {all && all.clients[key].id}
                                                                    </td>
                                                                    <td
                                                                        className="phone"
                                                                        rowSpan={all && all.services[key].length}
                                                                    >
                                                                        +{all && all.clients[key].phone}
                                                                    </td>
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                    <td className="prices text-primary fw-bold">{service.price}</td>
                                                                    <td className="prices text-success fw-bold">{service.priceCashier}</td>
                                                                    <td className="prices text-danger fw-bold">{service.price - service.priceCashier}</td>
                                                                    <td className="date text-center" >{service.commentCashier}</td>
                                                                </tr>
                                                            )
                                                        } else {
                                                            return (
                                                                <tr key={index}  >
                                                                    <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                    <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                    <td className="prices text-primary fw-bold">{service.price}</td>
                                                                    <td className="prices text-success fw-bold">{service.priceCashier}</td>
                                                                    <td className="prices text-danger fw-bold">{service.price - service.priceCashier}</td>
                                                                    <td className="date text-center" >{service.commentCashier}</td>
                                                                </tr>
                                                            )
                                                        }
                                                    })


                                                }
                                                </> :
                                                <>{
                                                    all && all.services[key].map((service, index) => {
                                                        return (
                                                            <tr key={index}  >
                                                                <td className="date fw-normal border-left border-success "  >{new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(service._id).getTimestamp().toLocaleTimeString()}</td>
                                                                <td className="section text-uppercase fw-bold text-info"> {service.name} <br /> <span style={{ fontSize: "10pt" }}>{service.type}</span></td>
                                                                <td className="prices text-primary fw-bold">{service.price}</td>
                                                                <td className="prices text-success fw-bold">{service.priceCashier}</td>
                                                                <td className="prices text-danger fw-bold">{service.price - service.priceCashier}</td>
                                                                <td className="date text-center" >{service.commentCashier}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                            }
                                        </>
                                    )

                                }
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div>
                <div style={{ minWidth: "1100px" }} className='py-4' >
                    <table id="" className="table-striped table-hover pt-2" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <tfooter>
                            <tr className="mt-4">
                                <th className="no" scope="" ></th>
                                <th scope="" className="date text-center" ></th>
                                <th scope="" className="fish text-center"></th>
                                <th scope="" className="id text-center"></th>
                                <th scope="" className="phone text-center"></th>
                                <th scope="" className="section text-center"></th>
                                <th scope="" className="edit text-center"> </th>
                                <th scope="" className="prices text-center"> </th>
                                <th scope="" className="cek text-center "> Umumiy</th>
                                <th scope="" className="cek text-center text-success"> To'langan </th>
                                <th scope="" className="cek text-center text-danger">  To'lanmagan </th>
                            </tr>
                            <tr className="mt-4">
                                <th className="no" scope="" >Jami:</th>
                                <th scope="" className="date text-center" ></th>
                                <th scope="" className="fish text-center"></th>
                                <th scope="" className="id text-center"></th>
                                <th scope="" className="phone text-center"></th>
                                <th scope="" className="section text-center"></th>
                                <th scope="" className="edit text-center"> </th>
                                <th scope="" className="prices text-center"> </th>
                                <th scope="" className="cek text-center "> {unpaid + paid}</th>
                                <th scope="" className="cek text-center text-success"> {paid} </th>
                                <th scope="" className="cek text-center text-danger">  {unpaid} </th>
                            </tr>
                        </tfooter>
                    </table>
                </div>
            </div>
        </div>
    )
}
