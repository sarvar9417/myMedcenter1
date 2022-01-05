import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { toast } from "react-toastify"
import { Loader } from '../../components/Loader'

toast.configure()
export const WareHouse = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const [warehouse, setWareHouse] = useState()
    const [remove, setRemove] = useState()
    const history = useHistory()



    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)

    const getAllWareHouse = useCallback(async () => {
        try {
            const fetch = await request(`/api/warehouse`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setWareHouse(fetch)
        } catch (e) {

        }
    }, [request, auth, setWareHouse])


    const Delete = async (id) => {
        try {
            const data = await request(`/api/warehouse/${id}`, "DELETE", null, {
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
        if (!warehouse) {
            getAllWareHouse()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [ notify, clearError])

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
                                <Link to="/director/createware" className="btn button-success">Mahsulot yaratish</Link>
                            </div>
                            <div className="table-responsive">
                                <table className="datatable table table-hover table-center mb-0">
                                    <thead>
                                        <tr>
                                            <th className="text-center">№</th>
                                            <th className=""> Mahsulot nomi</th>
                                            <th className="text-center">Turi</th>
                                            <th className="text-center">Narxi</th>
                                            <th className="text-center">Soni</th>
                                            <th className="text-center">Qo'shish yoki olish</th>
                                            <th className="text-center">O'chirish</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            warehouse && warehouse.map((ware, index) => {
                                                return (
                                                    <tr>
                                                        <td className="">{index + 1}</td>
                                                        <td className="text-bold ">
                                                            <span className="table-avatar">
                                                                <span href="profile.html" ><Link className='text-success' to={`/director/warehistory/${ware.value}`}>{ware.name}</Link> </span>
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{ware.type}</td>
                                                        <td className="text-end ">{ware.price} so'm</td>
                                                        <td className="text-center">{ware.pieces}</td>
                                                        <td className="text-center"> <Link to={`/director/addware/${ware._id}`} className="btn button-success  px-3" ><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon> </Link></td>
                                                        <td className="text-center"> <button onClick={() => { setRemove(ware); window.scrollTo({ top: 0 }); setModal(true) }} className="btn button-danger px-3" ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> </button></td>
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
                                            <th className="text-center">Mahsulot nomi</th>
                                            <th className="text-center">Turi</th>
                                            <th className="text-center">Narxi</th>
                                            <th className="text-center">Soni</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                <span className="table-avatar">
                                                    <span href="profile.html">{remove && remove.name}</span>
                                                </span>
                                            </td>
                                            <td className="text-center">{remove && remove.type}</td>
                                            <td className="text-center">{remove && remove.price} so'm</td>
                                            <td className="text-center">{remove && remove.pieces}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className=" text-center">
                                <button onClick={() => { Delete(remove._id) }} className="btn button-success" style={{ marginRight: "30px" }}>Mahsulotni o'chirish</button>
                                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                            </div>
                        </div>
                    </div>



                </div>
            </div>

        </div>

    )
}
