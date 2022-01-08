import React, { useCallback, useEffect, useState, Component, useContext } from 'react'
import { Loader } from '../components/Loader'
import { useHttp } from '../hooks/http.hook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faSort, faPrint } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import "react-datepicker/dist/react-datepicker.css"
import { AuthContext } from '../context/AuthContext'
const mongoose = require('mongoose')

toast.configure()
export const ClientsPayments = () => {
    //Avtorizatsiyani olish
    const auth = useContext(AuthContext)
    const [modal, setModal] = useState(false)
    let k = 0
    const { loading, request, error, clearError } = useHttp()
    const [all, setAll] = useState()
    const getPayments = useCallback(async () => {
        try {
            const fetch = await request(`/api/payment/directorclients`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })

            setAll(fetch)
        } catch (e) {
        }
    }, [request, auth, setAll])



    useEffect(() => {
        if (!all) {
            getPayments()
        }
    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container m-5 mx-auto" style={{ minWidth: "1250px" }}  >
            <div>
                <div style={{ minWidth: "1100px" }} >
                    <table id="" className="table-striped table-hover" style={{ borderBottom: "1px solid #aaa", marginBottom: "10px" }} >
                        <thead>
                            <tr>
                                <th className="no" scope="no" >№ <FontAwesomeIcon icon={faSort} /> </th>
                                <th scope="" className="date text-center" >Kelgan vaqti <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center" >F.I.Sh <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="date text-center" >Tug'ilgan yili <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="id text-center">ID <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="phone text-center">Tel <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="diagnos text-center">Naqt <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="fish text-center">Plastik <FontAwesomeIcon icon={faSort} /></th>
                                <th scope="" className="cek text-center">Aralash  </th>
                                <th scope="" className="cek text-center"> Umumiy <FontAwesomeIcon icon={faSort} /></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>


            <div className="overflow-auto" style={{ height: "65vh", minWidth: "1100px" }}>
                <table className=" table-hover"  >
                    <tbody className="" >
                        {all && all.clients.map((client, key) => {
                            k++
                            return (
                                <tr key={key} >
                                    <td className="no" >{k}</td>
                                    <td className="date" >{new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleDateString()} {new mongoose.Types.ObjectId(client._id).getTimestamp().toLocaleTimeString()}</td>
                                    <td className="fish text-success text-uppercase" style={{ fontWeight: "600" }} > {all && all.clients[key].lastname} {all && all.clients[key].firstname} {all && all.clients[key].fathername}</td>
                                    <td className="date" >{all && new Date(all.clients[key].born).toLocaleDateString()}</td>
                                    <td className="id" >{all && all.clients[key].id}</td>
                                    <td className="phone">+{all && all.clients[key].phone}</td>
                                    <td className="diagnos ">  {client.diagnosis} </td>
                                    <td scope="" className="fish text-center">
                                        {client.position === "davolanishda" ? <Link className='btn button-success' to={`/cashier/prepayment/${all.clients[key]._id}/${client._id}`}> Qo'shish</Link> : "Xizmat yakunlangan"}
                                    </td>
                                    <td scope="" className="cek text-center">
                                        {client.position === "yakunlangan" ? <Link to={`/cashier/paystatsionar/${all.clients[key]._id}/${client._id}`} className='btn button-danger' >Qabul qilish </Link> : "Xizmat yakunlanmagan"}
                                    </td>
                                    <td scope="" className="cek text-center">
                                        <Link to={`/cashier/reciept/${all && all.clients[key]._id}/${client._id}`} > <FontAwesomeIcon icon={faPrint} className="fa-2x" /> </Link>
                                    </td>
                                </tr>
                            )

                        }
                        )
                        }
                    </tbody>

                </table>
            </div>

        </div>
    )
}
