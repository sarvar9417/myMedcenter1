import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenAlt } from '@fortawesome/free-solid-svg-icons'

toast.configure()
export const CounterDoctors = () => {
    const auth = useContext(AuthContext)
    const { request, error, clearError } = useHttp()
    const [counterdoctors, setCounterDoctors] = useState()
    const [modal, setModal] = useState(false)
    const [doctorId, setDoctorId] = useState()
    const notify = (e) => {
        toast.error(e)
    }

    const getCounterDoctors = useCallback(async () => {
        try {
            const fetch = await request('/api/counterdoctor/', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setCounterDoctors(fetch)
        } catch (error) {
            notify(error)
        }
    }, [auth, request, setCounterDoctors, notify])

    const Delete = useCallback(async () => {
        const fetch = request(`/api/counterdoctor/${doctorId && doctorId}`, 'DELETE', null, {
            Authorization: `Bearer ${auth.token}`
        })
        window.location.reload()
    }, [doctorId])

    useEffect(() => {
        if (!counterdoctors) {
            getCounterDoctors()
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
                    <Link to="/director/addcounterdoctor" className="btn button-success">
                        Shifokor yaratish
                    </Link>
                </div>
            </div>
            <div className="card" style={{ minWidth: "800px" }}>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }} >
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className="text-center" scope="col">№</th>
                            <th className="text-center" scope="col">F.I.SH</th>
                            <th className="text-center" scope="col">Klinikasi</th>
                            <th className="text-center" scope="col">Kontragent</th>
                            <th className="text-center" scope="col">Tahrirlash</th>
                            <th className="text-center" scope="col">O'chirish</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            counterdoctors && counterdoctors.map((doctor, index) => {
                                return (
                                    <tr key={index}>
                                        <th className="text-center" >{index + 1}</th>
                                        <td className="ps-3"> <Link className='text-success' style={{ fontWeight: "600" }} to={`/director/counterdoctorprocient/${doctor._id}`} >{doctor.lastname} {doctor.firstname} {doctor.fathername}</Link> </td>
                                        <td className="text-center">{doctor.clinic}</td>
                                        <td className="text-center">{doctor.counteragentname}</td>
                                        <td className="text-center">
                                            <Link to={`/director/editcounterdoctor/${doctor._id}`} className="btn" style={{ backgroundColor: "rgba(15, 183, 107, 0.12", color: "#26af48" }}>
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </Link>
                                        </td>
                                        <td className="text-center">
                                            <button onClick={() => { setDoctorId(doctor._id); setModal(true); }} className="btn button-danger">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card" style={{ maxWidth: "600px" }} >
                    <div className="" >
                        <div className="card" >
                            <div className="card-header">
                                <h6 className="text-danger">
                                    Diqqat! Counterdoctorga tegishli barcha shifokorlar ham o'chiriladi. Counter doctorni o'chirilishini tasdiqlaysizmi?
                                </h6>
                            </div>
                            <div className="card-footer text-center">
                                <button onClick={Delete} className="btn button-success mb-2" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger mb-2" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
