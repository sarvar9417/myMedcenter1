import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faPrint, faClock, faCheck, faSyncAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import './tableStyle.css'
import Select from 'react-select'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const ClientsPages = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const payment = ["to'langan", "to'lanmagan", "kutilmoqda"]

    const options = [
        { value: 'all', label: 'Barcha' },
        { value: 'offline', label: 'Offline' },
        { value: 'online', label: 'Online' }
    ]

    let paid = 0
    let unpaid = 0
    let k = 0
    let kk = 0
    let position = "all"
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [born, setBorn] = useState('')
    const { loading, request, error, clearError } = useHttp()
    const [sections, setSections] = useState([])
    const [AllSections, setAllSections] = useState([])
    const [AllClients, setAllClients] = useState([])
    const [clientId, setClientId] = useState('')

    const getClients = useCallback(async () => {
        try {
            const fetch = await request('/api/clients/reseption', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAllClients(fetch)
        } catch (e) {

        }
    }, [request, auth])

    const getAllSections = useCallback(async () => {
        try {
            const fetch = await request('/api/section/reseption', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAllSections(fetch)
            setSections(fetch)
        } catch (e) {

        }
    }, [request, auth])

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        getClients()
        getAllSections()
    }, [getClients, getAllSections])

    const notify = (e) => {
        toast.error(e);
    };

    const searchDate = () => {
        let c = []
        AllSections.map((section) => {
            if (setSortDate(section) && position) {
                c.push(section)
            }
        })
        setSections(c)
    }

    const sortOnOff = (event) => {
        position = event.value
        let c = []
        if (event.value === "all") {
            AllSections.map((section) => {
                if (setSortDate(section)) {
                    c.push(section)
                }
            })
            setSections(c)
        } else {
            AllSections.map((section) => {
                if (section.bron === event.value && setSortDate(section))
                    c.push(section)
            })
            setSections(c)
        }
    }

    const searchId = () => {
        let c = []
        AllSections.map((section) => {
            AllClients.map((client) => {
                if (client.id === clientId && section.client === client._id) {
                    c.push(section)
                }
            })
        })
        setSections(c)
    }

    const searchBornDate = () => {
        let c = []
        AllSections.map((section) => {
            AllClients.map((client) => {
                let year = born.getFullYear().toString()
                let month = born.getMonth().toString() < 10 ? "0" + born.getMonth().toString() : born.getMonth().toString()
                let day = born.getDate().toString() < 10 ? "0" + born.getDate().toString() : born.getDate().toString()
                let date1 = parseInt(year + month + day)

                year = new Date(client.born).getFullYear().toString()
                month = new Date(client.born).getMonth().toString() < 10 ? "0" + new Date(client.born).getMonth().toString() : new Date(client.born).getMonth().toString()
                day = new Date(client.born).getDate().toString() < 10 ? "0" + new Date(client.born).getDate().toString() : new Date(client.born).getDate().toString()
                let date2 = parseInt(year + month + day)
                if (date1 === date2 && section.client === client._id) {
                    console.log(date1);
                    c.push(section)
                }
            })

        })
        setSections(c)
    }

    const setSortDate = (section) => {

        if (section.bron === 'offline') {
            let year = startDate.getFullYear().toString()
            let month = startDate.getMonth().toString() < 10 ? "0" + startDate.getMonth().toString() : startDate.getMonth().toString()
            let day = startDate.getDate().toString() < 10 ? "0" + startDate.getDate().toString() : startDate.getDate().toString()
            let date1 = parseInt(year + month + day)

            year = endDate.getFullYear().toString()
            month = endDate.getMonth().toString() < 10 ? "0" + endDate.getMonth().toString() : endDate.getMonth().toString()
            day = endDate.getDate().toString() < 10 ? "0" + endDate.getDate().toString() : endDate.getDate().toString()
            let date3 = parseInt(year + month + day)

            year = new mongoose.Types.ObjectId(section._id).getTimestamp().getFullYear().toString()
            month = new mongoose.Types.ObjectId(section._id).getTimestamp().getMonth().toString() < 10 ? "0" + new mongoose.Types.ObjectId(section._id).getTimestamp().getMonth().toString() : new mongoose.Types.ObjectId(section._id).getTimestamp().getMonth().toString()
            day = new mongoose.Types.ObjectId(section._id).getTimestamp().getDate().toString() < 10 ? "0" + new mongoose.Types.ObjectId(section._id).getTimestamp().getDate().toString() : new mongoose.Types.ObjectId(section._id).getTimestamp().getDate().toString()
            let date2 = parseInt(year + month + day)
            return (date1 <= date2 && date2 <= date3)
        } else {
            let year = startDate.getFullYear().toString()
            let month = startDate.getMonth().toString() < 10 ? "0" + startDate.getMonth().toString() : startDate.getMonth().toString()
            let day = startDate.getDate().toString() < 10 ? "0" + startDate.getDate().toString() : startDate.getDate().toString()
            let date1 = parseInt(year + month + day)

            year = endDate.getFullYear().toString()
            month = endDate.getMonth().toString() < 10 ? "0" + endDate.getMonth().toString() : endDate.getMonth().toString()
            day = endDate.getDate().toString() < 10 ? "0" + endDate.getDate().toString() : endDate.getDate().toString()
            let date3 = parseInt(year + month + day)

            year = new Date(section.bronDay).getFullYear().toString()
            month = new Date(section.bronDay).getMonth().toString() < 10 ? "0" + new Date(section.bronDay).getMonth().toString() : new Date(section.bronDay).getMonth().toString()
            day = new Date(section.bronDay).getDate().toString() < 10 ? "0" + new Date(section.bronDay).getDate().toString() : new Date(section.bronDay).getDate().toString()
            let date2 = parseInt(year + month + day)
            return (date1 <= date2 && date2 <= date3)
        }

    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container m-5 mx-auto" style={{minWidth:"1250px"}}  >
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
                <div className="offset-10 col-1 text-end">
                    <ReactHTMLTableToExcel
                        className="btn text-white mb-2 btn-success"
                        table="reseptionReport"
                        filename={new Date().toLocaleDateString()}
                        sheet="Sheet"
                        buttonText="Excel"
                    />
                </div>
                <div className=" col-1 text-end">
                    <button onClick={() => setSections(AllSections)} className="btn text-white" style={{ backgroundColor: "#45D3D3" }} ><FontAwesomeIcon icon={faSyncAlt} /> </button>
                </div>

            </div>
            <div>
                <div style={{ minWidth: "1100px" }} >
                    <table id="" className="table-striped table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="turn text-center">Navbati <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="edit text-center">Tahrirlash <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center"> Chek <FontAwesomeIcon icon={faSort} /></th>
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
                            <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="turn text-center">Navbati <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">Qarz <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {sections.map((section, key) => {
                            return AllClients.map(client => {
                                if (client._id === section.client) {
                                    paid = paid + section.priceCashier
                                    unpaid = unpaid + ( section.price - section.priceCashier)
                                    kk++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{kk}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish text-uppercase" >{client.lastname} {client.firstname} {client.fathername}</td>
                                            <td className="id" >{client.id}</td>
                                            <td className="turn">{section.bron === "offline" ? section.turn :  section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                            <td className="phone">+{client.phone}</td>
                                            <td className="section text-uppercase">  {section.name} </td>
                                            <td >{section.price}</td>
                                            <td >{section.priceCashier}</td>
                                            <td >{section.price - section.priceCashier}</td>
                                        </tr>
                                    )
                                }
                            })

                        }
                        )}
                    </tbody>
                    <tfooter className=" ">
                        <tr>
                            <th className="no" scope="" > Jami </th>
                            <th scope="" className="date text-center" > </th>
                            <th scope="" className="fish text-center"> </th>
                            <th scope="" className="id text-center"> </th>
                            <th scope="" className="turn text-center"> </th>
                            <th scope="" className="phone text-center"> </th>
                            <th scope="" className="section text-center"> </th>
                            <th scope="" className="prices text-center"> {unpaid+paid}</th>
                            <th scope="" className="prices text-center"> {paid}</th>
                            <th scope="" className="prices text-center">{unpaid}</th>
                        </tr>
                    </tfooter>

                </table>
            </div>

            <div className="overflow-auto" style={{ height: "65vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {sections.map((section, key) => {
                            return AllClients.map(client => {
                                if (client._id === section.client) {
                                    k++
                                    return (
                                        <tr key={key} >
                                            <td className="no" >{k}</td>
                                            <td className="date" >{new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleTimeString()}</td>
                                            <td className="fish text-uppercase" ><Link style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${client._id}`} > {client.lastname} {client.firstname} {client.fathername} </Link></td>
                                            <td className="id" >{client.id}</td>
                                            <td className="turn">{section.bron === "offline" ? section.turn : section.bronTime + " " + new Date(section.bronDay).toLocaleDateString()}</td>
                                            <td className="phone">+{client.phone}</td>
                                            <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} style={{ color: "#00aa00", fontWeight: "600" }} > {section.name} </Link></td>
                                            <td className="edit"> <Link to={`/reseption/edit/${client._id}`} > <FontAwesomeIcon icon={faPenAlt} className="text-dark" /> </Link>  </td>
                                            <td className="prices fw-bold" >{section.price}</td>
                                            <td className="prices fw-bold text-success" >{section.priceCashier}</td>
                                            <td className="cek"> <Link to={`/reseption/reciept/${client._id}/${section.connector}`} > <FontAwesomeIcon icon={faPrint} className="fa-2x" /> </Link>  </td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    )
}
