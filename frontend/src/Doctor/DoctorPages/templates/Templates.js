import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../../components/Loader'
import { Link, useHistory } from 'react-router-dom'

toast.configure()
export const Templates = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const history = useHistory()
    const [templates, setTemplates] = useState()
    const [modal, setModal] = useState(false)
    const [template, setTemplate] = useState()
    const getTemplates = useCallback(async () => {
        try {
            const fetch = await request(`/api/templatedoctor`, 'GET', null, {
                Authorization: `Bearer ${auth.token}`
            })
            setTemplates(fetch)
        } catch (error) {
            notify(error)
        }
    }, [request, auth])

    const deleteTemplates = useCallback(async (id) => {
        try {
            const fetch = await request(`/api/templatedoctor/${id}`, 'DELETE', null, {
                Authorization: `Bearer ${auth.token}`
            })
            window.location.reload()
        } catch (error) {
            notify(error)
        }
    }, [request, auth])

    const notify = (e) => {
        toast(e)
    }

    useEffect(() => {
        if (!templates) {
            getTemplates()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [notify, clearError])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container" style={{ marginTop: "90px" }}>
            <div>
                <h4 className="text-center py-3">Maxsus shablonlar <Link to="/doctor/createtemplate" className="btn button-success float-end">+</Link></h4>
            </div>
            <div>
                <table class="table table-hover table-bordered " style={{ borderRadius: "15px !important" }}>
                    <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                        <tr>
                            <th>№</th>
                            <th>Bo'limi</th>
                            <th>Xizmat turi</th>
                            <th>Shablon</th>
                            <th>Tahrirlash</th>
                            <th>O'chirish</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            templates && templates.map((template, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="p-2">{index + 1}</td>
                                        <td className="p-2">{template.section}</td>
                                        <td className="p-2">{template.subsection}</td>
                                        <td className="p-2 " ><pre style={{ maxWidth: "500px" }}>{template.template}</pre></td>
                                        <td className="p-2"><button onClick={() => { history.push(`/doctor/edittemplate/${template._id}`) }} className="btn button-success">Tahrirlash</button> </td>
                                        <td className="p-2"><button onClick={() => { setTemplate(template); setModal(true) }} className="btn button-danger">O'chirish</button> </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"} >
                <div className="modal-card">
                    <div className="card" style={{ minWidth: "400px" }}>
                        <div className="card-header">
                            <h5>Shablon nomi</h5>
                            <p>{template && template.subsection}</p>
                        </div>

                        <div className="card-body">
                            <h5>Shablon</h5>
                            <pre>{template && template.template}</pre>
                        </div>
                        <div className=" card-footer mt-4 text-center">
                            <button onClick={() => { deleteTemplates(template._id) }} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                            <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
