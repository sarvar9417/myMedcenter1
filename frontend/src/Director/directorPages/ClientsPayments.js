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
export const ClientsPayments = () => {
    let cash = 0
    let transfer = 0
    let card = 0
    let k = 0
    //Avtorizatsiyani olish
    const { request, error, clearError } = useHttp()
    const [all, setAll] = useState()
    const auth = useContext(AuthContext)
    const [options, setOptions] = useState([
        { value: "all", label: "Barchasi" },
        { value: "cash", label: "Naqt" },
        { value: "card", label: "Plastik" },
        { value: "transfer", label: "O'tkazma" },
        { value: "mixed", label: "Aralash" },
    ])
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const notify = (e) => {
        toast.error(e);
    };

    const searchDate = () => {
        getPayments()
    }

    //====================================================================================
    //====================================================================================
    //====================================================================================
    // Bo'limlar bo'yicha sartirovka

    const getPaymentType = useCallback(async (section) => {
        try {
            const fetch = await request(`/api/payment/directorclients/${startDate}/${endDate}/${section}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll, startDate, endDate])
    const sortOnOff = (event) => {
        if (event.label === "all") {
            getPayments()
        } else {
            getPaymentType(event.value)
        }
    }

    const getPayments = useCallback(async () => {
        try {
            const fetch = await request(`/api/payment/directorclients/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
        }
    }, [request, auth, setAll, startDate, endDate])

    useEffect(() => {

    }, [])

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!all) {
            getPayments()
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
                    <Select onChange={(event) => sortOnOff(event)} defaultValue={options && options[0]} options={options} />
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
            <div className="container m-5 mx-auto" style={{ minWidth: "1250px" }}  >
                <div>
                    <div style={{ minWidth: "1100px" }} >
                        <table id="reseptionReport" id="" className=" table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                            <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                                <tr>
                                    <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                    <th scope="" className="date text-center" >Qabul qilingan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="fish text-center" >F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="date text-center" >Tug'ilgan yili <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="phone text-center">Turi<FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="diagnos text-center">Naqt <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="fish text-center">Plastik <FontAwesomeIcon icon={faSort} /></th>
                                    <th scope="" className="cek text-center">Aralash  </th>
                                    <th scope="" className="cek text-center"> Umumiy <FontAwesomeIcon icon={faSort} /></th>
                                </tr>
                            </thead>
                            <tbody className="" >
                                {all && all.clients.map((client, key) => {
                                    cash = cash + parseInt(all && all.payments[key].cash)
                                    card = card + parseInt(all && all.payments[key].card)
                                    transfer = transfer + parseInt(all && all.payments[key].transfer)
                                    k++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{k}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(all && all.payments[key]._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(all && all.payments[key]._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish text-success text-uppercase" style={{ fontWeight: "600" }} > {all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}</td>
                                            <td className="date" >{all && new Date(all.clients[key].born).toLocaleDateString()}</td>
                                            <td className="id" >{all && all.clients[key].id}</td>
                                            <td className="phone">+{all && all.clients[key].phone}</td>
                                            <td className="phone">{all && all.payments[key].position}</td>
                                            <td className="diagnos text-center">  {all && all.payments[key].cash} </td>
                                            <td className="diagnos text-center">  {all && all.payments[key].card} </td>
                                            <td className="diagnos text-center">  {all && all.payments[key].transfer} </td>
                                            <td className="diagnos text-center">  {all && all.payments[key].cash + all.payments[key].card + all.payments[key].transfer} </td>
                                        </tr>
                                    )

                                }
                                )
                                }
                            </tbody>
                            <tbody className='pt-5 mt-5'>

                                <tr>
                                    <td colSpan={6} className='fw-bold'>
                                        Jami:
                                    </td>
                                    <td className="diagnos fw-bold">  Naqt </td>
                                    <td className="diagnos fw-bold">  Plastik </td>
                                    <td className="diagnos fw-bold">  O'tkazma </td>
                                    <td className="diagnos fw-bold">  Umumiy </td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                    </td>
                                    <td className="diagnos fw-bold text-primary">  {cash} </td>
                                    <td className="diagnos fw-bold text-warning">  {card} </td>
                                    <td className="diagnos fw-bold text-danger">  {transfer} </td>
                                    <td className="diagnos fw-bold text-success">  {transfer + card + cash} </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
