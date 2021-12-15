import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useHttp } from './hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../Reseption/components/Loader'
import { savePDF } from '@progress/kendo-react-pdf'
import QRCode from 'qrcode'
import '../index.css'

toast.configure()
export const ClientHistory = () => {
    const { request, loading, error, clearError } = useHttp()
    const clientId = useParams().id
    const [client, setClient] = useState({
        lastname: "",
        firstname: "",
        fathername: ""
    })
    const [sections, setSections] = useState()
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

    const getClient = useCallback(async () => {
        try {
            const data = await request(`/api/clienthistorys/client/${clientId}`, 'GET', null)
            setClient(data)
        } catch (e) {
        }
    }, [request, clientId, setClient])

    const getSections = useCallback(async () => {
        try {
            const data = await request(`/api/clienthistorys/sections/${clientId}`, 'GET', null)
            setSections(data)
        } catch (e) {
        }
    }, [request, clientId, setSections])

    const [doctors, setDoctors] = useState([])

    const getDoctors = useCallback(async () => {
        try {
            const fetch = await request('/api/auth/doctor/historyclient', 'GET', null)
            setDoctors(fetch)
        } catch (error) {
            notify(error)
        }
    })

    const [logo, setLogo] = useState()

    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null)
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [request, setLogo])

    const notify = (e) => {
        toast.error(e)
    }

    const [qr, setQr] = useState()
    const uri = window.location.href
    useEffect(() => {
        QRCode.toDataURL(`${uri}`)
            .then(data => {
                setQr(data)
            })
        if (client.lastname === "") {
            getClient()
        }
        if (!sections) {
            getSections()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!logo) {
            getLogo()
        }
        if (doctors.length === 0) {
            getDoctors()
        }

    }, [notify, clearError])

    const s = [
        { name: "Sarvar" },
        { name: "Sarvar" },
        { name: "Sarvar" },
        { name: "Sarvar" },
        { name: "Sarvar" },
        { name: "Sarvar" },
    ]
    if (loading) {
        return <Loader />
    }

    return (
        <dl>
            <dl style={{ backgroundColor: "#123456" }}>
                <dl ref={contentArea} style={{ width: "15cm", margin: "0 auto", backgroundColor: "white" }} >
                    {s.map(() => {
                        return (
                            <dl style={{ minHeight: "100vh", fontFamily: "times !important", fontSize: "7pt" }} className="m-2">
                                <dl className="row">
                                    <dl className="col-8 border-right border-dark text-center  border-5 m-none">
                                        <img alt="logo" src={logo && logo.logo} className="w-50" />
                                        <div className="row mt-3">
                                            <div className="col-3 text-end">
                                                <span className="fw-normal d-block" >Адрес:</span>
                                            </div>
                                            <div className="col-9 text-start fw-bold">
                                                г. Самарканд ул Зарафшон шох, 25
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3 text-end">
                                                <span className="fw-normal" >Ориентир:</span>
                                            </div>
                                            <div className="col-9 text-start fw-bold">
                                                школа №65, ресторан «РОХАТ»
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3 text-end">
                                                <span className="fw-normal" >Тел:</span>
                                            </div>
                                            <div className="col-9 text-start fw-bold">
                                                97 (919)-36-36, 93 (238)-55-44
                                            </div>
                                        </div>
                                    </dl>
                                    <dl className="col-4 text-center">
                                        <img width="100px" src={qr} alt="QR" />
                                        <p className="">для получения результата сканируйте это</p>
                                    </dl>
                                </dl>
                                <dl className="row">
                                    <dl className="col-12 fs-6 text-center fw-bold">
                                        {sections && sections[0].name + " " + sections[0].subname}
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
                                                    {sections && new Date(sections[0].bronDay).toLocaleDateString() + " " + new Date(sections[0].bronDay).toLocaleTimeString()}
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
                                                    {doctors && doctors.map((doctor) => {
                                                        if (doctor.section === sections[0].name) {
                                                            return (doctor.lastname + " " + doctor.firstname)
                                                        }
                                                    })}
                                                </th>
                                            </tr>
                                        </table>

                                    </dl>
                                </dl>
                            </dl>
                        )
                    })}

                </dl>
            </dl>
            <button onClick={createSizeHistory}>Save</button>
        </dl>
    )
}
