import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import 'react-toastify/dist/ReactToastify.css'
import { Loader } from '../../components/Loader'
import { toast } from 'react-toastify'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { CheckClentData } from './CheckClentData'
import '../radio.css'
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
export const NewOnlineClient = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    let s = []
    const { loading, request, error, clearError } = useHttp()
    const [turns, seTurns] = useState([])
    const [sections, setSections] = useState([])
    const notify = (e) => {
        toast.error(e)
    }
    const history = useHistory()

    // Modal oyna funksiyalari
    let allPrice = 0
    const [modalIsOpen, setIsOpen] = useState(false)

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

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

    const [client, setClient] = useState({
        firstname: '',
        lastname: '',
        fathername: '',
        gender: '',
        phone: '',
        id: 0,
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

    const changeDate = (event) => {
        setClient({ ...client, born: new Date(event.target.value) })
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
                if (checkTurn(sec, section.value)) {
                    turn++
                }
            })
            s.push({
                name: section.value,
                price: section.price,
                priceCashier: 0,
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
            const sec = await request('/api/section/reseption', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            seTurns(sec)
            client.id = fetch.length + 1000001
        } catch (e) { }
    }, [request, auth])


    const checkData = () => {
        if (CheckClentData(client)) {
            return notify(CheckClentData(client))
        }
        openModal()
    }

    const createHandler = async () => {
        try {
            const data = await request('/api/clients/reseption/register', 'POST', { ...client }, {
                Authorization: `Bearer ${auth.token}`
            })
            createConnector(data._id)
        } catch (e) { }
    }

    const createConnector = async (client) => {
        try {
            const connector = await request("/api/connector/register", "POST", { client }, {
                Authorization: `Bearer ${auth.token}`
            })

            createAllSections(client, connector._id)
        } catch (e) {
            notify(e)
        }
    }

    const createAllSections = (id, connector) => {
        sections.map((section) => {
            create(id, section, connector)
        })
        history.push(`/reseption/reciept/${id}/${connector}`)
    }

    const create = async (id, section, connector) => {
        try {
            const data = await request(`/api/section/reseption/register/${id}`, "POST", { ...section, connector }, {
                Authorization: `Bearer ${auth.token}`
            })
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
        <div data-aos="flip-right">
            <div className="row">
                <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
                    <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 input_box" >
                    <input
                        defaultValue={client.lastname}
                        onChange={changeHandlar}
                        name='lastname'
                        type="text"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels">Familiya</label>
                </div>
                <div className="col-md-6 input_box" >
                    <input
                        defaultValue={client.firstname}
                        onChange={changeHandlar}
                        name="firstname"
                        type="text"
                        className="form-control inp"
                        placeholder="" />
                    <label className="labels">Ism</label>
                </div>
            </div>
            <div className="row" style={{ padding: "15px 0" }}>
                <div className="col-md-6 input_box" >
                    <input
                        defaultValue={client.fathername}
                        onChange={changeHandlar}
                        name="fathername"
                        type="text"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels">Otasining ismi</label>
                </div>
                <div className="col-md-6 input_box" >
                    <input
                        defaultValue={new Date(client.born).getFullYear().toString() +
                            "-" +
                            (new Date(client.born).getMonth() < 9
                                ? "0" + (new Date(client.born).getMonth() + 1).toString()
                                : (new Date(client.born).getMonth() + 1).toString()) +
                            "-" +
                            (new Date(client.born).getDate() < 10
                                ? "0" + new Date(client.born).getDate().toString()
                                : new Date(client.born).getDate().toString())}
                        onChange={changeDate}
                        type="date"
                        name='born'
                        className="form-control inp"
                        placeholder=""
                        style={{ color: "#999" }}
                    />
                    <label className="labels">Tug'ilgan kuni</label>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6" >
                    <div className="form-group">
                        <div className="btn-group" data-toggle="buttons">
                            <div className="wrapper">
                                <input
                                    className="input"
                                    id="erkak"
                                    onChange={changeHandlar}
                                    name="gender"
                                    type="radio"
                                    defaultValue="man"
                                    check={client.gender === "man" ? true : false}
                                />
                                <label
                                    className={client.gender === "man" ? "label clabel" : "label"}
                                    for="erkak"
                                >
                                    Erkak
                                </label>
                                <input
                                    check={client.gender === "woman" ? true : false}
                                    className="input"
                                    type="radio"
                                    id="ayol"
                                    onChange={changeHandlar}
                                    name="gender"
                                    defaultValue="woman"
                                />
                                <label
                                    className={
                                        client.gender === "woman" ? "label clabel" : "label"
                                    }
                                    for="ayol"
                                >
                                    Ayol
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 input_box" >
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
            <hr className="form-control" />

            <div className="row" >
                <div className="col-md-12"  >
                    <Select
                        className="mt-3"
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
                                <div className="col-md-4 col-sm-6" >
                                    <label className=""></label>
                                    <input
                                        disabled
                                        defaultValue={section.price}
                                        onChange={createSections}
                                        id={key}
                                        type="number"
                                        name={section.name}
                                        className="form-control"
                                        placeholder={section.name + " summasi"}
                                    />
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <label className=""> Kuni</label>
                                    <input
                                        id={key}
                                        onChange={changeBronDate}
                                        type="date"
                                        name='bronDay'
                                        className="form-control"
                                    />
                                </div>
                                <div className="col-md-4 col-sm-6">
                                    <label className="">Vaqti</label>
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
                    onClick={checkData}
                    className="btn btn-primary profile-button"
                >
                    Saqlash
                </button>
            </div>


            {/* Modal oynaning ochilishi */}
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
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
            `            <div className="col-12 text-center">
                            <button onClick={createHandler} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                            <button onClick={closeModal} className="btn btn-danger" >Qaytish</button>
                        </div>
                    </div>

                </Modal>
            </div>`
        </div>
    )
}
