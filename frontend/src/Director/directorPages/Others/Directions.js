import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify"

toast.configure()
export const Directions = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const [directions, setDirections] = useState()
    const [remove, setRemove] = useState()
    const history = useHistory()
    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)

    const getAllDirections = useCallback(async () => {
        try {
            const fetch = await request(`/api/direction`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDirections(fetch)
        } catch (e) {

        }
    }, [request, auth, setDirections])

    const Delete = async (id) => {
        try {
            const data = await request(`/api/direction/${id}`, "DELETE", null, {
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

    //=================================================================================
    //=================================================================================
    //=================================================================================
    // Tovar nomi bilan qidirish
    const [directionName, setDirectionName] = useState()
    const searchDirection = useCallback(async () => {
        try {
            const fetch = await request(`/api/direction/${directionName}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDirections(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, directionName, setDirections])

    useEffect(() => {
        if (!directions) {
            getAllDirections()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [getAllDirections, notify, clearError])


    return (
        <div>
            <div className="row" style={{ height: "40vh" }}>
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className='row mb-3'>
                                <div className='col-2 '>
                                    <input onChange={(event) => { setDirectionName(event.target.value) }} className='form-control' placeholder='Xizmat nomini' />
                                </div>
                                <div className='col-1'>
                                    <button onClick={searchDirection} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}><FontAwesomeIcon icon={faSearch} /></button>
                                </div>
                                <div className='col-2'>
                                    <button onClick={getAllDirections} className="btn text-white" style={{ backgroundColor: "#45D3D3" }}>Barcha Xizmatlar </button>
                                </div>
                                <div className="col-3 offset-4 text-end">
                                    <Link to="/director/adddirection" className=" mx-4 btn button-success">Bo'lim yaratish</Link>
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">№</th>
                                            <th className="text-center">Xizmat nomi</th>
                                            <th className="text-center">Xizmat narxi</th>
                                            <th className="text-center">Xizmat turi</th>
                                            <th className="text-center">Xizmat xonasi</th>
                                            <th className="text-center">Doctor ulushi</th>
                                            <th className="text-center">Medpristovitel ulushi</th>
                                            <th className="text-center">Tavsiya etgan doctor ulushi</th>
                                            <th className="text-center">Tahrirlash</th>
                                            <th className="text-center">O'chirish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            directions && directions.map((direction, index) => {
                                                return (
                                                    <tr>
                                                        <td className="">{index + 1}</td>
                                                        <td className="text-bold">
                                                            <span className="table-avatar">
                                                                <span href="profile.html">{direction.section}</span>
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{direction.price} sum</td>
                                                        <td className="text-bold">{direction.subsection}</td>
                                                        <td className="text-center">{direction.room}</td>
                                                        <td className="text-center">{direction.doctorProcient}</td>
                                                        <td className="text-center">{direction.counteragentProcient}</td>
                                                        <td className="text-center">{direction.counterDoctor}</td>
                                                        <td className="text-center"> <Link to={`/director/directionedit/${direction._id}`} className="btn button-success  px-3" ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> </Link></td>
                                                        <td className="text-center"> <button onClick={() => { setRemove(direction); window.scrollTo({ top: 0 }); setModal(true) }} className="btn button-danger px-3" ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> </button></td>
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


            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">

                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Xizmat nomi</th>
                                            <th className="text-center">Xizmat narxi</th>
                                            <th className="text-center">Xizmat turi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <span className="table-avatar">
                                                    <span href="profile.html">{remove && remove.section}</span>
                                                </span>
                                            </td>
                                            <td className="text-center">{remove && remove.price} sum</td>
                                            <td className="text-center">{remove && remove.subsection}</td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className=" text-center">
                                <button onClick={() => { Delete(remove._id) }} className="btn button-success" style={{ marginRight: "30px" }}>Xizmatni o'chirish</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
