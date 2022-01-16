import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { useHttp } from '../hooks/http.hook'
import './cashier.css'
import { AuthContext } from '../context/AuthContext'
import { toast } from "react-toastify"

toast.configure()
export const CheckCashier = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const notify = (e) => {
        toast.error(e)
    }
    let num = 0
    let num2 = 0
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)
    const [delSection, setDelSection] = useState()
    const [delService, setDelService] = useState()
    let allPrice = 0
    let paymented = 0
    let back = 0

    const [clientId, setClientId] = useState(useParams().id)
    const [connectorId, setConnectorId] = useState(useParams().connector)
    const [clientid, setClientid] = useState()
    const [sections, setSections] = useState()
    const [services, setServices] = useState()
    const [connector, setConnector] = useState()
    const [client, setClient] = useState()
    const { request, error, clearError, loading } = useHttp()

    const [payment, setPayment] = useState({
        client: clientId,
        connector: connectorId,
        type: "",
        total: 0,
        cash: 0,
        card: 0,
        transfer: 0,
        position: ""
    })


    const setPay = (event) => {
        if (event.target.id === "card") {
            setPayment({
                ...payment,
                [event.target.id]: parseInt(event.target.value),
                total: bepaid
            })
        }

        if (event.target.id === "cash") {
            setPayment({
                ...payment,
                [event.target.id]: parseInt(event.target.value),
                total: bepaid
            })
        }

        if (event.target.id === "transfer") {
            setPayment({
                ...payment,
                [event.target.id]: parseInt(event.target.value),
                total: bepaid
            })
        }
    }

    const setAllPayment = useCallback((event) => {
        let s = [...sections]
        s.map((section, key) => {
            s[key].paymentMethod = event.target.id
        })
        let m = [...services]
        m.map((section, key) => {
            m[key].paymentMethod = event.target.id
        })
        setSections(s)
        setServices(m)
        if (event.target.id === "card") {
            setPayment({
                ...payment,
                total: bepaid,
                type: event.target.id,
                cash: 0,
                transfer: 0,
                [event.target.id]: bepaid,
            })
        }
        if (event.target.id === "cash") {
            setPayment({
                ...payment,
                total: bepaid,
                type: event.target.id,
                card: 0,
                transfer: 0,
                [event.target.id]: bepaid,
            })
        }
        if (event.target.id === "transfer") {
            setPayment({
                ...payment,
                total: bepaid,
                type: event.target.id,
                cash: 0,
                card: 0,
                [event.target.id]: bepaid,
            })
        }
        if (event.target.id === "mixed") {
            setPayment({
                ...payment,
                total: bepaid,
                type: event.target.id,
                cash: 0,
                card: 0,
                transfer: 0
            })
        }
    }, [setPayment, payment, setSections, setServices, services, sections])

    const getClient = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/cashier/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClient(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, clientId, auth, setClient])

    const getConnector = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setConnector(fetch)
            setPayment({ ...payment, position: fetch.type })
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setConnector])

    const [sections1, setSections1] = useState()
    const [services1, setServices1] = useState()
    const [bepaid, setBepaid] = useState(0)
    const [oldPayments, setOldPayments] = useState()
    const [l, setL] = useState()

    const getOldPayments = useCallback(async () => {
        try {
            const fetch = await request(`/api/payment/cashier/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let s = 0
            fetch.map(f => {
                s = s + f.total
            })
            setOldPayments(s)
            setL(1)

        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setOldPayments, setL])


    const getSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/cashierconnector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let s = []
            fetch.map(f => {
                s.push(f)
            })
            setSections(fetch)
            setSections1(s)
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setSections, setSections1])

    const getSections1 = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/cashierconnector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            const data = await request(`/api/service/cashierconnector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setSections1(fetch)
            setServices1(data)
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setServices1, setSections1])

    const getServices = useCallback(async () => {
        try {
            const fetch = await request(`/api/service/cashierconnector/${connectorId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setServices(fetch)
            setServices1([...fetch])
        } catch (e) {
            notify(e)
        }
    }, [request, connectorId, auth, setServices, setServices1])

    const inputPriceSection = useCallback((event, key) => {
        document.getElementById(`checkbox${key}`).checked = false
        if (parseInt(event.target.value) > sections[key].price) {
            return notify("Iltimos to'lovdan ortiqcha summa kiritmang")
        }
        if (parseInt(event.target.value) === sections[key].price) {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: parseInt(event.target.value), payment: "to'langan", commentCashier: " " },
                }))
            let k = 0
            sections.map((s, i) => {
                if (i === key) {
                    k = k + (parseInt(event.target.value) - sections1[i].priceCashier)
                } else {
                    k = k + (sections[i].priceCashier - sections1[i].priceCashier)
                }
            })
            services.map((s, i) => {
                k = k + (services[i].priceCashier - services1[i].priceCashier)
            })
            setBepaid(k)
        } else {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: parseInt(event.target.value), payment: "kutilmoqda" },
                }))
            let k = 0
            sections.map((s, i) => {
                if (i === key) {
                    k = k + (parseInt(event.target.value) - sections1[i].priceCashier)
                } else {
                    k = k + (sections[i].priceCashier - sections1[i].priceCashier)
                }
            })
            services.map((s, i) => {
                k = k + (services[i].priceCashier - services1[i].priceCashier)
            })
            setBepaid(k)
        }
    }, [services, setSections, services1, sections, sections1, setBepaid])

    const inputPriceService = useCallback((event, key) => {
        document.getElementById(`checkboxservice${key}`).checked = false
        if (parseInt(event.target.value) > services[key].price) {
            return notify("Iltimos to'lovdan ortiqcha summa kiritmang")
        }
        if (parseInt(event.target.value) === services[key].price) {
            setServices(
                Object.values({
                    ...services,
                    [key]: { ...services[key], priceCashier: parseInt(event.target.value), payment: "to'langan", commentCashier: " " },
                }))
            let k = 0
            sections.map((s, i) => {
                k = k + (sections[i].priceCashier - sections1[i].priceCashier)
            })
            services.map((s, i) => {
                if (i === key) {
                    k = k + (parseInt(event.target.value) - services1[i].priceCashier)
                } else {
                    k = k + (services[i].priceCashier - services1[i].priceCashier)
                }
            })
            setBepaid(k)
        } else {
            setServices(
                Object.values({
                    ...services,
                    [key]: { ...services[key], priceCashier: parseInt(event.target.value), payment: "kutilmoqda" },
                }))
            let k = 0
            sections.map((s, i) => {
                k = k + (sections[i].priceCashier - sections1[i].priceCashier)
            })
            services.map((s, i) => {
                if (i === key) {
                    k = k + (parseInt(event.target.value) - services1[i].priceCashier)
                } else {
                    k = k + (services[i].priceCashier - services1[i].priceCashier)
                }
            })
            setBepaid(k)
        }
    }, [services, setServices, services1, sections, sections1, setBepaid])

    const inputCommentSection = (event, key) => {
        setSections(
            Object.values({
                ...sections,
                [key]: { ...sections[key], commentCashier: event.target.value },
            }))
    }

    const inputCommentService = (event, key) => {
        setServices(
            Object.values({
                ...services,
                [key]: { ...services[key], commentCashier: event.target.value },
            }))
    }

    const checkboxSection = useCallback((event, key) => {
        if (event.target.checked) {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: sections[key].price, payment: "to'langan" },
                }))
            let k = 0
            sections.map((s, i) => {
                if (i === key) {
                    k = k + (sections[key].price - sections1[i].priceCashier)
                } else {
                    k = k + (sections[i].priceCashier - sections1[i].priceCashier)
                }
            })
            console.log(k);
            services.map((s, i) => {
                k = k + (services[i].priceCashier - services1[i].priceCashier)
            })
            setBepaid(k)
        } else {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: 0, payment: "kutilmoqda", commentCashier: " " },
                }))
            let k = 0
            sections.map((s, i) => {
                if (i === key) {
                    k = k + (0 - sections1[i].priceCashier)
                } else {
                    k = k + (sections[i].priceCashier - sections1[i].priceCashier)
                }
            })
            services.map((s, i) => {
                k = k + (services[i].priceCashier - services1[i].priceCashier)
            })
            setBepaid(k)
        }
    }, [setSections, sections, bepaid, sections1, services1, services, setBepaid])

    const checkboxService = useCallback((event, key) => {
        if (event.target.checked) {
            setServices(
                Object.values({
                    ...services,
                    [key]: { ...services[key], priceCashier: services[key].price, payment: "to'langan" },
                }))
            let k = 0
            sections.map((s, i) => {
                k = k + (sections[i].priceCashier - sections1[i].priceCashier)
            })
            services.map((s, i) => {
                if (i === key) {
                    k = k + (services[key].price - services1[i].priceCashier)
                } else {
                    k = k + (services[i].priceCashier - services1[i].priceCashier)
                }
            })
            setBepaid(k)
        } else {
            setServices(
                Object.values({
                    ...services,
                    [key]: { ...services[key], priceCashier: 0, payment: "kutilmoqda", commentCashier: " " },
                }))
            let k = 0
            sections.map((s, i) => {
                k = k + (sections[i].priceCashier - sections1[i].priceCashier)
            })
            services.map((s, i) => {
                if (i === key) {
                    k = k + (0 - services1[i].priceCashier)
                } else {
                    k = k + (services[i].priceCashier - services1[i].priceCashier)
                }
            })
            setBepaid(k)
        }
    }, [setSections, sections, bepaid, sections1, services1, services, setBepaid])

    const checkPrices = () => {
        let k = 0
        sections && sections.map(section => {
            if (section.price !== section.priceCashier && section.commentCashier.length < 6) {
                k++
                return notify("Iltimos mijoz to'lovni bajarolmagani sababini to'liq ko'rsating.")
            }
        })
        services && services.map(service => {
            if (service.price !== service.priceCashier && service.commentCashier.length < 6) {
                k++
                return notify("Iltimos mijoz to'lovni bajarolmagani sababini to'liq ko'rsating.")
            }
        })
        if ((payment.total !== payment.cash + payment.card + payment.transfer) || payment.total !== bepaid) {
            return notify("Diqqat to'lov turida summani kiritishda xatolikka yo'l qo'ydingiz. Iltimos to'lov turidagi summalarni yana bir bor tekshiring")
        }
        if (payment.type === "") {
            return notify("Diqqat to'lov turini tanlashni unutdingiz")

        }
        if (!k) {
            window.scrollTo({ top: 0 })
            setModal1(true)
        }
    }

    const patchPaymentSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/cashier`, 'PATCH', { sections, services, payment }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {
            notify(e)
        }
    }, [request, auth, payment, sections, services])

    const setPayments = () => {
        patchPaymentSections()
        history.push({
            pathname: `/cashier/reciept/${clientId}/${connectorId}`
        })
    }

    const getchangeSections = useCallback(async (event) => {
        try {
            const fetch = await request(`/api/clients/cashierid/${parseInt(event.target.value)}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClientId(fetch[0]._id)
        } catch (e) {
            notify(e)
        }
    }, [request, clientid, auth, setClientId])

    const DeleteSection = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/${delSection && delSection._id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (e) {
            notify(e)
        }
    }, [request, auth, delSection])

    const DeleteService = useCallback(async () => {
        try {
            const fetch = await request(`/api/service/${delService && delService._id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (e) {
            notify(e)
        }
    }, [request, auth, delService])

    const paymenteds = useCallback((event) => {
        if (event.target.checked) {
            let k = 0
            let s = [...services]
            for (let i = 0; i < services.length; i++) {
                k = k + (s[i].price - services1[i].priceCashier)
                s[i].priceCashier = s[i].price
                s[i].payment = "to'langan"
                s[i].commentCashier = " "
            }
            setServices(s)
            let m = [...sections]
            for (let i = 0; i < sections.length; i++) {
                k = k + (m[i].price - sections1[i].priceCashier)
                m[i].priceCashier = m[i].price
                m[i].payment = "to'langan"
                m[i].commentCashier = " "
            }
            setSections(m)
            setBepaid(k)
            getSections1()
        } else {
            let k = 0
            let s = [...services]
            for (let i = 0; i < services.length; i++) {
                k = k + (0 - services1[i].priceCashier)
                s[i].priceCashier = 0

                s[i].payment = "kutilmoqda"
            }
            setServices(s)
            let m = [...sections]
            for (let i = 0; i < sections.length; i++) {
                k = k + (0 - sections1[i].priceCashier)
                m[i].priceCashier = 0

                m[i].payment = "kutilmoqda"
            }
            setSections(m)
            setBepaid(k)
            getSections1()
        }
    }, [setSections, setSections1, setBepaid, sections, setServices, services1, sections1])

    useEffect(() => {
        if (!l) {
            getOldPayments()
        }
        if (error) {
            notify(error)
            clearError()
        }
        if (!sections) {
            getSections()
        }
        if (!client) {
            getClient()
        }
        if (!connector) {
            getConnector()
        }
        if (!services) {
            getServices()
        }
    }, [notify, clearError])



    return (
        <>
            <div className="m-3" style={{ minWidth: "700px", maxWidth: "1000px", padding: "20px 10px", border: "1px solid #999", borderRadius: "5px" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="col-sm-6 col-lg-4 input_box" >
                        <input
                            disabled
                            value={client && client.id}
                            name='ID'
                            type="number"
                            className="form-control inp w-75 d-inline-block mr-3 mb-2"
                            placeholder=""
                            style={{ background: "#fff" }}
                            onChange={getchangeSections}
                        />
                        <label className="labels">Mijoznig ID raqami</label>
                        {/* <button onClick={() => { getClient(); getAllSections() }} className="btn text-white" style={{ backgroundColor: "#45D3D3", marginLeft: "5px" }}><FontAwesomeIcon icon={faSearch} /></button> */}
                    </div>
                    <div className="col-sm-6 col-lg-4 input_box" >
                        <input
                            value={client && client.lastname + " " + client.firstname + " " + client.fathername}
                            disabled
                            name='FIO'
                            type="text"
                            className="form-control inp"
                            placeholder=""
                            style={{ background: "#fff" }}
                        />
                        <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>F.I.O</label>
                    </div>
                </div>
                <table className="w-100 mt-3">
                    <thead>
                        <tr style={{ borderBottom: "1px solid #999" }} >
                            <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>№</th>
                            <th style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                            <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                            <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>To'lov <input onChange={paymenteds} type="checkbox" className="check" /></th>
                            <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>Sabab</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #999" }}>
                        {
                            sections && sections.map((section, key) => {
                                allPrice = allPrice + section.price
                                paymented = paymented + section.priceCashier
                                num++
                                if (section.payment === "to'lanmagan") {
                                    back = back + section.price
                                }
                                return (
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{num}</td>
                                        <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                            {section.name}
                                        </td>
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                                        <td style={{ width: "25%", padding: "10px 0" }}>
                                            <input onChange={event => inputPriceSection(event, key)} value={section.priceCashier} type="number" className="form-control" style={{ width: "80%", margin: "auto", display: "inline" }} />
                                            <input checked={section.priceCashier === section.price ? true : false} id={`checkbox${key}`} onChange={event => checkboxSection(event, key)} type="checkbox" className="check" style={{ position: "absolute" }} />
                                        </td>

                                        <td style={{ textAlign: "center", padding: "10px 0", color: "green" }}>
                                            {section.price !== section.priceCashier ? <textarea value={section.commentCashier} onChange={(event) => inputCommentSection(event, key)} key={key} placeholder="To'lov bajarilmagan holatda sababini ko'rsating" className="addDirection" minLength="6" ></textarea> : "To'langan"}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {
                            services && services.map((service, key) => {
                                allPrice = allPrice + service.price
                                paymented = paymented + service.priceCashier
                                num++
                                if (service.payment === "to'lanmagan") {
                                    back = back + service.price
                                }
                                return (
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{num}</td>
                                        <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                            {service.name}
                                        </td>
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.price}</td>
                                        <td style={{ width: "25%", padding: "10px 0" }}>
                                            <input onChange={event => inputPriceService(event, key)} value={service.priceCashier} type="number" className="form-control" style={{ width: "80%", margin: "auto", display: "inline" }} />
                                            <input checked={service.priceCashier === service.price ? true : false} id={`checkboxservice${key}`} onChange={event => checkboxService(event, key)} type="checkbox" className="check" style={{ position: "absolute" }} />
                                        </td>

                                        <td style={{ textAlign: "center", padding: "10px 0", color: "green" }}>
                                            {service.price !== service.priceCashier ? <textarea value={service.commentCashier} onChange={(event) => inputCommentService(event, key)} key={key} placeholder="To'lov bajarilmagan holatda sababini ko'rsating" className="addDirection" minLength="6" ></textarea> : "To'langan"}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <div className="">
                    <div className="row ms-3 mt-3 me-5 ">
                        <div className="col-6">
                            <div className="fw-bold text-primary">Jami to'lov:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end ">{allPrice}</div>
                        </div>
                        <hr />

                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-success">To'langan:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-success">{oldPayments}</div>
                        </div>
                        <hr />

                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-warning">To'lanayotgan:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-warning">{bepaid}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-danger">Qarz:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-danger">{allPrice - (oldPayments + bepaid)}</div>
                        </div>
                        <hr />
                    </div>
                    <div className='row border-top border-bottom p-3'>
                        <div className='col-md-3 col-4 text-center '>
                            <label className='mx-3 ' >
                                <input onChange={setAllPayment} id='card' type="radio" name="payment" /> Plastik
                            </label>
                            <input
                                value={payment.card}
                                type="number"
                                id='card'
                                onChange={setPay}
                                disabled={payment.type !== "mixed" ? true : false}
                                className='form-control'
                            />
                        </div>
                        <div className='col-md-3 col-4 text-center'>
                            <label className='mx-3'>
                                <input onChange={setAllPayment} id='cash' type="radio" name="payment" id='cash' /> Naqt
                            </label>
                            <input
                                value={payment.cash}
                                type="number"
                                id='cash'
                                onChange={setPay}
                                disabled={payment.type !== "mixed" ? true : false}
                                className='form-control'
                            />
                        </div>
                        <div className='col-md-3 col-4 text-center'>
                            <label className='mx-3'>
                                <input onChange={setAllPayment} id='transfer' type="radio" name="payment" /> O'tkazma
                            </label>
                            <input
                                value={payment.transfer}
                                type="number"
                                id='transfer'
                                onChange={setPay}
                                disabled={payment.type !== "mixed" ? true : false}
                                className='form-control'
                            />
                        </div>
                        <div className='col-md-3 col-4 text-center'>
                            <label className='mx-3'>
                                <input onChange={setAllPayment} id='mixed' type="radio" name="payment" /> Aralash
                            </label>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <div className="col-12 text-center">
                            <button className="btn button-success" onClick={checkPrices}>To'lovni tasdiqlash</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal1 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>  {client && client.lastname} {client && client.firstname} {client && client.fathername}
                            </div>

                        </div>
                        <div className="card-body">
                            <table className="w-100 mt-3" style={{ overflow: "scroll" }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #999" }} >
                                        <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>№</th>
                                        <th style={{ width: "20%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                                        <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                                        <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>To'langan</th>
                                        <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>To'lanmagan</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderBottom: "1px solid #999" }}>

                                    {
                                        sections && sections.map((section, key) => {
                                            num2++
                                            return (
                                                <tr >
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{num2}</td>
                                                    <td style={{ width: "20%", textAlign: "center", padding: "10px 0" }}>
                                                        {section.name}
                                                    </td>
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                                                    <td className="text-success" style={{ width: "10%", padding: "10px 0", textAlign: "center" }}>
                                                        {section.priceCashier}
                                                    </td>
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0", color: "red" }}>
                                                        {section.payment !== "to'lanmagan" ? section.price - section.priceCashier : 0}
                                                    </td>


                                                </tr>
                                            )
                                        })
                                    }

                                    {
                                        services && services.map((service, key) => {
                                            num2++
                                            return (
                                                <tr >
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{num2}</td>
                                                    <td style={{ width: "20%", textAlign: "center", padding: "10px 0" }}>
                                                        {service.name}
                                                    </td>
                                                    <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.price}</td>
                                                    <td className="text-success" style={{ width: "10%", padding: "10px 0", textAlign: "center" }}>
                                                        {service.priceCashier}
                                                    </td>
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0", color: "red" }}>
                                                        {service.payment !== "to'lanmagan" ? service.price - service.priceCashier : 0}
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }


                                </tbody>
                            </table>

                            <div className="row ms-3 mt-3 me-5 ">
                                <div className="col-6">
                                    <div className="fw-bold text-primary">Jami to'lov:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end ">{allPrice}</div>
                                </div>
                                <hr />

                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-success">To'langan:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-success">{oldPayments}</div>
                                </div>
                                <hr />

                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-warning">To'lanayotgan:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-warning">{payment.total}</div>
                                </div>
                                <hr />
                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-danger">Qarz:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-danger">{allPrice - (payment.total + oldPayments)}</div>
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={setPayments} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal1(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal2 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>
                                {client && client.lastname} {client && client.firstname} {client && client.fathername}ga ko'rsatilayotgan
                                <span className='text-danger'> {delService && delService.name + " " + delService.type}</span> xizmati mijozning xizmatlar bo'limidan o'chiriladi. O'chirishni tasdiqlaysizmi?
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={DeleteService} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal2(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal3 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>
                                {client && client.lastname} {client && client.firstname} {client && client.fathername}ga ko'rsatilayotgan
                                <span className='text-danger'> {delSection && delSection.name + " " + delSection.subname}</span> xizmati(yoki ashyosi) mijozning xizmatlar bo'limidan o'chiriladi. O'chirishni tasdiqlaysizmi?
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={DeleteSection} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal3(false)} className="btn button-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
