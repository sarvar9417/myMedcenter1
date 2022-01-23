import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { toast } from 'react-toastify'
import QRCode from 'qrcode'

toast.configure()
export const Reciept = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const clientId = useParams().id
    const connectorId = useParams().connector
    const today = (new Date().getDate().toString() + "." + (new Date().getMonth() + 1).toString() + "." + new Date().getFullYear().toString() + " " + new Date().getHours().toString() + ":" + new Date().getMinutes().toString() + ":" + new Date().getSeconds().toString())

    let unpaid = 0
    let paid = 0
    let price = 0
    let k = 0
    let l = 0
    const [client, setClient] = useState()
    const { loading, request, error, clearError } = useHttp()
    const [sections, setSections] = useState()
    //================================================================================
    //================================================================================
    //================================================================================
    //Xonalarni olish
    const [allSections, setAllSections] = useState()
    const getAllSections = useCallback(async () => {
        try {
            const data = await request("/api/direction/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(data)
            setAllSections(data)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setAllSections])

    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clients/reseption/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(data)
        } catch (e) {
        }
    }, [request, clientId, auth])

    const notify = (e) => {
        toast.error(e)
    }

    const [baseUrl, setBasuUrl] = useState()
    const getBaseUrl = useCallback(async () => {
        try {
            const fetch = await request(`/api/clienthistorys/url`, 'GET', null)
            setBasuUrl(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, setBasuUrl])

    const [logo, setLogo] = useState()
    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null)
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [request, setLogo])

    // =================================================================================
    // =================================================================================
    // Servislar bo'limi
    const [services, setServices] = useState()
    const getServices = useCallback(async () => {
        try {
            const data = await request(`/api/service/reseption/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setServices(data)
        } catch (e) {
        }
    }, [request, connectorId, auth, setServices])
    // =================================================================================
    // =================================================================================


    const getSections = useCallback(async () => {
        try {
            const data = await request(`/api/section/reseptionid/${clientId}/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSections(data)
        } catch (e) {
        }
    }, [request, clientId, auth])

    const [qr, setQr] = useState()
    useEffect(() => {
        if (client) {
            QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`)
                .then(data => {
                    setQr(data)
                })
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!client) {
            getClient()
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
        if (!allSections) {
            getAllSections()
        }
    }, [error, clearError])

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
                    <div className="row">
                        <div className="col-4">
                            <h6 style={{ textTransform: "uppercase", fontFamily: "times", fontSize: "15pt", paddingRight: "10px" }} >ID: {client && client.id}</h6>
                                
                        </div>
                        <div className="col-4 ">
                            <h6 style={{ fontSize: "15pt", fontFamily: "times", textAlign:"center" }}>F.I.O: {client && client.lastname} {client && client.firstname} {client && client.fathername}</h6>
                        </div>
                        <div className="col-4">
                            <h6 style={{ fontSize: "15pt", fontFamily: "times", textAlign:"end", paddingRight:"10px" }}>Tug'ilgan yil: {client && new Date(client.born).toLocaleDateString()}</h6>
                        </div>
                        <div className="col-lg-12">
                            <div className="table-responsive" style={{ overflow: "hidden", outline: "none" }} tabindex="0">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>№</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Bo'lim</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Navbat</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Xona</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sections && sections.map((section) => {
                                                paid = paid + section.priceCashier
                                                section.payment === "to'lanmagan" ? unpaid = unpaid : unpaid = unpaid + (section.price - section.priceCashier)
                                                k++
                                                price = price + (section.price - section.priceCashier)
                                                return (<tr>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }}>{k}</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="ps-3">{section.name} {section.subname}</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.bron === 'offline' ? section.turn : section.bronTime}</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{allSections && allSections.map((sec) => {
                                                        if (section.name === sec.section && section.subname === sec.subsection) {
                                                            return sec.room
                                                        }
                                                    })}</td>
                                                </tr>
                                                )

                                            })

                                        }
                                        {
                                            services && services.map((service, index) => {
                                                paid = paid + service.priceCashier
                                                service.payment === "to'lanmagan" ? unpaid = unpaid : unpaid = unpaid + (service.price - service.priceCashier)
                                                k++
                                                price = price + (service.price - service.priceCashier)
                                                return (<tr>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }}>{index + 1}</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="ps-3">{service.name} {service.type}</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{service.pieces} (dona)</td>
                                                    <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center"></td>
                                                </tr>
                                                )
                                            })
                                        }


                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan="3" style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right m-0 p-0 px-3">Jami to'lov:</th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center m-0 p-0">{unpaid + paid}</th>
                                        </tr>
                                        <tr>
                                            <th colSpan="3"  style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right m-0 p-0 px-3">To'langan:</th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center m-0 p-0">{paid}</th>
                                        </tr>
                                        <tr>
                                            <th colSpan="3"  style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right m-0 p-0 px-3">To'lanmagan:</th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center m-0 p-0">{unpaid}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <h6 className="mt-3" style={{ fontSize: "10pt", fontFamily: "times" }}>Kassir: </h6>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
            <div className="" style={{ position: "fixed", bottom: "20px", width: "100%" }} >
                <div className="row">
                    <div className=" col-12 text-center">
                        <button onClick={handlePrint} className="btn btn-primary px-5" >
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
