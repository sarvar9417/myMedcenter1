import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { useHttp } from './../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from './../context/AuthContext'

const mongoose = require('mongoose')

toast.configure()
export const PaymentsCounterAgents = () => {
    let cash = 0
    let transfer = 0
    let card = 0
    let k = 0
    const auth = useContext(AuthContext)
    const counteragentId = auth.callcenterId
    //Avtorizatsiyani olish
    let doctor = 0
    let counterAgent = 0
    const { request, error, clearError } = useHttp()
    const [all, setAll] = useState()
    const [options, setOptions] = useState()

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const searchDate = () => {
        getPayments()
    }

    const notify = (e) => {
        toast.error(e);
    };


    //====================================================================================
    //====================================================================================
    //====================================================================================
    // Bo'limlar bo'yicha sartirovka

    const getPaymentType = useCallback(async (doctorId) => {
        try {
            console.log(doctorId);
            const fetch = await request(`/api/counteragentpayment/doctor/${startDate}/${endDate}/${doctorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll, startDate, endDate])


    const sortOnOff = (event) => {
        if (event.value === "all") {
            getPayments()
        } else {
            getPaymentType(event.id)
        }
    }

    const getPayments = useCallback(async () => {
        try {
            const fetch = await request(`/api/counteragentpayment/${startDate}/${endDate}/${auth.counteragentId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
        }
    }, [request, auth, setAll, startDate, endDate, counteragentId])

    const getDoctors = useCallback(async () => {
        try {
            const fetch = await request(`/api/counterdoctor/${auth.counteragentId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let o = [{
                label: "Barchasi",
                value: "all",
            }]
            fetch.map((doctor) => {
                o.push({
                    id: doctor._id,
                    label: doctor.lastname + " " + doctor.firstname,
                    value: doctor.lastname + " " + doctor.firstname,
                })
            })
            setOptions(o)
        } catch (e) {
        }
    }, [request, auth, setOptions, startDate, endDate, auth])

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!all && auth.counteragentId) {
            getPayments()
        }
        if (!options && auth.counteragentId) {
            getDoctors()
        }
    }, [notify, clearError])

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
                    <Select styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} onChange={(event) => sortOnOff(event)} defaultValue={options && options[0]} options={options} />
                </div>
                <div className="offset-4 col-1 text-end">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>

            </div>
            <div className="container m-5 mx-auto" style={{ minWidth: "1100px" }}  >
                <div>
                    <div>
                        <table id="reseptionReport" className=" table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px", margin: "auto" }} >
                            <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                                <tr>
                                    <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                    <th scope="" className="date text-center" >Qabul qilingan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="diagnos text-center" >F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center" >ID <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center">Xizmat turi <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center">Xizmat Narxi <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center">Kontragent ulushi <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center ">Shifokor <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center ">Shifokor ulushi <FontAwesomeIcon icon={faSort} /></th>
                                </tr>
                            </thead>
                            <tbody className="" >
                                {
                                    all && all.sections.map((sectionss, index) => {
                                        return sectionss.map((section, key) => {
                                            if (all.directions[index][key].counterDoctor > 100) {
                                                doctor = doctor + all.directions[index][key].doctorProcient
                                            } else {
                                                doctor = doctor + all.directions[index][key].doctorProcient * section.price / 100
                                            }
                                            if (all.directions[index][key].counteragentProcient > 100) {
                                                counterAgent = counterAgent + all.directions[index][key].counteragentProcient
                                            } else {
                                                counterAgent = counterAgent + all.directions[index][key].counteragentProcient * section.price / 100
                                            }
                                            return (
                                                <tr>
                                                    <td className='no'>{++k}</td>
                                                    <td className='diagnos text-center'>
                                                        {new Date(section.bronDay).toLocaleDateString()}
                                                        <br />
                                                        {new Date(section.bronDay).toLocaleTimeString()}
                                                    </td>
                                                    <td className='phone'>{all.clients[index].lastname} {all.clients[index].firstname}</td>
                                                    <td className='phone'>{all.clients[index].id}</td>
                                                    <td className='phone text-center'>{section.name} {section.subname}</td>
                                                    <td className='phone text-center fw-bold text-primary'>{section.price}</td>
                                                    <td className='phone text-center fw-bold text-success'>
                                                        {
                                                            all.directions[index][key].counteragentProcient > 100
                                                                ?
                                                                all.directions[index][key].counteragentProcient
                                                                :
                                                                all.directions[index][key].counteragentProcient * section.price / 100
                                                        }
                                                    </td>
                                                    <td className='diagnos text-center'>{all.counterdoctors[index].lastname} {all.counterdoctors[index].firstname}</td>
                                                    <td className='diagnos text-center fw-bold text-danger'>
                                                        {
                                                            all.directions[index][key].doctorProcient > 100
                                                                ?
                                                                all.directions[index][key].doctorProcient
                                                                :
                                                                all.directions[index][key].doctorProcient * section.price / 100
                                                        }</td>
                                                </tr>
                                            )
                                        })
                                    })
                                }
                                <tr>
                                    <td colSpan={6} className='fw-bold'>
                                        Jami:
                                    </td>
                                    <td className="diagnos fw-bold"> Kontragent </td>
                                    <td className="diagnos fw-bold"></td>
                                    <td className="diagnos fw-bold"> Shifokor</td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                    </td>
                                    <td className="diagnos fw-bold text-success">  {counterAgent} </td>
                                    <td className="diagnos fw-bold ">   </td>
                                    <td className="diagnos fw-bold text-danger">  {doctor} </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
