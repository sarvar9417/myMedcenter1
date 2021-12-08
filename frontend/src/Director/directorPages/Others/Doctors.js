import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'

export const Doctors = () => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [doctors, setDoctors] = useState([])

    const getDoctors = useCallback(async () => {
        try {
            const fetch = await request('/api/auth/doctor/director', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDoctors(fetch)
        } catch (error) {

        }
    })

    useEffect(() => {
        if (doctors.length === 0) {
            getDoctors()
        }
    }, [getDoctors])
    return (
        <div>
            <div className="row p-3">
                <div className="col-12 text-end">
                        <Link to="/director/adddoctor" className="btn btn-success">
                            Shifokor qo'shish
                        </Link>
                </div>
            </div>
            <div className="row">
                {
                    doctors && doctors.map((doctor) => {
                        return (
                            <div className="col-lg-3 col-md-4 col-sm-6" >
                                <div className="card">
                                    <div className="card-header" >
                                        <img className="card-image img-fluid" src={doctor.image} />
                                    </div>
                                    <div className="card-body">
                                        <h5> {doctor.lastname} {doctor.firstname} {doctor.fathername}</h5>
                                        <p>{new Date(doctor.born).toLocaleDateString()}</p>
                                        <p>+{doctor.phone}</p>
                                        <h6>{doctor.section}</h6>
                                    </div>
                                    <div className="card-footer">
                                        <Link to={`/director/editdoctor/${doctor._id}`} className="btn btn-primary">
                                            Tahrirlash
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>

    )
}
