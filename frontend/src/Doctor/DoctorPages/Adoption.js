import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { toast } from 'react-toastify'
import QRCode from 'qrcode'
import { Loader } from '../components/Loader'
import makeAnimated from "react-select/animated"
import Select from 'react-select'
const animatedComponents = makeAnimated()
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
export const Adoption = () => {
    const { request, loading, error, clearError } = useHttp()
    const sectionId = useParams().id
    const auth = useContext(AuthContext)
    const [section, setSection] = useState()
    const history = useHistory()
    const [options, setOptions] = useState()
    const [client, setClient] = useState()


    //Modal oyna
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)

    const getSection = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctor/${sectionId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSection(fetch)
        } catch (error) {
            notify(error)
        }
    }, [request, auth, sectionId])

    const getClient = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/doctor/${section.client}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, section])

    const checkUp = (event) => {
        setSection({ ...section, [event.target.name]: event.target.id })
        window.scrollTo({ top: 0 })
        setModal1(true)
    }

    const dontCome = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctordontcome/${sectionId}`, 'PUT', { checkUp: "kelmagan" }, {
                Authorization: `Bearer ${auth.token}`
            })
            history.push(`/doctor`)
        } catch (e) {

        }
    }, [request, auth])


    const doneCome = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctordone/${sectionId}`, 'PUT',
                {
                    checkUp: "kelgan",
                    comment: section.comment,
                    summary: section.summary,
                    done: "tasdiqlangan"
                },
                {
                    Authorization: `Bearer ${auth.token}`
                })
            history.push(`/doctor`)
        } catch (e) {

        }
    }, [request, auth, section, sectionId])

    const changeSections = (event) => {
        let s = ""
        event.map((e) => {
            s = s + e.label + `
            
            ` + e.value + `
            
            `
        })
        setSection({ ...section, summary: s })
    }

    const changeHandlar = (event) => {
        setSection({ ...section, [event.target.name]: event.target.value })
    }

    const getTemplates = useCallback(async () => {
        try {
            const fetch = await request(`/api/templatedoctor`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let opt = []
            fetch.map((template) => {
                let option = {
                    label: template.subsection,
                    value: template.template
                }
                opt.push(option)
            })
            setOptions(opt)
        } catch (error) {
            notify(error)
        }
    }, [request, auth])

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
        toast(e)
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

    const [qr, setQr] = useState()
    const createQR = () => {
        QRCode.toDataURL(`${baseUrl}/api/clienthistorys/${client._id}`)
            .then(data => {
                setQr(data)
            })
    }

    useEffect(() => {

        if (!logo) {
            getLogo()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!section) {
            getSection()
        }
        if (!options) {
            getTemplates()
        }
        if (!baseUrl) {
            getBaseUrl()
        }
        if (section && !client) {
            getClient()
        }
        if (client) {
            createQR()
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }


    return (
        <div style={{ marginTop: "70px" }}>

            <div className="container">
                <div style={{ fontFamily: "times !important" }} className="m-2">
                    <div className="row">
                        <div className=" col-md-8 col-12 border-right border-dark text-center  border-5 m-none">
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
                        </div>
                        <div className="col-md-4 col-12 text-center">
                            <img src={qr && qr} />
                        </div>
                    </div>
                    <div className="row my-3">
                        <div className="col-12 fs-4 text-center fw-bold">
                            {section && section.name}
                            <h4 className=""> ({section && section.subname})</h4>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
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
                                        {auth.doctor && auth.doctor.lastname + " " + auth.doctor.firstname}
                                    </th>
                                </tr>
                            </table>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-6 pt-3">
                        </div>
                        <div className="col-12 col-md-6">

                            <Select
                                className="mt-3"
                                onChange={(event) => changeSections(event)}
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                name="shablonlar"
                                isMulti
                                options={options && options}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-12">
                            <textarea value={section && section.summary} name="summary" onChange={changeHandlar} className="form-control" style={{ minHeight: "300px" }} />
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-12">
                            Comment:
                            <textarea value={section && section.comment} name="comment" onChange={changeHandlar} className="form-control"    />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="row mt-5 mb-5">
                        <div className="col-12">
                            <button id="kelmagan" name="checkup" onClick={checkUp} className="btn button-danger me-5">Mijoz kelmadi</button>
                            <button className="btn button-success" onClick={() => { window.scrollTo({ top: 0 }); setModal2(true) }}>Tasdiqlash</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal1 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-4" style={{ fontFamily: "times" }}>
                        <div className="row m-1">
                            <div className="col-12 text-center mb-4 ">
                                <h4>Mijoz kelmaganini tasdiqlaysizmi?</h4>
                            </div>
                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={dontCome} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal1(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal2 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-4" style={{ fontFamily: "times" }}>
                        <div className="row m-1">
                            <div className="col-12 ">
                            </div>
                        </div>
                        <div className="row m-1">
                            <div className="col-12 ">
                                <pre >
                                    Xulosa: <br />
                                    {section && section.summary}
                                </pre>
                            </div>
                            <div className="col-12 ">
                                <pre >
                                    Izoh: <br />
                                    {section && section.comment}
                                </pre>
                            </div>
                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={doneCome} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal2(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}