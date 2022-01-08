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

    const [tushum, setTushum] = useState()
    const getAllSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/connector/reseption/${new Date()}/${new Date()}`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            const payments = await request(`/api/payment/director`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let t = 0
            payments.map(p => {
                t = p.total
            })
            setTushum(t)
            let i = 0
            let price = 0
            fetch.sections.map((sections) => {
                sections.map(section => {
                    price = price + section.priceCashier
                })
            })
            fetch.services.map((services) => {
                services.map(service => {
                    price = price + service.priceCashier
                })
            })
            setSections(fetch.sections)
            setClient(i)
            setPriceToday(price)
        } catch (e) {

        }
    }, [request, auth, setSections, setPriceToday, setTushum])

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
    }, [])

    return (
        <div  >
            <div className="row mt-3">
                <div className="col-lg-3 col-6">
                    {/* small box */}
                    <Link to={`/director`} className="small-box bg-info">
                        <div className="inner">
                            <h5>Statistika <span className="float-end"> </span></h5>
                            <div className='row'>
                                <div className='col-6'> {new Date().toLocaleDateString()}</div>
                                <div className='col-6'></div>
                            </div>
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
                            <h5>Kunduzgi</h5>
                            <div className='row'>
                                <div className='col-6'> {new Date().toLocaleDateString()}</div>
                                <div className='col-6 text-end'>{priceToday}</div>
                            </div>
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
                    <Link to='/director/statsionar' className="small-box bg-warning">
                        <div className="inner text-white">
                            <h5>Statsionar</h5>
                            <div className='row'>
                                <div className='col-6'> {new Date().toLocaleDateString()}</div>
                                <div className='col-6 text-end'>{priceToday}</div>
                            </div>
                        </div>
                        <div className="icon">
                            <i className="ion ion-person-add" />
                        </div>
                        <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
                    </Link>
                </div>
                <div className="col-lg-3 col-6">
                    <Link to="/director/payments" className="small-box bg-danger">
                        <div className="inner">
                            <h5>Tushum</h5>
                            <div className='row'>
                                <div className='col-6'> {new Date().toLocaleDateString()}</div>
                                <div className='col-6 text-end'>{tushum && tushum}</div>
                            </div>
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