import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { savePDF } from '@progress/kendo-react-pdf'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../components/Loader'
import QRCode from 'qrcode'
const mongoose = require("mongoose")

toast.configure()
export const ClientAllHistory = () => {
    const auth = useContext(AuthContext)

    const clientId = useParams().id
    const { request, loading, error, clearError } = useHttp()
    const [sections, setSections] = useState()
    const [client, setClient] = useState()
    const [baseUrl, setBasuUrl] = useState()
    const notify = (e) => {
        toast.error(e)
    }

    const contentArea = useRef(null)

    const createSizeHistory = () => {
        savePDF(
            contentArea.current,
            {
                paperSize: "A4",
                repeatHeaders: true,
                fileName: client.lastname + client.firstname + client.fathername,

            }, encodeURIComponent()

        )
    }

    const [doctors, setDoctors] = useState()

    const getDoctors = useCallback(async () => {
        try {
            const fetch = await request('/api/auth/doctor/historyclient', 'GET', null)
            setDoctors(fetch)
        } catch (error) {
            notify(error)
        }
    })

    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clients/reseption/${clientId}`, 'GET', null,
                {
                    Authorization: `Bearer ${auth.token}`
                })
            getSections()
            setClient(data)
        } catch (e) {
            notify(e)
        }
    }, [request, clientId, auth])

    const getSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/reseptionid/${clientId}`, 'GET', null,
                {
                    Authorization: `Bearer ${auth.token}`
                })
            setSections(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, clientId])

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

    const [qr, setQr] = useState()
    useEffect(() => {
        QRCode.toDataURL(`${baseUrl}/clienthistorys/${clientId}`)
            .then(data => {
                setQr(data)
            })
        if (error) {
            notify(error)
            clearError()
        }
        if (!client) {
            getClient()
        }
        if (!baseUrl) {
            getBaseUrl()
        }
        if (!logo) {
            getLogo()
        }
        if (!doctors) {
            getDoctors()
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }
    return (
        <div>
            <div className='text-end container pt-3' >
                <button className='btn btn-success pe-3 mb-2' onClick={createSizeHistory}>Yuklab olish</button>
            </div>
            <dl style={{ maxHeight: "100vh", overflow: "auto" }}>
                <dl style={{ backgroundColor: "#123456" }}>
                    <dl ref={contentArea} style={{ width: "15cm", margin: "0 auto" }} >
                        {
                            sections && sections.map((section) => {
                                if (section.done === "tasdiqlangan") {

                                    return (
                                        <dl style={{ minHeight: "100vh", fontFamily: "times !important", fontSize: "7pt", backgroundColor: "white" }} className="m-2">
                                            <dl className="row">
                                                <dl className="col-8 border-right border-dark text-center  border-5 m-none">
                                                    <img alt="logo" src={logo && logo.logo} className="w-50" />
                                                    <div className="row mt-3">
                                                        <div className="col-3 text-end">
                                                            <span className="fw-normal d-block" >Адрес:</span>
                                                        </div>
                                                        <div className="col-9 text-start fw-bold">
                                                            {logo && logo.address}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-3 text-end">
                                                            <span className="fw-normal" >Ориентир:</span>
                                                        </div>
                                                        <div className="col-9 text-start fw-bold">
                                                            {logo && logo.orientation}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-3 text-end">
                                                            <span className="fw-normal" >Тел:</span>
                                                        </div>
                                                        <div className="col-9 text-start fw-bold">
                                                            {logo && logo.phone1 !== null ? "+" + logo.phone1 : ""} <br />
                                                            {logo && logo.phone2 !== null ? "+" + logo.phone2 : ""} <br />
                                                            {logo && logo.phone3 !== null ? "+" + logo.phone3 : ""} <br />
                                                        </div>
                                                    </div>
                                                </dl>
                                                <dl className="col-4 text-center">
                                                    <img width="100px" src={qr} alt="QR" />
                                                    <p className="">для получения результата сканируйте здесь</p>
                                                </dl>
                                            </dl>
                                            <dl className="row">
                                                <dl className="col-12 fs-6 text-center fw-bold">
                                                    {section.name}
                                                    <h5 style={{ fontSize: "9pt" }}>
                                                        ({section.subname})
                                                    </h5>
                                                </dl>
                                            </dl>
                                            <dl className="row">
                                                <dl className="col-12">
                                                    <table className="w-100 historytable" >
                                                        <tr>
                                                            <th className="px-3  w-25 text-end">
                                                                Пациент
                                                            </th>
                                                            <th className="px-3 w-75">
                                                                {client && client.lastname + " " + client.firstname + " " + client.fathername}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="px-3 w-25 text-end">
                                                                Год рождения
                                                            </th>
                                                            <th className="px-3 w-75">
                                                                {client && new Date(client.born).toLocaleDateString()}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="px-3 w-25 text-end">
                                                                Дата обследования
                                                            </th>
                                                            <th className="px-3 w-75">
                                                                {new Date(section.bronDay).toLocaleDateString() + " " + new Date(section.bronDay).toLocaleTimeString()}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="px-3 w-25 text-end">
                                                                Tелефон номер
                                                            </th>
                                                            <th className="px-3 w-75">
                                                                +{client && client.phone}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                            <th className="px-3 w-25 text-end">
                                                                Врач
                                                            </th>
                                                            <th className="px-3 w-75">
                                                                {section.doctor && section.doctor}
                                                            </th>
                                                        </tr>
                                                    </table>

                                                </dl>
                                            </dl>
                                            <dl>
                                                <dl className='row'>
                                                    <dl className='col-12'>
                                                        <pre style={{ whiteSpace: "pre-wrap" }}>
                                                            {section.comment}
                                                        </pre>
                                                        <pre style={{ whiteSpace: "pre-wrap" }}>
                                                            {section.summary}
                                                        </pre>
                                                    </dl>
                                                </dl>
                                            </dl>
                                        </dl>
                                    )
                                }
                            })
                        }
                    </dl>
                </dl>


            </dl>
        </div>
    )
}
