import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'

toast.configure()
export const CounterAgents = () => {
    const auth = useContext(AuthContext)
    const { request, error, clearError } = useHttp()
    const [counteragents, setCounterAgents] = useState()
    const notify = (e)=>{
        toast.error(e)
    }

    const getCounterAgents = useCallback(async () => {
        try {
            const fetch = await request('/api/counteragent/', 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setCounterAgents(fetch)
        } catch (error) {
            notify(error)
        }
    }, [auth, request, setCounterAgents, notify])

    useEffect(() => {
        if (!counteragents) {
            getCounterAgents()
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
                    <Link to="/director/addcounteragent" className="btn button-success">
                        Kontragent yaratish
                    </Link>
                </div>
            </div>
            <div className="card" style={{minWidth:"800px"}}>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }} >
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className="text-center" scope="col">№</th>
                            <th className="text-center" scope="col">F.I.SH</th>
                            <th className="text-center" scope="col">Ixtisosligi</th>
                            <th className="text-center" scope="col">Kilinikasi</th>
                            <th className="text-center" scope="col">Telefon raqami</th>
                            <th className="text-center" scope="col">Ulushi</th>
                            <th className="text-center" scope="col">Tahrirlash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            counteragents && counteragents.map((agent, index) => {
                                return (
                                    <tr key={index}>
                                        <th className="text-center" >{index+1}</th>
                                        <td className="ps-3"> <Link className='text-success' style={{ fontWeight: "600" }} to={`/director/counteragentprocient/${agent._id}`} >{agent.lastname} {agent.firstname} {agent.fathername}</Link> </td>
                                        <td className="text-center">{agent.section}</td>
                                        <td className="text-center">{agent.clinic}</td>
                                        <td className="text-center">+{agent.phone}</td>
                                        <td className="text-center">{agent.procient} %</td>
                                        <td className="text-center">
                                            <Link to={`/director/editcounteragent/${agent._id}`} className="btn" style={{ backgroundColor: "rgba(15, 183, 107, 0.12", color: "#26af48"}}>
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
