import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useReactToPrint } from 'react-to-print'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
const mongoose = require("mongoose")

export const ClientAllHistory = () => {
    const auth = useContext(AuthContext)
    // {
    //     Authorization: `Bearer ${auth.token}`
    // }
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
    const clientId = useParams().id
    const { request } = useHttp()
    const [sections, setSections] = useState([])
    const [client, setClient] = useState('')

    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clients/doctor/${clientId}`, 'GET', null,
                {
                    Authorization: `Bearer ${auth.token}`
                })
            getSections()
            setClient(data)
        } catch (e) {
        }
    }, [request, clientId])

    const getSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctorhistory/${clientId}`, 'GET', null,
                {
                    Authorization: `Bearer ${auth.token}`
                })
            setSections(fetch)
        } catch (e) {
        }
    }, [request])

    useEffect(() => {
        if (sections.length === 0) {
            getSections()
        }
        getClient()
    }, [getClient, getSections])


    return (
        <div>
            <div ref={componentRef}>
                <div className="container p-3" style={{ fontFamily: "times" }}>
                    <div className="row">
                        <div className="col-12 p-t3">
                            <h1 className="text-center" > KASALLIK TARIXI</h1>
                        </div>
                        <hr style={{ border: "2px solid black" }} />
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <img src="https://png.pngitem.com/pimgs/s/463-4634060_crm-my-client-client-icon-hd-png-download.png" alt="client img" style={{ width: "180px", height: "200px" }} />
                        </div>
                        <div className="col-6">
                            <h3>{client.lastname} {client.firstname} {client.fathername}</h3>
                            <h3><b>ID: </b> {client.id}</h3>
                            <ul style={{ listStyle: "none" }}>
                                <li> <b> Tug'ilgan yili</b>: {new Date(client.born).toLocaleDateString()}</li>
                                <li> <b> Tel: </b>: +{client.phone}</li>
                            </ul>

                        </div>
                        <div className="col-3">
                            <img src="" alt="logo medcenter" style={{ width: "50px", height: "50px" }} />
                        </div>
                        <hr style={{ border: "2px solid black" }} />
                    </div>
                    {
                        sections && sections.map((section, key) => {
                            return (
                                <div className="row">
                                    <div className="col-3" style={{ borderRight: "3px solid black" }}>
                                        <ul style={{ listStyle: "none" }}>
                                            <li className="pb-3 w-100 text-end">
                                                <b  >Murojaat bo'limi</b>
                                            </li>
                                            <li className="pb-3 w-100 text-end">
                                                <b  >To'lov summasi</b>
                                            </li>
                                            <li className=" pb-3 w-100 text-end">
                                                <b>Murojaat vaqti</b>
                                            </li>
                                            <li className="pb-3 w-100 text-end">
                                                <b>Qabul turi</b>
                                            </li>
                                            <li className=" pb-3 w-100 text-end">
                                                <b>Doktor xulosasi</b>
                                            </li>
                                            <li className=" w-100 text-end">
                                                <b>Izoh</b>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-9">
                                        <ul style={{ listStyle: "none" }}>
                                            <li className="pb-3 w-100">
                                                {section.name}
                                            </li>
                                            <li className="pb-3 w-100">
                                                {section.price}
                                            </li>
                                            <li className=" pb-3 w-100">
                                                {new mongoose.Types.ObjectId(section._id).getTimestamp().toLocaleDateString()}
                                            </li>
                                            <li className="pb-3 w-100 ">
                                                {section.bron}
                                            </li>
                                            <li className=" pb-3 w-100 ">
                                                {section.summary === " " ? "Xulosa berilmagan" : section.summary}
                                            </li>
                                            <li className=" w-100 ">
                                                {section.comment === " " ? "Izoh qoldirilmagan" : section.comment}
                                            </li>
                                        </ul>
                                    </div>
                                    <hr className="mt-2" />
                                </div>
                            )
                        })
                    }

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
