import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { Loader } from '../../components/Loader'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'

export const Reciept = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const clientId = useParams().id
    const today = (new Date().getDate().toString() + "." + (new Date().getMonth() + 1).toString() + "." + new Date().getFullYear().toString() + " " + new Date().getHours().toString() + ":" + new Date().getMinutes().toString() + ":" + new Date().getSeconds().toString())
    const [sections, setSections] = useState([])
    let price = 0
    let k = 0
    let l = 0
    const [client, setClient] = useState('')
    const { loading, request } = useHttp()

    const getSections = useCallback(async () => {
        try {
            const data = await request(`/api/section/reseptionid/${clientId}`, 'GET', null, {
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

    useEffect(() => {

        if (client === '') {
            getClient()
        }

    }, [getClient, client])

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
                                            <li className="" style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }} >"DS ONE PROVIDER" MCHJ</strong></li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Manzil:</strong> Navoiy shahar Zarapetyan ko'chasi</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Bank:</strong> AKB "TURONBANK" Navoiy filiali</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}> <strong style={{ fontSize: "10pt", fontFamily: "times" }}>MFO:</strong> 00200</li>
                                        </ul>
                                    </td>
                                    <td className="">
                                        <ul className="list-unstyled text-right m-3">
                                            <li style={{ fontFamily: "times" }}> <h5 style={{ textAlign: "right", fontSize: "10pt" }}> {today}</h5> </li>
                                            <li style={{ textAlign: "right", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>INN:</strong> 123456789</li>
                                            <li style={{ textAlign: "right", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Hisob raqam:</strong> 1234567890123456</li>
                                            <li style={{ textAlign: "right", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Telefon raqam:</strong> +998 (93) 196 94 34</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="invoice-from">
                                <h6 style={{ textTransform: "uppercase", fontFamily: "times", fontSize: "17pt" }} >ID: {client.id}</h6>
                                <h6 style={{ fontSize: "12pt", fontFamily: "times" }}>F.I.O: {client.lastname} {client.firstname} {client.fathername}</h6>
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
                                            sections.map((section) => {

                                                if (
                                                    section.payment === 'kutilmoqda'
                                                ) {
                                                    k++
                                                    price = price + section.price
                                                    return (<tr>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }}>{k}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.name}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.bron === 'offline' ? section.turn : section.bronTime}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.price}</td>
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
                                        <ul className="list-unstyled m-3 text-start">
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }} >"DS ONE PROVIDER" MCHJ</strong></li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Manzil:</strong> Navoiy shahar Zarapetyan ko'chasi</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Bank:</strong> AKB "TURONBANK" Navoiy filiali</li>
                                            <li style={{ fontSize: "10pt", fontFamily: "times" }}> <strong style={{ fontSize: "10pt", fontFamily: "times" }}>MFO:</strong> 00200</li>
                                        </ul>
                                    </td>
                                    <td className="text-center m-3">
                                        <ul className="list-unstyled text-right">
                                            <li style={{ fontFamily: "times" }}> <h5 style={{ textAlign: "right", fontSize: "10pt" }}> {today}</h5> </li>
                                            <li style={{ textAlign: "right", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>INN:</strong> 123456789</li>
                                            <li style={{ textAlign: "right", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Hisob raqam:</strong> 1234567890123456</li>
                                            <li style={{ textAlign: "right", fontSize: "10pt" }}><strong style={{ fontSize: "10pt", fontFamily: "times" }}>Telefon raqam:</strong> +998 (93) 196 94 34</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="invoice-from">
                                <h6 style={{ textTransform: "uppercase", fontFamily: "times", fontSize: "17pt" }} >ID: {client.id}</h6>
                                <h6 style={{ fontSize: "12pt", fontFamily: "times" }}>F.I.O: {client.lastname} {client.firstname} {client.fathername}</h6>
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
                                            sections.map((section) => {

                                                if (
                                                    section.payment === 'kutilmoqda'
                                                ) {
                                                    l++
                                                    return (<tr>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }}>{l}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.name}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.bron === 'offline' ? section.turn : section.bronTime}</td>
                                                        <td style={{ fontSize: "10pt", fontFamily: "times" }} className="text-center">{section.price}</td>
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
            <div className="container" style={{ position: "fixed", bottom: "0" }} >
                <div className="row">
                    <div className="offset-lg-5 col-lg-2 text-center">
                        <button onClick={handlePrint} className="btn btn-primary" >
                            Print
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
