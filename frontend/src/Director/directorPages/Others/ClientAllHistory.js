import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useReactToPrint } from 'react-to-print'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
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
            const data = await request(`/api/clients/reseption/${clientId}`, 'GET', null,
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
            const fetch = await request(`/api/section/reseptionid/${clientId}`, 'GET', null,
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
            <div className="">
                <article className="linkk mt-5" >
                    <h1 style={{ fontWeight: "700" }}>Kasallik tarixi</h1>
                    <div className="row mt-4" style={{ border: "25px solid hsla(212, 54%, 71%, 0.471)" }}>
                        <div className="col-md-7 col-12 mt-3">
                            <div className="row">
                                <p style={{ fontWeight: "700", color: "blue", fontSize: "22px", margin: "10px" }}>Mijoz ma'lumotlari</p>
                                <div className="col-4">
                                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }}>Familiyasi</p>
                                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }} >Ismi</p>
                                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }}>Otasining ismi</p>
                                </div>
                                <div className="col-8">
                                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}>{client.lastname}</p>
                                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }} >{client.firstname}</p>
                                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}>{client.fathername}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 col-12 mt-3">
                            <div className="row">
                                <p style={{ fontWeight: "700", color: "blue", fontSize: "20px", margin: "10px 0" }}>Qo'shimcha ma'lumotlar</p>
                                <div className="col-4">
                                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Tug'ilgan yili</p>
                                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Jinsi</p>
                                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Telefon raqami</p>
                                </div>
                                <div className="col-8">
                                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}>{client.born && new Date(client.born).toLocaleDateString()}</p>
                                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }} >{client && client.gender === "man" ? "Erkak" : "Ayol"}</p>
                                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }} >+{client && client.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        sections && sections.map((section, key) => {
                            return (
                                <div className="row" style={{ border: "25px solid hsla(212, 54%, 71%, 0.471)", borderTop: "none" }}>
                                    <div className="row">
                                        <div className="col-md-6 col-12 fs-5 fw-bold p-2">
                                            Bo'limi: {section && section.name} <br />
                                            Masad: {section && section.subname}
                                        </div>
                                        <div className="col-md-4 col-9 fs-5 p-2 text-end">
                                            Murojaat kuni: <br />
                                            To'lov:
                                        </div>
                                        <div className="col-md-2 col-3 fs-5 p-2 text-end">
                                            {section && new Date(section.bronDay).toLocaleDateString()}<br />
                                            {section && section.price}
                                        </div>
                                        <hr />
                                        <div className="col-12">
                                            <h5>Izoh:</h5>
                                            <p>{section.comment && section.comment}</p>
                                        </div>
                                        <div className="col-12">
                                            <h5>Xulosa:</h5>
                                            <p>{section.summary && section.summary}</p>
                                        </div>
                                    </div>
                                </div>)
                        })
                    }
                </article>
            </div>
            <div className="d-none">
                <div ref={componentRef}>
                    <div className="">
                        <article className="linkk mt-5" >
                            <h1 style={{ fontWeight: "700" }}>Kasallik tarixi</h1>
                            <div className="row mt-4" style={{ border: "25px solid hsla(212, 54%, 71%, 0.471)" }}>
                                <div className="col-7 mt-3">
                                    <div className="row">
                                        <p style={{ fontWeight: "700", color: "blue", fontSize: "22px", margin: "10px" }}>Mijoz ma'lumotlari</p>
                                        <div className="col-4">
                                            <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }}>Familiyasi</p>
                                            <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }} >Ismi</p>
                                            <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }}>Otasining ismi</p>
                                        </div>
                                        <div className="col-8">
                                            <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}>{client.lastname}</p>
                                            <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }} >{client.firstname}</p>
                                            <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}>{client.fathername}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5 mt-3">
                                    <div className="row">
                                        <p style={{ fontWeight: "700", color: "blue", fontSize: "20px", margin: "10px 0" }}>Qo'shimcha ma'lumotlar</p>
                                        <div className="col-4">
                                            <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Tug'ilgan yili</p>
                                            <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Jinsi</p>
                                            <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Telefon raqami</p>
                                        </div>
                                        <div className="col-8">
                                            <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}>{client.born && new Date(client.born).toLocaleDateString()}</p>
                                            <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }} >{client && client.gender === "man" ? "Erkak" : "Ayol"}</p>
                                            <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }} >+{client && client.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                sections && sections.map((section, key) => {
                                    return (
                                        <div className="row" style={{ border: "25px solid hsla(212, 54%, 71%, 0.471)", borderTop: "none" }}>
                                            <div className="row">
                                                <div className="col-6 fs-5 fw-bold p-2">
                                                    Bo'limi: {section && section.name}
                                                </div>
                                                <div className="col-4 fs-5 p-2 text-end">
                                                    Murojaat kuni: <br />
                                                    To'lov:
                                                </div>
                                                <div className="col-2 fs-5 p-2 text-end">
                                                    {section && new Date(section.bronDay).toLocaleDateString()}<br />
                                                    {section && section.price}
                                                </div>
                                                <hr />
                                                <div className="col-12">
                                                    <h5>Izoh:</h5>
                                                    <p>{section.comment && section.comment}</p>
                                                </div>
                                                <div className="col-12">
                                                    <h5>Xulosa:</h5>
                                                    <p>{section.summary && section.summary}</p>
                                                </div>
                                            </div>
                                        </div>)
                                })
                            }
                        </article>
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
