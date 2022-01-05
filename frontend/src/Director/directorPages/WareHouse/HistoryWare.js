import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from "react-toastify"
import { Loader } from '../../components/Loader'
const mongoose = require('mongoose')

toast.configure()
export const HistoryWare = () => {
    const auth = useContext(AuthContext)
    const wareName = useParams().ware
    const { request, loading, error, clearError } = useHttp()
    const [ware, setWare] = useState()

    const getWares = useCallback(async () => {
        try {
            const fetch = await request(`/api/warehouse/wares/${wareName}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setWare(fetch)
        } catch (e) {
            notify(e)
        }
    }, [request, auth, setWare, wareName])

    const notify = (e) => {
        toast.error(e)
    }
    useEffect(() => {
        if (!ware) {
            getWares()
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
                                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }} >
                                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                                        <tr>
                                            <th className="text-center">№</th>
                                            <th className="text-center">Qo'shilgan vaqti</th>
                                            <th className="">Mahsulot nomi</th>
                                            <th className="text-center">Turi</th>
                                            <th className="text-center">Narxi</th>
                                            <th className="text-center">Soni</th>
                                            <th className="text-center">Izoh</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ware && ware.map((w, index) => {
                                                return (
                                                    <tr>
                                                        <td className="">{index + 1}</td>
                                                        <td className="text-center">{new mongoose.Types.ObjectId(w._id).getTimestamp().toLocaleDateString()}</td>
                                                        <td className="text-bold ps-3">
                                                            <span className="table-avatar">
                                                                <span href="profile.html" >{w.name}</span>
                                                            </span>
                                                        </td>
                                                        <td className="text-center">{w.type}</td>
                                                        <td className="text-end pe-3">{w.price} so'm</td>
                                                        <td className="text-center">{w.pieces}</td>
                                                        <td className="text-center">{w.comment}</td>
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
        </div>

    )
}
