import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const ClientsDoctor = () => {
    let mmm = -1
    //Avtorizatsiyani olish
    const { loading, request, error, clearError } = useHttp()
    const [doctor, setDoctor] = useState()
    const doctorId = useParams().id
    const auth = useContext(AuthContext)

    let paid = 0
    let unpaid = 0
    let doctorSumma = 0
    let allPrice = 0
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
            const fetch = await request(`/api/connector/doctor/${startDate}/${endDate}/${doctorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll, doctorId])

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
                <div className="col-1 text-end">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>
            </div>
            <div className="row">
                <div className='col-2 '>
                    <input onChange={(event) => { setFish(event.target.value) }} className='form-control' placeholder='Mijoz ism-familiyasi' />
                </div>
                <div className='col-1'>
                    <button onClick={(event) => (searchName((event.target.value)))} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
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
                                <th scope="" className="date text-center">Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">Doctor ulushi <FontAwesomeIcon icon={faSort} /></th>
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
                            <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">Doctor ulushi <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {
                            all && all.sections.map((section, index) => {
                                allPrice = allPrice + section.price
                                paid = paid + section.priceCashier
                                if (all && all.directions[index].doctorProcient <= 100) {
                                    doctorSumma = doctorSumma + section.price * all.directions[index].doctorProcient / 100
                                } else {
                                    doctorSumma = doctorSumma + all.directions.doctorProcient
                                }
                                return (
                                    <tr index={index} className=' border-top' >
                                        <td className="no border-right" >
                                            {++k}
                                        </td>
                                        <td className="fish text-uppercase ps-3 fw-bold text-success">
                                            {all.clients[index].lastname} {all.clients[index].firstname} {all.clients[index].fathername}
                                        </td>
                                        <td className="id" >
                                            {new Date(all.clients[index].born).toLocaleDateString()}
                                        </td>
                                        <td className="id" >
                                            {all.clients[index].id}
                                        </td>
                                        <td className="phone" >
                                            +{all.clients[index].phone}
                                        </td>
                                        <td className="date text-center" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                        <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                        <td className="date text-center">{section.price}</td>
                                        <td className="date text-center">{section.priceCashier}</td>
                                        <td className="date text-center">{all && all.directions[index].doctorProcient < 101 ? section.price * all.directions[index].doctorProcient / 100 : all.directions[index].doctorProcient}</td>
                                    </tr>
                                )
                            }
                            )
                        }
                    </tbody>
                    <tfooter className=" ">
                        <tr>
                            <th className="no text-end text-right" scope="" colSpan="7" > Jami </th>
                            <th scope="" className="prices text-center"> {allPrice}</th>
                            <th scope="" className="prices text-center"> {paid}</th>
                            <th scope="" className="prices text-center">{doctorSumma}</th>
                        </tr>
                    </tfooter>

                </table>
            </div>

            <div className="overflow-auto" style={{ height: "55vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {
                            all && all.sections.map((section, index) => {
                                allPrice = allPrice + section.price
                                paid = paid + section.priceCashier
                                if (all && all.directions[index].doctorProcient <= 100) {
                                    doctorSumma = doctorSumma + section.price * all.directions[index].doctorProcient / 100
                                } else {
                                    doctorSumma = doctorSumma + all.directions.doctorProcient
                                }
                                return (
                                    <tr index={index} className=' border-top' >
                                        <td className="no border-right" >
                                            {++kk}
                                        </td>
                                        <td className="fish text-uppercase ps-3 fw-bold text-success">
                                            {all.clients[index].lastname} {all.clients[index].firstname} {all.clients[index].fathername}
                                        </td>
                                        <td className="id" >
                                            {new Date(all.clients[index].born).toLocaleDateString()}
                                        </td>
                                        <td className="id" >
                                            {all.clients[index].id}
                                        </td>
                                        <td className="phone" >
                                            +{all.clients[index].phone}
                                        </td>
                                        <td className="date text-center" >{new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleTimeString()}</td>
                                        <td className="section text-uppercase">  {section.name}  <span style={{ fontSize: "10pt" }}>{section.subname}</span></td>
                                        <td className="date text-center">{section.price}</td>
                                        <td className="date text-center">{section.priceCashier}</td>
                                        <td className="date text-center">{all && all.directions[index].doctorProcient < 101 ? section.price * all.directions[index].doctorProcient / 100 : all.directions[index].doctorProcient}</td>
                                    </tr>
                                )
                            }
                            )
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
                                <th scope="" className="cek text-center text-danger">  Doktor ulushi </th>
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
                                <th scope="" className="cek text-center "> {allPrice}</th>
                                <th scope="" className="cek text-center text-success"> {paid} </th>
                                <th scope="" className="cek text-center text-danger">  {doctorSumma} </th>
                            </tr>
                        </tfooter>
                    </table>
                </div>
            </div>
        </div>
    )
}
