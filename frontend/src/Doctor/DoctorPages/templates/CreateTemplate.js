import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { toast } from 'react-toastify'
import { Loader } from '../../components/Loader'
import {useHistory} from 'react-router-dom'

toast.configure()
export const CreateTemplate = () => {
    const auth = useContext(AuthContext)
    const { request, loading, error, clearError } = useHttp()
    const history = useHistory()
    const [template, setTemplate] = useState({
        section: auth && auth.doctor.section,
        subsection: "",
        template: ""
    })

    const [modal, setModal] = useState(false)

    const checkTemplate = () => {
        if (template.subsection === "") {
            return notify("Iltimos shablon nomini kiriting")
        }
        if (template.template === "") {
            return notify("Iltimos shablonni kiriting")
        }

        setModal(true)
        window.scrollTo({ top: 0 })
    }

    const inputTemplate = (event) => {
        setTemplate({ ...template, [event.target.name]: event.target.value })
    }

    const createHandler = useCallback(async () => {
        try {
            const fetch = await request(`/api/templatedoctor/register`, 'POST', {...template}, {
                Authorization: `Bearer ${auth.token}`
            })
            history.push('/doctor/templates')
        } catch (error) {
            notify(error)
        }
    }, [request, auth, template])

    const notify = (e) => {
        toast.error(e)
    }

    useEffect(() => {
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
                <h4 className="text-center">Yangi shablon yaratish</h4>
            </div>
            <div >
                <h5>Shablon nomini kiriting</h5>
                <input defaultValue={template.subsection} onChange={inputTemplate} name="subsection" type="text" className="form-control" />
            </div>
            <br />
            <div >
                <h5>Shablonni kiriting</h5>
                <textarea defaultValue={template.template} onChange={inputTemplate} name="template" type="text" className="form-control" style={{ height: "100px" }} />
            </div>
            <div className="mt-4 text-center">
                <button onClick={checkTemplate} className="btn button-success">Yaratish</button>
            </div>

            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"} >
                <div className="modal-card">
                    <div className="card" style={{ minWidth: "400px" }}>
                        <div className="card-header">
                            <h5>Shablon nomi</h5>
                            <pre>{template.subsection}</pre>
                        </div>

                        <div className="card-body">
                            <h5>Shablon</h5>
                            <pre>{template.template}</pre>
                        </div>
                        <div className=" card-footer mt-4 text-center">
                            <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                            <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
