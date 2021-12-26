import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'

toast.configure()
export const Advertisements = () => {
    const auth = useContext(AuthContext)
    const { request, error, clearError } = useHttp()
    const [advertisements, setAdvertisements] = useState()
    const notify = (e) => {
        toast.error(e)
    }

    const getAdvertisements = useCallback(async () => {
        try {
            const fetch = await request('/api/source/', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setAdvertisements(fetch)
        } catch (error) {
            notify(error)
        }
    }, [auth, request, setAdvertisements, notify])

    useEffect(() => {
        if (!advertisements) {
            getAdvertisements()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    return (
        <div>
            <div className="row p-3">
                <div className="col-12 text-end">
                    <Link to="/director/addadvertisements" className="btn button-success">
                        Reklama yaratish
                    </Link>
                </div>
            </div>
            <div className="card" style={{ minWidth: "800px" }}>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }} >
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className="text-center" scope="col">№</th>
                            <th className="text-center" scope="col">Nomi</th>
                            <th className="text-center" scope="col">Tahrirlash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            advertisements && advertisements.map((agent, index) => {
                                return (
                                    <tr key={index}>
                                        <th className="text-center" >{index + 1}</th>
                                        <td className="ps-3"> <Link className='text-success' style={{ fontWeight: "600" }} to={`/director/clientsadvertisiments/${agent._id}`} >{agent.name}</Link> </td>
                                        <td className="text-center">
                                            <Link to={`/director/editadvertisement/${agent._id}`} className="btn" style={{ backgroundColor: "rgba(15, 183, 107, 0.12", color: "#26af48" }}>
                                                Tahrirlash
                                            </Link></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
            </div>
        </div>

    )
}
