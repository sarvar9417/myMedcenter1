import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'
import { toast } from "react-toastify"


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

export const Directions = () => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [directions, setDirections] = useState([])
    const [remove, setRemove] = useState()
    const history = useHistory()



    // Modal oyna funksiyalari
    const [modalIsOpen, setIsOpen] = useState(false)

    function openModal() {
        setIsOpen(true)
    }

    function closeModal() {
        setIsOpen(false)
    }

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
        if (directions.length === 0) {
            getAllDirections()
        }
    }, [getAllDirections])
    return (
        <div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="text-end p-3">
                                <Link to="/director/adddirection" className="btn btn-success">Bo'lim yaratish</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">Xizmat nomi</th>
                                            <th className="text-center">Xizmat narxi</th>
                                            <th className="text-center">Xizmat turi</th>
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
                                                                <span href="profile.html">{direction.label}</span>
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{direction.price} sum</td>
                                                        <td className="text-center">{direction.subvalue}</td>
                                                        <td className="text-center"> <Link to={`/director/directionedit/${direction._id}`} className="btn btn-success text-white px-3" ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> </Link></td>
                                                        <td className="text-center"> <button onClick={() => { setRemove(direction); openModal() }} className="btn btn-danger text-white px-3" ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> </button></td>
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


            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

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
                                                    <span href="profile.html">{remove && remove.label}</span>
                                                </span>
                                            </td>
                                            <td className="text-center">{remove && remove.price} sum</td>
                                            <td className="text-center">{remove && remove.subvalue}</td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="row m-1">
                        <div className="col-12 text-center">
                            <button onClick={() => { Delete(remove._id) }} className="btn btn-success" style={{ marginRight: "30px" }}>Xizmatni o'chirish</button>
                            <button onClick={closeModal} className="btn btn-danger" >Qaytish</button>
                        </div>
                    </div>

                </Modal>
            </div>

        </div>

    )
}
