import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import 'react-toastify/dist/ReactToastify.css'
import { Loader } from '../../components/Loader'
import { toast } from 'react-toastify'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { AuthContext } from '../../context/AuthContext'
import Modal from 'react-modal'
const mongoose = require("mongoose")
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
export const OldOnlineClient = () => {
    const auth = useContext(AuthContext)
    let s = []
    const { loading, request, error, clearError } = useHttp()
    const [turns, seTurns] = useState([])
    const [sections, setSections] = useState([])

    const [clients, setClients] = useState()
    const notify = (e) => {
        toast.error(e)
    }

    // Modal oyna funksiyalari
    let allPrice = 0
    const [modal, setModal] = useState(false)

    // Bo'limlar
    const [options, setOptions] = useState()
    const getOptions = useCallback(async () => {
        try {
            const data = await request("/api/direction/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            setOptions(data)
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setOptions])


    const history = useHistory()
    const [client, setClient] = useState({
        _id: '',
        firstname: '',
        lastname: '',
        fathername: '',
        gender: '',
        phone: '',
        id: "",
        born: ''
    })

    const changeHandlar = event => {
        setClient({ ...client, [event.target.name]: event.target.value })

    }

    const changeTime = (event) => {
        console.log(event.target.value);
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], bronTime: event.target.value } }))
    }

    const changeBronDate = (event) => {
        console.log(event.target.value);
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], bronDay: new Date(event.target.value) } }))
    }

    const changeSections = (event) => {
        s = []
        event.map((section) => {
            let turn = 0
            turns.map((sec) => {
                if (checkTurn(sec, section.section)) {
                    turn++
                }
            })
            s.push({
                name: section.section,
                subname: section.subsection,
                priceCashier: 0,
                price: section.price,
                commentCashier: " ",
                comment: " ",
                summary: " ",
                done: "tasdiqlanmagan",
                payment: "kutilmoqda",
                turn: 0,
                bron: 'online',
                bronDay: new Date(),
                bronTime: " ",
                position: 'kutilmoqda',
                checkup: "chaqirilmagan"
            })
        })
        setSections(s)
    }

    const createSections = event => {
        let key = parseInt(event.target.id)
        setSections(Object.values({ ...sections, [key]: { ...sections[key], price: event.target.value } }), () => setSections(Object.values({ ...sections, [key]: { ...sections[key], turn: parseInt(event.target.name) } })))
    }

    const allClients = useCallback(async () => {
        try {
            const fetch = await request('/api/clients/reseption', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClients(fetch)
        } catch (e) { }
    }, [request])

    const searchClient = (id) => {
        clients.map((clt) => {
            if (clt.id === id) {
                setClient(clt)
            }
        })
    }

    const createConnector = async () => {
        try {
            const connector = await request("/api/connector/register", "POST", { client: client._id }, {
                Authorization: `Bearer ${auth.token}`
            })
            createAllSections(connector._id)
        } catch (e) {
            notify(e)
        }
    }

    const createAllSections = (connector) => {
        sections.map((section) => {
            create(section, connector)
        })
        history.push(`/reseption/reciept/${client._id}/${connector}`)
    }

    const create = async (section, connector) => {
        try {
            const data = await request(`/api/section/reseption/register/${client._id}`, "POST", { ...section, connector }, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(data)
        } catch (e) {
            notify(e)
        }
    }

    useEffect(() => {
        if (!options) {
            getOptions()

        }
        allClients()
    }, [allClients])


    const checkTurn = (turn, name) => {
        if (
            mongoose.Types.ObjectId(turn._id).getTimestamp().getFullYear() === new Date().getFullYear() &&
            mongoose.Types.ObjectId(turn._id).getTimestamp().getMonth() === new Date().getMonth() &&
            mongoose.Types.ObjectId(turn._id).getTimestamp().getDate() === new Date().getDate() &&
            turn.name === name
        ) return true
        return false
    }


    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className="row">
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 input_box">
                    <input
                        defaultValue={client.id}
                        onChange={(event) => searchClient(parseInt(event.target.value))}
                        name='ID'
                        type="number"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels">Mijoznig ID raqami</label>
                </div>
                <div className="col-md-6 input_box">
                    <input
                        defaultValue={client.phone}
                        onChange={changeHandlar}
                        type="number"
                        name='phone'
                        maxLength="12"
                        minLength="12"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels">Telefon raqami</label>

                </div>
            </div>
            <div className="row" style={{ padding: "15px 0" }}>
                <div className="col-md-6 input_box">
                    <input
                        value={client.lastname}
                        disabled
                        name='lastname'
                        type="text"
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Familiya</label>
                </div>
                <div className="col-md-6 input_box">
                    <input
                        disabled
                        value={client.firstname}
                        name="firstname"
                        type="text"
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Ism</label>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 input_box">
                    <input
                        disabled
                        value={client.fathername}
                        name="fathername"
                        type="text"
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Otasining ismi</label>
                </div>
                <div className="col-md-6 input_box">
                    <input
                        disabled
                        value={new Date(client.born).getFullYear().toString() + '-' + (new Date(client.born).getMonth() < 9 ? "0" + (new Date(client.born).getMonth() + 1).toString() : (new Date(client.born).getMonth() + 1).toString()) + '-' + (new Date(client.born).getDate() < 10 ? "0" + (new Date(client.born).getDate()).toString() : (new Date(client.born).getDate()).toString())}
                        type="date"
                        name='born'
                        className="form-control inp"
                        placeholder=""
                        style={{ background: "#fff", color: "#999" }}
                    />
                    <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Tug'ilgan sanasi</label>
                </div>
            </div>
            <div className="row">
            </div>
            <hr className="form-control" />

            <div className="row" >
                <div className="col-md-12" >
                    <Select
                        onChange={(event) => changeSections(event)}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={options}
                    />
                </div>
            </div>
            <div className="row">
                {
                    sections.map((section, key) => {
                        return (
                            <>
                                <div className="col-md-4 col-sm-6 mt-2" >
                                    <label className=""></label>
                                    <input
                                        disabled
                                        value={section.price}
                                        onChange={createSections}
                                        id={key}
                                        type="number"
                                        name={section.name}
                                        className="form-control"
                                        placeholder={section.name + " summasi"}
                                    />
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <label style={{ fontWeight: "100" }} > Kuni
                                    </label>
                                    <input
                                        id={key}
                                        onChange={changeBronDate}
                                        type="date"
                                        name='bronDay'
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <label style={{ fontWeight: "100" }}>Vaqti</label>
                                    <input
                                        id={key}
                                        value={section.bronTime}
                                        onChange={changeTime}
                                        type="time"
                                        name='bronTime'
                                        className="form-control"
                                        placeholder="Vaqtni kiriting"
                                    />
                                </div>

                            </>
                        )
                    })
                }

            </div>
            <div className="mt-5 text-center">
                <button
                    onClick={()=>setModal(true)}
                    className="btn btn-primary profile-button"
                >
                    Saqlash
                </button>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card p-4" style={{ fontFamily: "times" }}>
                        <div className="text-center fs-4 fw-bold text-secondary">
                            <span className="text-dark">Mijoz: </span>  {client.lastname} {client.firstname} {client.fathername}
                        </div>
                        <table className="w-100 mt-3">
                            <thead>
                                <tr style={{ borderBottom: "1px solid #999" }} >
                                    <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>№</th>
                                    <th style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Kuni</th>
                                    <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Soati</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderBottom: "1px solid #999" }}>

                                {
                                    sections.map((section, key) => {
                                        allPrice = allPrice + section.price
                                        return (
                                            <tr key={key}>
                                                <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                                                <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                                                    {section.name}
                                                </td>
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{new Date(section.bronDay).toLocaleDateString()}</td>
                                                <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.bronTime}</td>
                                            </tr>
                                        )
                                    })
                                }

                            </tbody>
                        </table>

                        <div className="row m-1 mt-3">
                            <div className="col-6">
                                <div className="fw-bold text-primary">Jami to'lov:</div>
                            </div>
                            <div className="col-6">
                                <div className="fw-bold  text-end ">{allPrice}</div>
                            </div>
                            <hr />

                        </div>
                        <div className="row m-1">
                            <div className="col-12 text-center">
                                <button onClick={createConnector} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={()=>setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
