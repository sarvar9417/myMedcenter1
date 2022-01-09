import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Loader } from './../components/Loader'
import { AuthContext } from './../context/AuthContext'
import { useHttp } from './../hooks/http.hook'
import QRCode from 'qrcode'
import { toast } from 'react-toastify'

toast.configure()
export const RecieptStatsionar = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const oneDay = 1000 * 60 * 60 * 24
    const [bronDay, setBronDay] = useState()

    const [qr, setQr] = useState()
    const clientId = useParams().id
    const connectorId = useParams().connector
    const today = (new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString())
    const [sections, setSections] = useState()
    let price = 0
    let k = 0
    let l = 0
    const [client, setClient] = useState()

    // =================================================================================
    // =================================================================================
    // Servislar bo'limi
    const [services, setServices] = useState()
    const getServices = useCallback(async () => {
        try {
            const data = await request(`/api/service/reseption/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let c = []
            data.map((service) => {
                let k = true
                c.map((s) => {
                    if (service.name === s.name && service.type === s.subname) {
                        k = false
                        s.pieces = s.pieces + service.pieces
                        s.price = s.price + service.price
                    }
                })
                if (k) {
                    c.push({
                        name: service.name,
                        subname: service.type,
                        pieces: service.pieces,
                        priceone: service.priceone,
                        price: service.price
                    })
                }
            })
            setServices(c)
        } catch (e) {
        }
    }, [request, connectorId, auth, setServices])
    // =================================================================================
    // =================================================================================


    // =================================================================================
    // =================================================================================
    // ROOMS bo'limi
    const [room, setRoom] = useState()
    const getRoom = useCallback(async () => {
        try {
            const data = await request(`/api/usedroom/reseption/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            if (data.position === "band") {
                setBronDay(Math.abs((new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()) - new Date(new Date(data.beginDay).getFullYear(), new Date(data.beginDay).getMonth() + 1, new Date(data.beginDay).getDate())) / oneDay))
            } else {
                setBronDay(Math.abs((new Date(new Date(data.beginDay).getFullYear(), new Date(data.beginDay).getMonth() + 1, new Date(data.endDay).getDate()) - new Date(new Date(data.beginDay).getFullYear(), new Date(data.beginDay).getMonth() + 1, new Date(data.beginDay).getDate())) / oneDay))
            }
            console.log(data)
            setRoom(data)
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setRoom, oneDay, setBronDay])
    // =================================================================================
    // =================================================================================

    // =================================================================================
    // =================================================================================
    // CONNECTOR bo'limi
    const [connector, setConnector] = useState()
    const getConnector = useCallback(async () => {
        try {
            const data = await request(`/api/connector/statsionarid/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setConnector(data)
        } catch (e) {
        }
    }, [request, connectorId, auth, setConnector])
    // =================================================================================
    // =================================================================================

    // =================================================================================
    // =================================================================================
    // SECTIONS bo'limi
    const getSections = useCallback(async () => {
        try {
            const data = await request(`/api/section/reseptionid/${clientId}/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let c = []
            data.map((section) => {
                let k = true
                c.map((s) => {
                    if (section.name === s.name && section.subname === s.subname) {
                        k = false
                        s.pieces = s.pieces + 1
                        s.price = s.price + section.price
                    }
                })
                if (k) {
                    c.push({
                        name: section.name,
                        subname: section.subname,
                        pieces: 1,
                        priceone: section.price,
                        price: section.price
                    })
                }
            })
            setSections(c)
        } catch (e) {
        }
    }, [request, setSections, auth, clientId, connectorId])
    // =================================================================================
    // =================================================================================

    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clients/reseption/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(data)
        } catch (e) {
        }
    }, [request, clientId, auth, setClient])

    const notify = (e) => {
        toast.error(e)
    }

    const [baseUrl, setBaseUrl] = useState()
    const getBaseUrl = useCallback(async () => {
        try {
            const fetch = await request(`/api/clienthistorys/url`, 'GET', null)
            setBaseUrl(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, setBaseUrl])

    const [logo, setLogo] = useState()
    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null)
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [request, setLogo])

    const [t, setT] = useState()
    useEffect(() => {
        if (client) {
            QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`)
                .then(data => {
                    setQr(data)
                })
        }
        if (!client) {
            getClient()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!logo) {
            getLogo()
        }
        if (!baseUrl) {
            getBaseUrl()
        }
        if (!sections) {
            getSections()
        }
        if (!services) {
            getServices()
        }
        if (!t) {
            getRoom()
            setT(1)
        }
        if (!connector) {
            getConnector()
        }

    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }


    return (
        <div>
            <div ref={componentRef}>
                <div className="container p-3" >
                    <div className="row"  >
                        <table className="table ">
                            <tbody>
                                <tr>
                                    <td>
                                        <ul className="list-unstyled  text-start m-3">
                                            <li className="" style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }} > {logo && logo.companyname}</strong></li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Manzil: </strong> {logo && logo.address}</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Bank: </strong> {logo && logo.bank}</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}> <strong style={{ fontSize: "10pt", fontFamily: "times" }}>MFO: </strong> {logo && logo.mfo}</li>
                                            <li style={{ fontFamily: "times" }}> <h5 style={{ textAlign: "", fontSize: "10pt" }}> {today}</h5> </li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>INN:</strong> {logo && logo.inn}</li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Hisob raqam: </strong> {logo && logo.accountnumber}</li>
                                            <li style={{ textAlign: "", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Telefon raqam: </strong>
                                                {logo && logo.phone1 !== null ? "+" + logo.phone1 : ""} <br />
                                                {logo && logo.phone2 !== null ? "+" + logo.phone2 : ""} <br />
                                                {logo && logo.phone3 !== null ? "+" + logo.phone3 : ""} <br /></li>
                                        </ul>
                                    </td>
                                    <td className="text-end">
                                        <img className='me-3' width="150" src={logo && logo.logo} alt="logo" /><br />
                                        <img width="140" className='me-3' src={qr && qr} alt="QR" /><br />
                                        <p className="pe-3 me-1" style={{ fontSize: "10pt" }}>Bu yerni skanerlang</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row" id='statsionar'>
                        <div className="col-lg-12">
                            <div className="invoice-from">
                                <table className='table table-bordered' style={{ fontSize: "10pt", fontFamily: "times" }}>
                                    <thead >
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Mijoz F.I.SH</td>
                                            <td className='w-75 p-1 px-3'>{client && client.lastname + " " + client.firstname + " " + client.fathername} </td>
                                        </tr>
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Tug'ilgan yili</td>
                                            <td className='w-75 p-1 px-3'>{client && new Date(client.born).toLocaleDateString()} </td>
                                        </tr>
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Telefon raqami</td>
                                            <td className='w-75 p-1 px-3'>{client && "+" + client.phone} </td>
                                        </tr>
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Manzili</td>
                                            <td className='w-75 p-1 px-3'>{client && client.address} </td>
                                        </tr>
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Kelgan vaqti</td>
                                            <td className='w-75 p-1 px-3'>{room && new Date(room.beginDay).toLocaleDateString()} </td>
                                        </tr>
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Ketgan vaqti</td>
                                            <td className='w-75 p-1 px-3'>{connector && connector.position === "davolanishda" ? "davolanishda" : room && new Date(room.endDay).toLocaleDateString()} </td>
                                        </tr>
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Oldindan to'lov</td>
                                            <td className='w-75 p-1 px-3'>{connector && connector.prepaymentCashier} </td>
                                        </tr>
                                        <tr>
                                            <td className='w-25 p-1 text-start px-3'>Tashxiz</td>
                                            <td className='w-75 p-1 px-3'>{connector && connector.diagnosis} </td>
                                        </tr>
                                    </thead>
                                </table>

                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="table-responsive" style={{ overflow: "hidden", outline: "none" }} tabindex="0">
                                <table className="table table-bordered" style={{ fontSize: "10pt", fontFamily: "times" }}>
                                    <thead>
                                        <tr>
                                            <td className="text-center" >№</td>
                                            <td className="text-center" >Xizmat turi</td>
                                            <td className="text-center" >Miqdori (dona)</td>
                                            <td className="text-center" >Narxi (1 dona)</td>
                                            <td className="text-center" >Narxi (umumiy)</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sections && sections.map((section) => {
                                                k++
                                                price = price + section.price
                                                return (<tr>
                                                    <td >{k}</td>
                                                    <td className="text-start px-2">{section.name} {section.subname}</td>
                                                    <td className="text-center">{section.pieces}</td>
                                                    <td className="text-center">{section.priceone}</td>
                                                    <td className="text-center">{section.price}</td>
                                                </tr>
                                                )
                                            })
                                        }
                                        {
                                            services && services.map((service) => {
                                                k++
                                                price = price + service.price
                                                return (<tr>
                                                    <td >{k}</td>
                                                    <td className="text-start px-2">{service.name} {service.subname}</td>
                                                    <td className="text-center">{service.pieces}</td>
                                                    <td className="text-center">{service.priceone}</td>
                                                    <td className="text-center">{service.price}</td>
                                                </tr>
                                                )
                                            })
                                        }{

                                            <tr>
                                                <td >{++k}</td>
                                                <td className="text-start px-2">{room && room.roomname}</td>
                                                <td className="text-center">{bronDay && bronDay}</td>
                                                <td className="text-center">{room && room.price}</td>
                                                <td className="text-center">{room && bronDay && (room.price * bronDay)}</td>
                                            </tr>
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td className="text-right px-3" colSpan="4">Jami to'lov:</td>
                                            <td className="text-center">{room && bronDay && price + bronDay * room.price}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <h6 className="mt-3" style={{ fontSize: "10pt", fontFamily: "times" }}>Kassir: </h6>
                            <hr />
                            <h6 className="mt-3" style={{ fontSize: "10pt", fontFamily: "times" }}>Mijoz: {client && client.lastname + " " + client.firstname + " " + client.fathername}</h6>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center w-100" style={{ position: "fixed", bottom: "20px" }} >
                <button onClick={handlePrint} className="btn btn-primary px-5" >
                    Print
                </button>
            </div>
        </div >
    )
}
