import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { toast } from "react-toastify"


export const DashboardMenu = () => {
    const [client, setClient] = useState(0)
    let price = 0
    const auth = useContext(AuthContext)
    const { request, error, loading, clearError } = useHttp()

    const [clients, setClients] = useState([])
    const [directions, setDirections] = useState(0)
    const [doctors, setDoctors] = useState(0)
    const [sections, setSections] = useState([])
    const [priceToday, setPriceToday] = useState(0)
    const getAllClients = useCallback(async () => {
        try {
            const fetch = await request(`/api/clients/director`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setClients(fetch)
        } catch (e) {

        }
    }, [request, auth, setClients])

    const getAllDirections = useCallback(async () => {
        try {
            const fetch = await request(`/api/direction`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDirections(fetch.length)
        } catch (e) {

        }
    }, [request, auth, setDirections])

    const getAllDoctors = useCallback(async () => {
        try {
            const fetch = await request(`/api/auth/doctor/director`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setDoctors(fetch.length)
        } catch (e) {

        }
    }, [request, auth, setDoctors])

    const getAllSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/director`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let i = 0
            let k = 0
            let price = 0
            fetch.map((section) => {
                if (
                    new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()
                    &&
                    section.done === "tasdiqlangan"
                ) {
                    i++
                }
                if (
                    new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()
                    &&
                    (section.payment === "to'langan" || section.commentCashier.length >6)
                ) {
                    price = price + section.priceCashier
                }
            })
            setClient(i)
            setPriceToday(price)
            setSections(fetch)
        } catch (e) {

        }
    }, [request, auth, setSections, setPriceToday])

    const notify = (e) => {
        toast.error(e)
    }
    useEffect(() => {
        if (sections.length === 0) {
            getAllSections()
            getAllClients()
            getAllDirections()
            getAllDoctors()
        }
        if (error) {
            notify()
            clearError()
        }
    }, [getAllClients, getAllSections, sections, getAllDirections, getAllDoctors])

    return (
        <div  >
            <div className="row mt-3">
                <div className="col-lg-3 col-6">
                    {/* small box */}
                    <Link to={`/director`} className="small-box bg-info">
                        <div className="inner">
                            <h3>{client} <span className="float-end"> </span></h3>
                            <p>Xizmatlar {new Date().toLocaleDateString()}</p>
                        </div>

                        <div className="icon">
                            <i className="ion ion-bag" />
                        </div>
                        <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
                    </Link>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                    {/* small box */}
                    <Link to='/director/info' className="small-box bg-success">
                        <div className="inner">
                            <h3>{priceToday}</h3>
                            <p>Tushum {new Date().toLocaleDateString()} </p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-stats-bars" />
                        </div>
                        <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
                    </Link>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                    {/* small box */}
                    <Link to='/director/doctors' className="small-box bg-warning">
                        <div className="inner text-white">
                            <h3>{doctors}</h3>
                            <p>Shifokorlar</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-person-add" />
                        </div>
                        <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
                    </Link>
                </div>
                <div className="col-lg-3 col-6">
                    <Link to="/director/directions" className="small-box bg-danger">
                        <div className="inner">
                            <h3>{directions && directions}</h3>
                            <p>Xizmat turlari</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-pie-graph" />
                        </div>
                        <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
                    </Link>
                </div>
            </div>
            <hr />
        </div>
    )
}