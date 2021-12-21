import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { savePDF } from '@progress/kendo-react-pdf'
import QRCode from 'qrcode'

toast.configure()
export const ClientHistory = () => {
    const auth = useContext(AuthContext)

    const sectionId = useParams().id
    const { request, error, clearError } = useHttp()
    const [section, setSection] = useState()
    const [client, setClient] = useState()
    const [baseUrl, setBaseUrl] = useState()

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

    const getBaseUrl = useCallback(async () => {
        try {
            console.log("salom");
            const data = await request(`/api/clienthistorys/url`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setBaseUrl(data)
        } catch (e) {
            notify(e)
        }
    }, [request])

    const getClient = useCallback(async (id) => {
        try {
            const data = await request(`/api/clients/reseption/${id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(data)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, section])

    const getSection = useCallback(async () => {
        try {
            console.log("Salom");
            const fetch = await request(`/api/section/reseption/${sectionId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            getClient(fetch.client)
            setSection(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, sectionId, auth])

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
        if (client) {
            QRCode.toDataURL(`${baseUrl}/clienthistorys/${client._id}`)
                .then(data => {
                    setQr(data)
                })
        }
        if (!baseUrl) {
            getBaseUrl()
        }
        if (!logo) {
            getLogo()
        }
        if (!section) {
            getSection()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    return (
        <div>
            <div className='text-end' >
                <button className='btn btn-primary pe-3 mb-2' onClick={createSizeHistory}>Yuklab olish</button>
            </div>
            <dl style={{ maxHeight: "100vh", overflow: "auto" }}>
                <dl style={{ backgroundColor: "#123456" }}>
                    <dl ref={contentArea} style={{ width: "15cm", margin: "0 auto" }} >
                        <dl style={{ minHeight: "297mm", fontFamily: "times !important", fontSize: "7pt", backgroundColor: "white" }} className="m-2">
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
                                    {section && section.name}
                                    <h5 style={{ fontSize: "9pt" }}>
                                        ({section && section.subname})
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
                                                {section && new Date(section.bronDay).toLocaleDateString() + " " + new Date(section.bronDay).toLocaleTimeString()}
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
                                                {section && section.doctor}
                                            </th>
                                        </tr>
                                    </table>

                                </dl>
                            </dl>
                            <dl>
                                <dl className='row'>
                                    <dl className='col-12'>
                                        <pre style={{ whiteSpace: "pre-wrap" }}>
                                            {section && section.comment}
                                        </pre>
                                        <pre style={{ whiteSpace: "pre-wrap" }}>
                                            {section && section.summary}
                                        </pre>
                                    </dl>
                                </dl>
                            </dl>
                        </dl>
                    </dl>
                </dl>


            </dl>
        </div>
    )
}
