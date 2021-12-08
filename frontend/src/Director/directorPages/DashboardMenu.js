import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { AddDoctor } from './Others/AddDoctor'

const mongoose = require('mongoose')

export const DashboardMenu = () => {
    const [client, setClient]= useState(0)
    let price = 0
    const auth = useContext(AuthContext)
    const { request } = useHttp()

    const [clients, setClients] = useState([])
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

    const getAllSections = useCallback(async () => {
        try {
            const fetch = await request(`/api/section/director`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            let i = 0
            let price = 0
             fetch.map((section) => {
                if (
                    new Date(section.bronDay).toLocaleDateString() === new Date().toLocaleDateString()
                ) {
                    i++
                    price = price + section.priceCashier
                }
            })
            setClient(i)
            setPriceToday(price)
            setSections(fetch)
        } catch (e) {

        }
    }, [request, auth, setSections, setPriceToday])

    useEffect(() => {
        if (sections.length === 0) {
            getAllSections()
            getAllClients()
        }
    }, [getAllClients, getAllSections, sections])


    return (
        <div >
            <div className="row">
                <div className="col-lg-3 col-6">
                    {/* small box */}
                    <Link to={`/director`} className="small-box bg-info">
                        <div className="inner">
                            <h3>{ client } <span className="float-end"> </span></h3>
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
                            <h3>{priceToday}<span className="float-end" >{client}</span></h3>
                            <p>Tushum {new Date().toLocaleDateString()} <span className="float-end" >Xizmatlar</span></p>
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
                        <div className="inner">
                            <h3>44</h3>
                            <p>User Registrations</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-person-add" />
                        </div>
                        <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                    </Link>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                    {/* small box */}
                    <div className="small-box bg-danger">
                        <div className="inner">
                            <h3>65</h3>
                            <p>Unique Visitors</p>
                        </div>
                        <div className="icon">
                            <i className="ion ion-pie-graph" />
                        </div>
                        <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
                    </div>
                </div>
                {/* ./col */}
            </div>
            <AddDoctor/>
        </div>
    )
}
