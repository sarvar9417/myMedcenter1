import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'

toast.configure()
export const Doctors = () => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [doctors, setDoctors] = useState()
    const notify = (e)=>{
        toast.error(e)
    }

    const getDoctors = useCallback(async () => {
        try {
            const fetch = await request('/api/auth/doctor/director', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDoctors(fetch)
        } catch (error) {
            notify(error)
        }
    })

    useEffect(() => {
        if (!doctors) {
            getDoctors()
        }
    }, [getDoctors])
    return (
        <div>
            <div className="row p-3">
                <div className="col-12 text-end">
                    <Link to="/director/adddoctor" className="btn button-success">
                        Shifokor qo'shish
                    </Link>
                </div>
            </div>
            <div className="card" style={{minWidth:"800px"}}>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }} >
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className="text-center" scope="col">#</th>
                            <th className="text-center" scope="col">Surati</th>
                            <th className="text-center" scope="col">F.I.SH</th>
                            <th className="text-center" scope="col">Ixtisosligi</th>
                            <th className="text-center" scope="col">Tu'gilgan yili</th>
                            <th className="text-center" scope="col">Telefon raqami</th>
                            <th className="text-center" scope="col">Tahrirlash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            doctors && doctors.map((doctor, index) => {
                                return (
                                    <tr key={index}>
                                        <th className="text-center" >{index+1}</th>
                                        <td className="text-center"> <img src={doctor.image} width="35px" height="35px" className="rounded-circle" /> </td>
                                        <td className="text-center"> <Link to={`/director/doctorprocient/${doctor._id}`} >{doctor.lastname} {doctor.firstname} {doctor.fathername}</Link> </td>
                                        <td className="text-center">{doctor.section}</td>
                                        <td className="text-center">{new Date(doctor.born).toLocaleDateString()}</td>
                                        <td className="text-center">+{doctor.phone}</td>
                                        <td className="text-center">
                                            <Link to={`/director/editdoctor/${doctor._id}`} className="btn" style={{ backgroundColor: "rgba(15, 183, 107, 0.12", color: "#26af48"}}>
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
