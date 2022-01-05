import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify"
import { Loader } from '../../components/Loader'

toast.configure()
export const Rooms = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const [rooms, setRooms] = useState()
    const [remove, setRemove] = useState()

    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)

    const getAllRooms = useCallback(async () => {
        try {
            const fetch = await request(`/api/rooms`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setRooms(fetch)
        } catch (e) {

        }
    }, [request, auth, setRooms])


    const Delete = async (id) => {
        try {
            const data = await request(`/api/rooms/${id}`, "DELETE", null, {
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
        if (!rooms) {
            getAllRooms()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [getAllRooms, notify, clearError])

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
                                <Link to="/director/createroom" className="btn button-success">Xona yaratish</Link>
                            </div>
                            <div className="table-responsive tableFixHead" >
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">№</th>
                                            <th className=""> Xona nomi(raqami)</th>
                                            <th className="text-center">Turi</th>
                                            <th className="text-center">Narxi</th>
                                            <th className="text-center">Koyka</th>
                                            <th className="text-center">Holati</th>
                                            <th className="text-center">Tahrirlash</th>
                                            <th className="text-center">O'chirish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            rooms && rooms.map((room, index) => {
                                                return (
                                                    <tr>
                                                        <td className="">{index + 1}</td>
                                                        <td className="text-bold ">
                                                            <span className="table-avatar">
                                                                <span href="profile.html" ><Link className='text-success' to={`/director/roomhistory/${room.value}`}>{room.room}</Link> </span>
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{room.roomtype}</td>
                                                        <td className="text-end ">{room.price} so'm</td>
                                                        <td className="text-center">{room.bed}</td>
                                                        <td className="text-center">{room.position}</td>
                                                        <td className="text-center"> <Link to={`/director/editroom/${room._id}`} className="btn button-success  px-3" ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> </Link></td>
                                                        <td className="text-center"> <button onClick={() => { setRemove(room); window.scrollTo({ top: 0 }); setModal(true) }} className="btn button-danger px-3" ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> </button></td>
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
                                            <th className="text-center">Xona nomi(raqami)</th>
                                            <th className="text-center">Turi</th>
                                            <th className="text-center">Narxi</th>
                                            <th className="text-center">Koyka</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <span className="table-avatar">
                                                    <span href="profile.html">{remove && remove.room}</span>
                                                </span>
                                            </td>
                                            <td className="text-center">{remove && remove.roomtype}</td>
                                            <td className="text-center">{remove && remove.price} so'm</td>
                                            <td className="text-center">{remove && remove.bed}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className=" text-center">
                                <button onClick={() => { Delete(remove._id) }} className="btn button-success" style={{ marginRight: "30px" }}>Xonani o'chirish</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>



                </div>
            </div>

        </div>

    )
}
