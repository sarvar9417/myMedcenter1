import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify"
import {Loader} from '../../components/Loader'

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
            history.push('/director')
        } catch (e) {
            notify(e)
        }
    }

    const notify = (e) => {
        toast.error(e)
    }
    useEffect(() => {
        if (!directions) {
            getAllDirections()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [getAllDirections, notify, clearError])

    if (loading) {
        return <Loader />
    }
    return (
        <div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="text-end p-3">
                                <Link to="/director/adddirection" className="btn button-success">Bo'lim yaratish</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Xizmat nomi</th>
                                            <th className="text-center">Xizmat narxi</th>
                                            <th className="text-center">Xizmat turi</th>
                                            <th className="text-center">Xizmat xonasi</th>
                                            <th className="text-center">Tahrirlash</th>
                                            <th className="text-center">O'chirish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            directions && directions.map((direction) => {
                                                return (
                                                    <tr>
                                                        <td className="text-center">
                                                            <span className="table-avatar">
                                                                <span href="profile.html">{direction.section}</span>
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{direction.price} sum</td>
                                                        <td className="text-center">{direction.subsection}</td>
                                                        <td className="text-center">{direction.room}</td>
                                                        <td className="text-center"> <Link to={`/director/directionedit/${direction._id}`} className="btn button-success  px-3" ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> </Link></td>
                                                        <td className="text-center"> <button onClick={() => { setRemove(direction); window.scrollTo({top:0}) ; setModal(true) }} className="btn button-danger px-3" ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> </button></td>
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
