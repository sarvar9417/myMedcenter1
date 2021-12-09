import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenAlt, faSearch, faSort, faClock, faTimesCircle, faCheck, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import DatePicker from "react-datepicker"
import './tableStyle.css'
import ReactHTMLTableToExcel from 'react-html-to-excel'
import Select from 'react-select'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../context/AuthContext'
import Modal from 'react-modal'
const mongoose = require("mongoose")

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
}

toast.configure()
export const ClientsOnPages = () => {
    const options = [
        { value: 'all', label: 'Barcha' },
        { value: 'kelgan', label: 'kelgan' },
        { value: 'kelmagan', label: 'kelmagan' },
        { value: 'kutilmoqda', label: 'kutilayotgan' }
    ]
    const history = useHistory()
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const payment = ["to'langan", "to'lanmagan", "kutilmoqda"]

    // Modal oyna funksiyalari
    let allPrice = 0
    const [modalIsOpen, setIsOpen] = useState(false)

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

    let unpaid = 0
    let paid = 0
    let k = 0
    let l = 0
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

    const positionUpdate = useCallback(async (id, positionSection) => {
        try {
            const fetch = await request(`/api/section/reseption/${id}`, 'PUT', { position: positionSection }, {
                Authorization: `Bearer ${auth.token}`
            })
            getAllSections()
            getClients()
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

    const searchDate = () => {
        let c = []
        AllSections.map((section) => {
            if (setSortDate(section)) {
                c.push(section)
            }
        })
        setSections(c)
    }

    // Tanlangan Mijoz ma'lumotlarini olib modalga yo'naltirish
    const [sortSections, setSortSections] = useState()
    const [client, setClient] = useState()
    const getSections = (client) => {
        let s = []
        AllSections.map((section) => {
            if (
                section.client === client._id
                &&
                section.bron === "online"
                &&
                new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()
                &&
                section.payment === "kutilmoqda"
                &&
                section.position !== "kelgan"
            ) {
                s.push(section)
            }
        })
        setSortSections(s)
        setClient(client)
        openModal()
    }

    const Confirm = () => {
        sortSections.map((section) => {
            positionUpdate(section._id, "kelgan")
        })
        history.push(`/reseption/reciept/${client._id}/${sortSections[0].connector}`)
    }


    const [counter, setCounter] = useState(true)
    setTimeout(() => {
        if (counter && AllSections.length !== 0) {
            dontCome()
        }
    }, 1)
    const dontCome = () => {
        let year = new Date().getFullYear()
        let month = new Date().getMonth() * 100
        let day = new Date().getDate()
        let n = year + month + day
        AllSections.map((section) => {
            let years = new Date(section.bronDay).getFullYear()
            let months = new Date(section.bronDay).getMonth() * 100
            let days = new Date(section.bronDay).getDate()
            let ns = years + months + days
            if (section.bron === "online" && n > ns) {
                positionUpdate(section._id, "kelmagan")
            }
        })
        setCounter(false)
    }

    //Xatoliklar chiqaruvi
    const notify = (e) => {
        toast.error(e);
    };

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
                    c.push(section)
                }
            })

        })
        setSections(c)
    }

    const setSortDate = (section) => {

        let year = startDate.getFullYear().toString()
        let month = startDate.getMonth().toString() < 10 ? "0" + startDate.getMonth().toString() : startDate.getMonth().toString()
        let day = startDate.getDate().toString() < 10 ? "0" + startDate.getDate().toString() : startDate.getDate().toString()
        let date1 = parseInt(year + month + day)

        year = endDate.getFullYear().toString()
        month = endDate.getMonth().toString() < 10 ? "0" + endDate.getMonth().toString() : endDate.getMonth().toString()
        day = endDate.getDate().toString() < 10 ? "0" + endDate.getDate().toString() : endDate.getDate().toString()
        let date3 = parseInt(year + month + day)

        year = new Date(section.bronDay).getFullYear()
        month = new Date(section.bronDay).getMonth().toString() < 10 ? "0" + new Date(section.bronDay).getMonth().toString() : new Date(section.bronDay).getMonth().toString()
        day = new Date(section.bronDay).getDate().toString() < 10 ? "0" + new Date(section.bronDay).getDate().toString() : new Date(section.bronDay).getDate().toString()

        let date2 = parseInt(year + month + day)
        return (date1 <= date2 && date2 <= date3)
    }

    const sort = (event) => {
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
                if (section.position === event.value && setSortDate(section))
                    c.push(section)
            })
            setSections(c)
        }
    }

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        getClients()
        getAllSections()
    }, [getClients, getAllSections])


    if (loading) {
        return <Loader />
    }

    return (
        <div className="container m-5 text-center mx-auto" style={{minWidth:"1100px"}} onLoad={dontCome}>
            <div className="row mb-3">
                <div className="col-2">
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
                    <Select onChange={(event) => sort(event)} defaultValue={options[0]} options={options} />
                </div>
            </div>
            <div className="row mb-3 mt-3">
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
                                <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Kuni <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="turn text-center">Vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="edit text-center">Tahrirlash <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="position text-center">Holati <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
            <div className="overflow-auto" style={{ height: "60vh", minWidth: "1100px" }}>
                <table className="table-hover"  >
                    <thead className="d-none">
                        <tr>
                            <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                            <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="date text-center" >Kuni <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="turn text-center">Vaqti <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="edit text-center">Tahrirlash <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                            <th scope="" className="position text-center">Holati <FontAwesomeIcon icon={faSort} /></th>
                        </tr>
                    </thead>
                    <tbody className="" >
                        {
                            sections.map((section, key) => {
                                return AllClients.map((client, index) => {
                                    if (client._id === section.client && section.bron === "online") {
                                        k++
                                        return (
                                            <tr key={key} id={index} >
                                                <td className="no" >{k}</td>
                                                <td className="fish text-uppercase" ><Link style={{ fontWeight: "600" }} to={`/reseption/clientallhistory/${client._id}`} > {client.lastname} {client.firstname} {client.fathername} </Link></td>
                                                <td className="id" >{client.id}</td>
                                                <td className="date text-center" >{new Date(section.bronDay).toLocaleDateString()}</td>
                                                <td className="turn">{section.bronTime}</td>
                                                <td className="phone">+{client.phone}</td>
                                                <td className="section text-uppercase"> <Link to={`/reseption/clienthistory/${section._id}`} style={{ color: "#00aa00", fontWeight: "600" }}> {section.name} </Link></td>
                                                <td className="edit"> <Link to={`/reseption/edit/${client._id}`} > <FontAwesomeIcon icon={faPenAlt} className="text-dark" /> </Link>  </td>
                                                <td className={
                                                    payment.map((pay, key) => {
                                                        if (pay === "to'langan" && section.payment === "to'langan") {
                                                            return " text-success prices text-center"
                                                        }
                                                        if (pay === "to'lanmagan" && section.payment === "to'lanmagan") {
                                                            return " text-danger prices text-center"
                                                        }
                                                        if (pay === "kutilmoqda" && section.payment === "kutilmoqda") {
                                                            return (" text-warning prices text-center")
                                                        }
                                                    })
                                                } >
                                                    {
                                                        payment.map((pay, key) => {
                                                            if (pay === "to'langan" && section.payment === "to'langan") {
                                                                return (<FontAwesomeIcon icon={faCheck} />)
                                                            }
                                                            if (pay === "to'lanmagan" && section.payment === "to'lanmagan") {
                                                                return (<FontAwesomeIcon icon={faTimesCircle} />)
                                                            }
                                                            if (pay === "kutilmoqda" && section.payment === "kutilmoqda") {
                                                                return (<FontAwesomeIcon icon={faClock} />)
                                                            }
                                                        })
                                                    }
                                                </td>
                                                <td className="position text-center" >
                                                    {
                                                        section.position === "kutilmoqda" ?
                                                            <>
                                                                <button onClick={() => { getSections(client) }} className="btn come mx-1" >Qabul qilish</button>
                                                                <button onClick={() => positionUpdate(section._id, "kelmagan")} className="btn dontcome" >Rad etish</button>
                                                            </> :
                                                            section.position
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    }
                                })

                            })
                        }
                    </tbody>
                </table>
            </div>

            {/* Modal oynaning ochilishi */}
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
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
                                sortSections && sortSections.map((section, key) => {
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
                        `            <div className="col-12 text-center">
                            <button onClick={Confirm} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                            <button onClick={closeModal} className="btn btn-danger" >Qaytish</button>
                        </div>
                    </div>

                </Modal>
            </div>


            {/* ========================================================== */}
            {/* ========================================================== */}
            {/* ========================================================== */}
            {/* ========================== EXCEL ========================= */}
            <table id="reseptionReport" className="table-hover d-none"  >
                <thead className="d-none">
                    <tr>
                        <th className="no" scope="" >№ <FontAwesomeIcon icon={faSort} /> </th>
                        <th scope="" className="fish text-center">F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="date text-center" >Kuni <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="turn text-center">Vaqti <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="section text-center">Bo'limi <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="prices text-center">To'lov <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="prices text-center">To'langan <FontAwesomeIcon icon={faSort} /></th>
                        <th scope="" className="position text-center">Holati <FontAwesomeIcon icon={faSort} /></th>
                    </tr>
                </thead>
                <tbody className="" >

                    {
                        sections.map((section, key) => {
                            return AllClients.map((client, index) => {
                                if (client._id === section.client && section.bron === "online") {
                                    l++
                                    paid = paid + section.priceCashier
                                    unpaid = unpaid + (section.price + section.priceCashier)
                                    return (
                                        <tr key={key} id={index} >
                                            <td className="no" >{l}</td>
                                            <td className="fish text-uppercase" > {client.lastname} {client.firstname} {client.fathername}</td>
                                            <td className="id" >{client.id}</td>
                                            <td className="date text-center" >{new Date(section.bronDay).toLocaleDateString()}</td>
                                            <td className="turn">{section.bronTime}</td>
                                            <td className="phone">+{client.phone}</td>
                                            <td className="section text-uppercase"> {section.name} </td>
                                            <td  >
                                                {
                                                    section.price
                                                }
                                            </td>
                                            <td className="position" >
                                                {
                                                    section.priceCashier
                                                }
                                            </td>
                                            <td className="position" >
                                                {
                                                    section.position
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            })

                        })
                    }
                </tbody>
                <footer className="d-none">
                    <tr>
                        <th className="no" scope="" >Jami </th>
                        <th scope="" className="fish text-center"></th>
                        <th scope="" className="id text-center"></th>
                        <th scope="" className="date text-center" ></th>
                        <th scope="" className="turn text-center"></th>
                        <th scope="" className="phone text-center"></th>
                        <th scope="" className="section text-center"></th>
                        <th scope="" className="prices text-center"> {unpaid + paid} </th>
                        <th scope="" className="prices text-center"> {paid} </th>
                        <th scope="" className="position text-center">  </th>
                    </tr>
                </footer>
            </table>

        </div>
    )
}
