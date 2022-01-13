import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenAlt } from '@fortawesome/free-solid-svg-icons'

toast.configure()
export const CounterAgents = () => {
    const auth = useContext(AuthContext)
    const { request, error, clearError } = useHttp()
    const [counteragents, setCounterAgents] = useState()
    const [modal, setModal] = useState(false)
    const [agentId, setAgentId] = useState()
    const notify = (e) => {
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

    const Delete = useCallback(async () => {
        const fetch = request(`/api/counteragent/${agentId && agentId}`, 'DELETE', null, {
            Authorization: `Bearer ${auth.token}`
        })
        window.location.reload()
    }, [agentId])

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
            <div className="row pb-3">
                <div className='col-4'>
                    <Link to="/director/paymentscounteragents" className=" btn btn-primary">
                        Ulushlar
                    </Link>
                </div>
                <div className="col-8 text-end">
                    <Link to="/director/addcounteragent" className="btn button-success">
                        Kontragent yaratish
                    </Link>

                    <Link to="/director/counterdoctors" className="btn ms-4 btn-success">
                        Yo'naltiruvchi shifokorlar
                    </Link>
                </div>
            </div>
            <div className="card" style={{ minWidth: "800px" }}>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }} >
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th className="text-center" scope="col">№</th>
                            <th className="text-center" scope="col">F.I.SH</th>
                            <th className="text-center" scope="col">Telefon raqami</th>
                            <th className="text-center" scope="col">Shifokorlari</th>
                            <th className="text-center" scope="col">Tahrirlash</th>
                            <th className="text-center" scope="col">O'chirish</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            counteragents && counteragents.map((agent, index) => {
                                return (
                                    <tr key={index}>
                                        <th className="text-center" >{index + 1}</th>
                                        <td className="ps-3"> <Link className='text-success' style={{ fontWeight: "600" }} to={`/director/counteragentprocient/${agent._id}`} >{agent.lastname} {agent.firstname} {agent.fathername}</Link> </td>
                                        <td className="text-center">+{agent.phone}</td>
                                        <td className="text-center"></td>
                                        <td className="text-center">
                                            <Link to={`/director/editcounteragent/${agent._id}`} className="btn" style={{ backgroundColor: "rgba(15, 183, 107, 0.12", color: "#26af48" }}>
                                                <FontAwesomeIcon icon={faPenAlt} />
                                            </Link>
                                        </td>
                                        <td className="text-center">
                                            <button onClick={() => { setAgentId(agent._id); setModal(true); }} className="btn button-danger">
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
                                    Diqqat! Counteragentga tegishli barcha shifokorlar ham o'chiriladi. Counter agentni o'chirilishini tasdiqlaysizmi?
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
