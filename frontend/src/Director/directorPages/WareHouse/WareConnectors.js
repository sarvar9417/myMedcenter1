import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckAddWare } from './CheckAddWare'
import { Loader } from '../../components/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select'

toast.configure()
export const WareConnector = () => {
    const auth = useContext(AuthContext)
    const { request, error, loading, clearError } = useHttp()
    const history = useHistory()
    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [remove, setRemove] = useState()
    //Ware ma'lumotlari
    const [warehouses, setWareHouses] = useState()
    const [sections, setSections] = useState()
    const [wareconnectors, setWareConnectors] = useState()
    const [wareconnector, setWareConnector] = useState({
        section: "",
        sectionname: "",
        warehouse: "",
        warehousename: "",
        count: 0
    })
    const getWareHouses = useCallback(async () => {
        try {
            const fetch = await request(`/api/warehouse`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let s = []
            fetch.map(f => {
                s.push({
                    warehousename: f.name + " " + f.type,
                    value: f.name + " " + f.type,
                    label: f.name + " " + f.type,
                    warehouse: f._id
                })
            })
            setWareHouses(s)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setWareHouses])

    const getSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/direction`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let s = []
            fetch.map(f => {
                s.push({
                    sectionname: f.value,
                    value: f.value,
                    label: f.value,
                    section: f._id
                })
            })
            setSections(s)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setSections])

    const getWareConnectors = useCallback(async () => {
        try {
            const fetch = await request(`/api/wareconnector`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setWareConnectors(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setWareConnectors])

    const setCount = (event) => {
        setWareConnector({ ...wareconnector, count: parseInt(event.target.value) })
    }
    const checkWare = () => {
        window.scrollTo({ top: 0 })
        setModal(true)
    }
    const createHandler = async () => {
        try {
            const data = await request(`/api/wareconnector/register`, "POST", { ...wareconnector }, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (e) {
            notify(e)
        }
    }
    const changeWareHouse = (event) => {
        setWareConnector({ ...wareconnector, warehousename: event.value, warehouse: event.warehouse })
    }
    const changeSections = (event) => {
        setWareConnector({ ...wareconnector, sectionname: event.value, section: event.section })
    }

    const Delete = async (id) => {
        try {
            const data = await request(`/api/wareconnector/${id}`, "DELETE", null, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (e) {
            notify(e)
        }
    }

    const notify = (e) => {
        toast.error(e)
    }
    useEffect(() => {
        if (!wareconnectors) {
            getWareConnectors()
        }
        if (!sections) {
            getSections()
        }
        if (!warehouses) {
            getWareHouses()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Mahsulot nomi</th>
                                            <th className="text-center">Xizmat nomi</th>
                                            <th className="text-center" >Xarajat qiymati</th>
                                            <th className="text-center">Qo'shish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center px-3">
                                                <Select
                                                    menuPortalTarget={document.body}
                                                    onChange={(event) => changeWareHouse(event)}
                                                    options={warehouses && warehouses}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                            </td>
                                            <td className="text-center px-3">
                                                <Select
                                                    menuPortalTarget={document.body}
                                                    onChange={(event) => changeSections(event)}
                                                    options={sections && sections}
                                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                />
                                            </td>
                                            <td className="text-center" ><input onChange={setCount} style={{ width: "100px" }} defaultValue={wareconnector.count} type="number" name="pieces" className="addDirection" /></td>
                                            <td className="text-center"><button onClick={checkWare} className='btn button-success'>Qo'shish</button> </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                                        <tr>
                                            <th className="text-center">№</th>
                                            <th className=""> Mahsulot nomi</th>
                                            <th className="text-center"> Xizmat nomi</th>
                                            <th className="text-center">Xarajat qiymati</th>
                                            <th className="text-center">O'chirish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            wareconnectors && wareconnectors.map((ware, index) => {
                                                return (
                                                    <tr>
                                                        <td className="">{index + 1}</td>
                                                        <td className="text-bold text-success">
                                                            <span className="table-avatar">
                                                                <span href="profile.html" >{ware.warehousename}</span>
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{ware.sectionname}</td>
                                                        <td className="text-center">{ware.count}</td>
                                                        <td className="text-center"> <button onClick={() => { setRemove(ware); window.scrollTo({ top: 0 }); setModal2(true) }} className="btn button-danger px-3" ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> </button></td>
                                                    </tr>)
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Mahsulot nomi</th>
                                            <th className="text-center">Xizmat nomi</th>
                                            <th className="text-center">Xarajat qoymati</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <span className="table-avatar">
                                                    <span href="profile.html"> {wareconnector.warehousename} </span>
                                                </span>
                                            </td>
                                            <td className="text-center">{wareconnector.sectionname}</td>
                                            <td className="text-center">{wareconnector.count}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className=" text-center">
                                <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={modal2 ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Mahsulot nomi</th>
                                            <th className="text-center">Xizmat nomi</th>
                                            <th className="text-center">Xizmat qiymati</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <span className="table-avatar">
                                                    <span href="profile.html">{remove && remove.warehousename}</span>
                                                </span>
                                            </td>
                                            <td className="text-center">{remove && remove.sectionname}</td>
                                            <td className="text-center">{remove && remove.count}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className=" text-center">
                                <button onClick={() => { Delete(remove._id) }} className="btn button-success" style={{ marginRight: "30px" }}>Bog'lanishni o'chirish</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>



                </div>
            </div>

        </div >
    )
}
