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

const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

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
                price: 0,
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
        createHandler()
    }

    const createHandler = async () => {
        try {
            const data = await request('/api/clients/reseption/register', 'POST', { ...client }, {
                Authorization: `Bearer ${auth.token}`
            })
            createAllSections(data._id)
            // history.push(`/reseption/reciept/${data._id}`)
        } catch (e) { }
    }

    const createAllSections = (id) => {
        sections.map((section) => {
            create(id, section)
        })
        history.push(`/reseption/reciept/${id}`)
    }

    const create = async (id, section) => {
        try {
            const data = await request(`/api/section/reseption/register/${id}`, 'POST', { ...section }, {
                Authorization: `Bearer ${auth.token}`
            })
            console.log(data);
        } catch (e) { }
    }

    useEffect(() => {
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
                <div className="col-md-6 input_box" data-aos="fade-right">
                    <input
                        onChange={changeHandlar}
                        name='lastname'
                        type="text"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels">Familiya</label>
                </div>
                <div className="col-md-6 input_box" data-aos="fade-left">
                    <input
                        onChange={changeHandlar}
                        name="firstname"
                        type="text"
                        className="form-control inp"
                        placeholder="" />
                    <label className="labels">Ism</label>
                </div>
            </div>
            <div className="row" style={{ padding: "15px 0" }}>
                <div className="col-md-6 input_box" data-aos="fade-right">
                    <input
                        onChange={changeHandlar}
                        name="fathername"
                        type="text"
                        className="form-control inp"
                        placeholder=""
                    />
                    <label className="labels">Otasining ismi</label>
                </div>
                <div className="col-md-6 input_box" data-aos="fade-left">
                    <input
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
                <div className="col-md-6" data-aos="zoom-out">
                    <div className="form-group">
                        {/* <label className="text-muted mandatory d-block">Jinsi</label> */}
                        <div className="btn-group" data-toggle="buttons">
                            <div className="wrapper">
                                <input
                                    className="input"
                                    id="erkak"
                                    onChange={changeHandlar}
                                    name="gender"
                                    type="radio"
                                    defaultValue="man"
                                />
                                <label
                                    className={client.gender === "man" ? "label clabel" : "label"}
                                    for="erkak"
                                >
                                    Erkak
                                </label>
                                <input
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
                <div className="col-md-6 input_box" data-aos="fade-left">
                    <input
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
                <div className="col-md-12" data-aos="zoom-out" >
                    <label className="labels">qayta tanlaganda narx va vaqt o'chib ketadi
                    </label>
                    <Select
                        className="mt-3"
                        onChange={(event) => changeSections(event)}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        isMulti
                        options={[
                            { value: 'Lor', label: 'Lor' },
                            { value: 'Kardiolog', label: 'Kardilog' },
                            { value: 'Terapevt', label: 'Terapevt' }
                        ]}
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
                                        defaultValue={section.price}
                                        onChange={createSections}
                                        id={key}
                                        type="number"
                                        name={section.name}
                                        className="form-control"
                                        placeholder={section.name + " summasi"}
                                    />
                                </div>
                                {/* <div className="col-5" >
                                    <label className="text-muted mandatory">{ } navbati</label>
                                    <input
                                        // onChange={changeHandlar}
                                        type="number"
                                        className="form-control"
                                        placeholder="section"
                                        value={section.turn}
                                        disabled
                                    />
                                </div> */}
                                <div className="col-md-4 col-sm-6">
                                    <label className=""> Kelish vaqti
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
                                    <label className=""></label>
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
            {/* <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="text-muted mandatory d-block">Maqsad</label>
                        <div className="btn-group" data-toggle="buttons">
                            <label htmlFor="intact" className="btn btn-primary form-check-label">
                                <input
                                    onChange={changeHandlar}
                                    name="intact"
                                    className="form-check-input"
                                    type="radio"
                                    defaultValue="Ko`rik"
                                />
                                Ko`rik
                            </label>
                            <label htmlFor="intact" className="btn btn-primary form-check-label">
                                <input
                                    onChange={changeHandlar}
                                    defaultValue="Davolanish"
                                    name="intact"
                                    className="form-check-input"
                                    type="radio"
                                />
                                Davolanish
                            </label>
                        </div>
                    </div>
                </div>

            </div> */}
            <div className="mt-3 text-center" data-aos="fade-up">
                <button
                    onClick={checkData}
                    className="btn btn-primary profile-button"
                >
                    Saqlash
                </button>
            </div>
        </>
    )
}
