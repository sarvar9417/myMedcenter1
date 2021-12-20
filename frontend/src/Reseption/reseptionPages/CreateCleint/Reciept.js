import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Loader } from '../../components/Loader'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import QRCode from 'qrcode'
import { toast } from 'react-toastify'

toast.configure()
export const Reciept = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const { loading, request, error, clearError } = useHttp()
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })

    const [qr, setQr] = useState()
    const clientId = useParams().id
    const connectorId = useParams().connector
    const today = (new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString())
    const [sections, setSections] = useState([])
    let price = 0
    let k = 0
    let l = 0
    const [client, setClient] = useState()

    const getSections = useCallback(async () => {
        try {
            const data = await request(`/api/section/reseptionid/${clientId}/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSections(data)
        } catch (e) {
        }
    }, [request, clientId, auth])

    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clients/reseption/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(data)
        } catch (e) {
        }
    }, [request, clientId, auth])

    useEffect(() => {

        if (sections.length === 0) {
            getSections()
        }

    }, [getSections, sections])

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

    }, [getClient, client, notify, clearError])

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
                        <div className="col-lg-12">
                            <div className="invoice-from">
                                <h6 style={{ textTransform: "uppercase", fontFamily: "times", fontSize: "17pt" }} >ID: {client && client.id}</h6>
                                <h6 style={{ fontSize: "12pt", fontFamily: "times" }}>F.I.O: {client && client.lastname} {client && client.firstname} {client && client.fathername}</h6>
                                {/* <h6>Maqsad: {client.intact}</h6> */}
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="table-responsive" style={{ overflow: "hidden", outline: "none" }} tabindex="0">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>№</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Bo'lim</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Navbat</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>To'lov miqdori</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sections && sections.map((section) => {

                                                if (
                                                    section.payment === 'kutilmoqda' && section.position !== "kelmagan"
                                                ) {
                                                    k++
                                                    price = price + (section.price - section.priceCashier)
                                                    return (<tr>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }}>{k}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-start px-2">{section.name} {section.subname}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.bron === 'offline' ? section.turn : section.bronTime}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.price - section.priceCashier}</td>
                                                    </tr>
                                                    )
                                                }
                                            })

                                        }


                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right"></th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right"></th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right">Jami to'lov:</th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{price}</th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <h6 className="mt-3" style={{ fontSize: "10pt", fontFamily: "times" }}>Kassir: </h6>
                            <hr />
                        </div>
                    </div>
                </div>
                <div style={{ border: "2px dashed black" }} ></div>
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
                        <div className="col-lg-12">
                            <div className="invoice-from">
                                <h6 style={{ textTransform: "uppercase", fontFamily: "times", fontSize: "17pt" }} >ID: {client && client.id}</h6>
                                <h6 style={{ fontSize: "12pt", fontFamily: "times" }}>F.I.O: {client && client.lastname} {client && client.firstname} {client && client.fathername}</h6>
                            </div>
                        </div>
                        <div className="col-lg-12">
                            <div className="table-responsive" style={{ overflow: "hidden", outline: "none" }} tabindex="0">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>№</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Bo'lim</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>Navbat</th>
                                            <th className="text-center" style={{ fontSize: "10pt", fontFamily: "times" }}>To'lov miqdori</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sections && sections.map((section) => {

                                                if (
                                                    section.payment === 'kutilmoqda' && section.position !== "kelmagan"
                                                ) {
                                                    l++
                                                    return (<tr>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }}>{l}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-start px-2">{section.name} {section.subname}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.bron === 'offline' ? section.turn : section.bronTime}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.price - section.priceCashier}</td>
                                                    </tr>
                                                    )
                                                }
                                            })

                                        }

                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right"></th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right"></th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-right">Jami to'lov:</th>
                                            <th style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{price}</th>
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
            <div className="text-center w-100" style={{ position: "fixed", bottom: "20px" }} >
                <button onClick={handlePrint} className="btn btn-primary px-5" >
                    Print
                </button>
            </div>
        </div>
    )
}
