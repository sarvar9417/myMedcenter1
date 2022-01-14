import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from './../../components/Loader'
import { useHttp } from './../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSort, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from './../../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const CallCenterClientsPages = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const [type, setType] = useState("all")
    const options = [
        { value: 'all', label: 'Barcha' },
        { value: 'Javobsiz', label: 'javobsiz' },
        { value: "Qayta qo'ng'iroq", label: "qayta qo'ng'iroq" },
        { value: "Qiziqmadi", label: 'qiziqmadi' },
        { value: "O'ylab ko'radi", label: "o'ylab ko'radi" },
        { value: "Kelmoqchi", label: 'kelmoqchi' },
        { value: "Kelgan", label: 'kelgan' }
    ]

    let k = 0
    let kk = 0
    const notify = (e) => {
        toast.error(e);
    }
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const { loading, request, error, clearError } = useHttp()

    const [all, setAll] = useState()
    const getCalls = useCallback(async () => {
        try {
            const fetch = await request(`/api/callcenter/reseption/${startDate}/${endDate}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(fetch)
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, startDate, endDate, setAll])


    const [clientId, setClientId] = useState('')
    const getId = useCallback(async () => {
        try {
            const fetch = await request(`/api/callcenter/call/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId, setAll])

    const getBorn = useCallback(async () => {
        try {
            const fetch = await request(`/api/callcenter/callborn/${born}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAll(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, born, setAll])

    const searchDate = () => {
        getCalls()
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

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (!all) {
            getCalls()
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }

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
                    <table id="" className=" table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="date text-center" >Qo'ng'roq vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish-call text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className=" text-center">Holati <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="illness text-center">Shikoyat yoki izoh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="voucher text-center"> Yo'llanma <FontAwesomeIcon icon={faSort} /></th>
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
                            <th scope="" className="date text-center" >Qo'ng'roq vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="date text-center" >Tug'ilgan sanasi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="section text-center">Holati <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="edit text-center">Shikoyat yoki izoh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center"> Yo'llanma <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {all && all.calls.map((call, key) => {
                            if (type === "all") {
                                kk++
                                return (
                                    <tr key={key} >
                                        <td className="no" >{kk}</td>
                                        <td className="date" >{new mongoose.Types.ObjectId(all.clients[key]._id).getTimestamp().toLocaleDateString()}{new mongoose.Types.ObjectId(call._id).getTimestamp().toLocaleTimeString()}</td>
                                        <td className="fish text-uppercase" >{all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}</td>
                                        <td className="date" >{new Date(all.clients[key].born).toLocaleDateString()}</td>
                                        <td className="id" >{all.clients[key].id}</td>
                                        <td className="phone">+{all.clients[key].phone}</td>
                                        <td className="call text-uppercase">  {call.position} </td>
                                        <td scope="" className="edit text-center">{call.illness}</td>
                                        <td scope="" className="edit text-center">{call.vouncher}</td>
                                    </tr>
                                )
                            } else {
                                if (type === call.position) {
                                    kk++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{kk}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(all.clients[key]._id).getTimestamp().toLocaleDateString()}{new mongoose.Types.ObjectId(call._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish text-uppercase" >{all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}</td>
                                            <td className="date" >{new Date(all.clients[key].born).toLocaleDateString()}</td>
                                            <td className="id" >{all.clients[key].id}</td>
                                            <td className="phone">+{all.clients[key].phone}</td>
                                            <td className="call text-uppercase">  {call.position} </td>
                                            <td scope="" className="edit text-center">{call.illness}</td>
                                            <td scope="" className="edit text-center">{call.vouncher}</td>
                                        </tr>
                                    )
                                }
                            }
                        }
                        )}
                    </tbody>
                </table>
            </div>

            <div className="overflow-auto" style={{ height: "60vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {all && all.calls.map((call, key) => {
                            if (type === "all") {
                                k++
                                return (
                                    <tr key={key} >
                                        <td className="no text-center" >{k}</td>
                                        <td className="date text-center" >{new mongoose.Types.ObjectId(call._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(call._id).getTimestamp().toLocaleTimeString()}</td>
                                        <td className="fish-call text-uppercase fw-bolder" ><Link className='text-success' to={`/callcenter/edit/${call._id}`} >{all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}</Link> </td>
                                        <td className="date text-center" >{new Date(all.clients[key].born).toLocaleDateString()}</td>
                                        <td className="id" >{all.clients[key].id}</td>
                                        <td className="phone">+{all.clients[key].phone}</td>
                                        <td className=" text-center text-success fw-normal"><Link className={call.position === "Javobsiz" ? "text-danger" : (call.position === "Qayta qo'ng'iroq" ? "text-warning" : (call.position === "Qiziqmadi" ? "text-primary" : (call.position === "O'ylab ko'radi" ? "text-info" : (call.position === "O'ylab ko'radi" ? "text-secondary" : "text-success"))))} to={`/callcenter/edit/${call._id}`} >  {call.position}</Link> </td>
                                        <td className="illness text-center">{call.illness}</td>
                                        <td className="voucher text-center">{call.vouncher}</td>
                                    </tr>
                                )
                            } else {
                                if (type === call.position) {
                                    k++
                                    return (
                                        <tr key={key} >
                                            <td className="no text-center" >{k}</td>
                                            <td className="date text-center" >{new mongoose.Types.ObjectId(call._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(call._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish-call text-uppercase fw-bolder" ><Link className='text-success' to={`/callcenter/edit/${call._id}`} >{all.clients[key].lastname} {all.clients[key].firstname} {all.clients[key].fathername}</Link> </td>
                                            <td className="date text-center" >{new Date(all.clients[key].born).toLocaleDateString()}</td>
                                            <td className="id" >{all.clients[key].id}</td>
                                            <td className="phone">+{all.clients[key].phone}</td>
                                            <td className=" text-center text-success fw-normal"><Link className={call.position === "Javobsiz" ? "text-danger" : (call.position === "Qayta qo'ng'iroq" ? "text-warning" : (call.position === "Qiziqmadi" ? "text-primary" : (call.position === "O'ylab ko'radi" ? "text-info" : (call.position === "O'ylab ko'radi" ? "text-secondary" : "text-success"))))} to={`/callcenter/edit/${call._id}`} >  {call.position}</Link> </td>
                                            <td className="illness text-center">{call.illness}</td>
                                            <td className="voucher text-center">{call.vouncher}</td>
                                        </tr>
                                    )
                                }
                            }
                        }
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
