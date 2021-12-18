import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import makeAnimated from "react-select/animated"
import Select from 'react-select'
import {toast} from 'react-toastify'

const animatedComponents = makeAnimated()

toast.configure()
export const EditAdoption = () => {
    const { request, loading } = useHttp()
    const sectionId = useParams().id
    const auth = useContext(AuthContext)
    const [section, setSection] = useState()
    const [options, setOptions] = useState()
    const history = useHistory()
    const [client, setClient] = useState({
        id: "",
        lastname: "",
        firstname: "",
        fathername: "",
        born: "",
        phone: "",
        price: ""
    })

    //Modal oyna
    const [modal, setModal] = useState(false)

    const getSection = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/doctor/${sectionId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(fetch)
            getClient(fetch.client)
            setSection(fetch)
        } catch (error) {

        }
    }, [request, auth, sectionId])

    const getClient = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/clients/doctor/${id}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {

        }
    }, [request, auth])


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
            console.log(fetch)
            history.push(`/doctor`)
        } catch (e) {

        }
    }, [request, auth, section, sectionId])

    const changeHandlar = (event) => {
        setSection({ ...section, [event.target.name]: event.target.value })
    }

    const changeSections = (event) => {
        let s = ""
        event.map((e) => {
            s = s + e.label + `
            
            ` + e.value + `
            
            `
        })
        setSection({ ...section, summary: s })
    }

    const notify = (e) => {
        toast(e)
    }

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
        getSection()
    }, [getSection])


    return (
        <div style={{ marginTop: "70px" }}>

            <div className="container">
                <div style={{ fontFamily: "times !important" }} className="m-2">
                    <div className="row">
                        <div className="col-8 border-right border-dark text-center  border-5 m-none">
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
                        </div>
                        <div className="col-4 text-center">

                        </div>
                    </div>
                    <div className="row my-3">
                        <div className="col-12 fs-4 text-center fw-bold">
                            {section && section.name}
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
                            <h4 className="text-capitalize"> Xizmat: {section && section.subname}</h4>
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
                </div>
                <div>
                    <h5>Doctor: <span className="fs-4">{auth.doctor.lastname} {auth.doctor.firstname[0]}</span></h5>
                    <div className="row mt-5 mb-5">
                        <div className="col-12">
                            <button className="btn button-success" onClick={() => { window.scrollTo({ top: 0 }); setModal(true) }}>Tasdiqlash</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
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
                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={doneCome} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}