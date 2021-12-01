import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Loader } from '../components/Loader'
import { CheckClentData } from './CreateCleint/CheckClentData'
import { AuthContext } from '../context/AuthContext'


toast.configure()
export const EditClient = () => {
    const auth = useContext(AuthContext)
    const clientId = useParams().id
    const { loading, request, error, clearError } = useHttp()
    const [form, setForm] = useState({
        firstname: "",
        lastname: "",
        fathername: "",
        gender: "",
        phone: "",
        id: 0,
        born: "",
    })

    const getClient = useCallback(async () => {
        try {
            console.log("salom");
            const data = await request(`/api/clients/reseption/${clientId}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setForm({
                firstname: data.firstname,
                lastname: data.lastname,
                fathername: data.fathername,
                gender: data.gender,
                phone: data.phone,
                id: data.id,
                born: data.born
            })
        } catch (e) {
        }
    }, [request, clientId])

    const changeHandlar = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const notify = (e) => {
        toast.error(e)
    }

    const history = useHistory()

    const changeDate = (event) => {
        setForm({ ...form, born: new Date(event.target.value) })
    }

    const checkData = () => {
        if (CheckClentData(form)) {
            return notify(CheckClentData(form))
        }
        createHandler()
    }

    const createHandler = async () => {
        try {
            const data = await request(`/api/clients/reseption/${clientId}`, 'PATCH', { ...form }, {
                Authorization: `Bearer ${auth.token}`
            })
            notify(data)
            history.push('/reseption/clients')
        } catch (e) {

        }
    }

    useEffect(() => {
        if (error) {
            notify(error)
            clearError()
        }
        if (form === '') {
            if (form.firstname === "") {
                getClient()
            }
        }
        }, [error, clearError, getClient, form])
    
    if (loading) {
        return <Loader />
    }

    return (
        <div className="container rounded bg-white mt-5 mb-5">
            <div className="row">
                <div className="col-md-5 border-right offset-3">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6 input_box" data-aos="fade-right">
                                <input
                                    defaultValue={form.lastname}
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
                                    defaultValue={form.firstname}
                                    onChange={changeHandlar}
                                    name="firstname"
                                    type="text"
                                    className="form-control inp"
                                    placeholder="" />
                                <label className="labels">Ism</label>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6 input_box" data-aos="fade-right">
                                <input
                                    defaultValue={form.fathername}
                                    onChange={changeHandlar}
                                    name="fathername"
                                    type="text"
                                    className="form-control inp"
                                    placeholder=""
                                />
                                <label className="labels">Otasining ismi</label>
                            </div>
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
                                                className={form.gender === "man" ? "label clabel" : "label"}
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
                                                className={form.gender === "woman" ? "label clabel" : "label"}
                                                for="ayol"
                                            >
                                                Ayol
                                                Ayol
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6 input_box" data-aos="fade-right">


                                <input
                                    defaultValue={form.phone}
                                    name="phone"
                                    onChange={changeHandlar}
                                    type="number"
                                    className="form-control inp"
                                    placeholder=""
                                />
                                <label className="labels">
                                    Telefon raqami
                                </label>
                            </div>
                            <div className="col-md-6 input_box" data-aos="fade-left">


                                <input
                                    onChange={changeDate}
                                    value={new Date(form.born).getFullYear().toString() + '-' + (new Date(form.born).getMonth() < 9 ? "0" + (new Date(form.born).getMonth() + 1).toString() : (new Date(form.born).getMonth() + 1).toString()) + '-' + (new Date(form.born).getDate() < 10 ? "0" + (new Date(form.born).getDate()).toString() : (new Date(form.born).getDate()).toString())}
                                    type="date"
                                    name='born'
                                    className="form-control inp"
                                    placeholder=""
                                />
                                <label className="labels">
                                    Tug'ilgan kuni
                                </label>
                            </div>

                        </div>
                        <div className="mt-5 text-center" data-aos="fade-up">
                            <button
                                onClick={checkData}
                                className="btn btn-primary profile-button"
                                type="button"
                            >
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}