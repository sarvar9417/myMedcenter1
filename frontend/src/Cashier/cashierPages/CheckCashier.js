import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { useHttp } from '../hooks/http.hook'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from 'react-modal'
import './cashier.css'
import { AuthContext } from '../context/AuthContext'
import { toast } from "react-toastify"

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
}

toast.configure()
export const CheckCashier = () => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const notify = (e) => {
        toast.error(e)
    }

    const [modal, setModal] = useState(false)

    let allPrice = 0
    let paymented = 0
    let back = 0

    const payment = ["to'langan", "to'lanmagan", "kutilmoqda"]

    const [clientId, setClientId] = useState(useParams().id)
    const [clientid, setClientid] = useState()
    const [allSections, setAllSections] = useState([])
    const [sections, setSections] = useState([])
    const [client, setClient] = useState([])
    const { loading, request } = useHttp()

    const getClient = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/cashier/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            // setAllSections(fetch)
            setClient(fetch)
        } catch (e) {

        }
    }, [request, clientId])


    const getAllSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/cashier/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let s = []
            fetch.map((section) => {
                if (section.payment === "kutilmoqda") {
                    s.push(section)
                }
            })
            setSections(s)
        } catch (e) {

        }
    }, [request, clientId])

    const inputPriceCashier = (event, key) => {
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
        } else {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: parseInt(event.target.value), payment: "kutilmoqda" },
                }))
        }
    }

    const inputCommentCashier = (event, key) => {
        setSections(
            Object.values({
                ...sections,
                [key]: { ...sections[key], commentCashier: event.target.value },
            }))
    }

    const changePayment = (key) => {
        document.getElementById(`checkbox${key}`).checked = false
        if (sections[key].payment === "kutilmoqda" || sections[key].payment === "to'langan") {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], payment: "to'lanmagan", priceCashier: 0, commentCashier: " " }
                })
            )
        } else {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], payment: "kutilmoqda", priceCashier: 0 },
                })
            )
        }
    }

    const checkbox = (event, key) => {
        if (event.target.checked) {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: sections[key].price, payment: "to'langan" },
                }))
        } else {
            setSections(
                Object.values({
                    ...sections,
                    [key]: { ...sections[key], priceCashier: 0, payment: "kutilmoqda", commentCashier: " " },
                }))
        }
    }

    const patchPayments = useCallback(async (section) => {
        try {
            const fetch = await request(`/api/section/cashier/${section._id}`, 'PATCH', { ...section }, {
                Authorization: `Bearer ${auth.token}`
            })
        } catch (e) {

        }
    }, [request])

    // const [printPage, setPrintPage] = useState(false)

    const checkPrices = () => {
        let k = 0
        sections.map(section => {
            if (section.price !== section.priceCashier && section.commentCashier.length < 6) {
                k++
                return notify("Iltimos mijoz to'lovni bajarolmagani sababini to'liq ko'rsating.")
            }
        })
        if (!k) {
            window.scrollTo({ top: 0 })
            setModal(true)
        }
    }

    const setPayments = () => {
        sections.map((section) => {
            patchPayments(section)
        })
        history.push({
            pathname: `/cashier/reciept/${clientId}`,
            state: sections
        })
    }

    const getchangeSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/cashierid/${clientid}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClientId(fetch[0]._id)
        } catch (e) {

        }
    }, [request, clientid])

    const changeHandlar = () => {
        getchangeSections()
    }

    useEffect(() => {
        getAllSections()
        getClient()
    }, [getAllSections, getClient])
    return (
        <>
            <div className="m-3" style={{ minWidth: "700px", maxWidth: "1000px", padding: "20px 10px", border: "1px solid #999", borderRadius: "5px" }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                    <div className="col-sm-6 col-lg-4 input_box" >
                        <input
                            defaultValue={client.id}
                            name='ID'
                            type="number"
                            className="form-control inp w-75 d-inline-block mr-3 mb-2"
                            placeholder=""
                            onChange={(event => setClientid(parseInt(event.target.value)))}
                        />
                        <label className="labels">Mijoznig ID raqami</label>
                        <button onClick={changeHandlar} className="btn text-white" style={{ backgroundColor: "#45D3D3", marginLeft: "5px" }}><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                    <div className="col-sm-6 col-lg-4 input_box" >
                        <input
                            value={client.lastname + " " + client.firstname + " " + client.fathername}
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
                            <th style={{ width: "25%", textAlign: "center", padding: "10px 0" }}>To'lov</th>
                            <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>Holati</th>
                            <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>Sabab</th>
                        </tr>
                    </thead>
                    <tbody style={{ borderBottom: "1px solid #999" }}>
                        {
                            sections.map((section, key) => {
                                allPrice = allPrice + section.price
                                paymented = paymented + section.priceCashier

                                if (section.payment === "to'lanmagan") {
                                    back = back + section.price
                                }
                                return (
                                    <tr >
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                                        <td style={{ width: "35%", textAlign: "center", padding: "10px 0" }}>
                                            {section.name}
                                        </td>
                                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                                        <td style={{ width: "25%", padding: "10px 0" }}>
                                            <input onChange={event => inputPriceCashier(event, key)} value={section.priceCashier} type="number" className="form-control" style={{ width: "80%", margin: "auto", display: "inline" }} />
                                            <input id={`checkbox${key}`} onChange={event => checkbox(event, key)} type="checkbox" className="check" style={{ position: "absolute" }} />
                                        </td>
                                        <td style={{ width: "10%", textAlign: "center", padding: "10px 0", color: "red" }}>
                                            <div className="wrapp" style={{ justifyContent: "center" }}>
                                                {
                                                    payment.map((pay) => {
                                                        if ((pay === "kutilmoqda" && section.payment === "kutilmoqda") ||
                                                            (pay === "to'langan" && section.payment === "to'langan")) {
                                                            return <button onClick={() => changePayment(key)} className="payment rlabel">
                                                                x
                                                            </button>
                                                        }

                                                        if ((pay === "to'lanmagan" && section.payment === "to'lanmagan")) {
                                                            return <button onClick={() => changePayment(key)} className="payment rlabel rclabel">
                                                                x
                                                            </button>
                                                        }
                                                    })
                                                }
                                            </div>
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px 0", color: "green" }}>
                                            {section.price !== section.priceCashier ? <textarea defaultValue={section.commentCashier} onChange={(event) => inputCommentCashier(event, key)} key={key} placeholder="To'lov bajarilmagan holatda sababini ko'rsating" className="addDirection" minLength="6" ></textarea> : "To'langan"}
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
                            <div className="fw-bold  text-end text-success">{paymented}</div>
                        </div>
                        <hr />

                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-warning">Qarz:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-warning">{allPrice - paymented - back}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row ms-3 me-5">
                        <div className="col-6">
                            <div className="fw-bold text-danger">Rad etilgan:</div>
                        </div>
                        <div className="col-6">
                            <div className="fw-bold  text-end text-danger">{back}</div>
                        </div>
                        <hr />
                    </div>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button className="btn btn-success" onClick={checkPrices}>To'lovni tasdiqlash</button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-header">
                            <div className="text-center fs-4 fw-bold text-secondary">
                                <span className="text-dark">Mijoz: </span>  {client.lastname} {client.firstname} {client.fathername}
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
                                        sections.map((section, key) => {
                                            return (
                                                <tr >
                                                    <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
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
                                    <div className="fw-bold  text-end text-success">{paymented}</div>
                                </div>
                                <hr />

                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-warning">Qarz:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-warning">{allPrice - paymented - back}</div>
                                </div>
                                <hr />
                            </div>
                            <div className="row ms-3 me-5">
                                <div className="col-6">
                                    <div className="fw-bold text-danger">Rad etilgan:</div>
                                </div>
                                <div className="col-6">
                                    <div className="fw-bold  text-end text-danger">{back}</div>
                                </div>
                                <hr />
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="row ">
                                <div className="col-12 text-center">
                                    <button onClick={setPayments} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                    <button onClick={() => setModal(false)} className="btn btn-danger" >Qaytish</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
