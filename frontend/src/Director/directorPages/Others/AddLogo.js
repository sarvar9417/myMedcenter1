import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../components/Loader'

toast.configure()
export const AddLogo = () => {
    const auth = useContext(AuthContext)
    const { request, error, clearError, loading } = useHttp()
    const history = useHistory()
    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)
    const [logo, setLogo] = useState()

    const [load, setLoad] = useState(false)
    const uploadImage = async (e) => {
        const files = e.target.files[0]
        const data = new FormData()
        data.append('file', files)
        data.append('upload_preset', "myimage")
        setLoad(true)
        const res = await fetch("https://api.cloudinary.com/v1_1/academik/image/upload", { method: 'POST', body: data })
        const file = await res.json()
        setLogo({ ...logo, logo: file.secure_url })
        setLoad(false)
    }

    const getLogo = useCallback(async () => {
        try {
            const data = await request("/api/companylogo/", "GET", null, {
                Authorization: `Bearer ${auth.token}`
            })
            setLogo(data[0])
        } catch (e) {
            notify(e)
        }
    }, [auth, request, setLogo])

    const createHandler = async () => {
        try {
            const data = await request(`/api/companylogo/${logo._id}`, "PATCH", { ...logo }, {
                Authorization: `Bearer ${auth.token}`
            })
            history.push("/director")
            window.location.reload()
        } catch (e) {
            notify(e)
        }
    }

    const notify = (e) => {
        toast.error(e)
    }

    useEffect(() => {
        if (!logo) {
            getLogo()
        }
        if (error) {
            notify(error)
            clearError()
        }
    }, [error, clearError])

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className="card p-3">
                <div className="card-header">
                    <input style={{ width: "157px" }} name="file" onChange={uploadImage} type="file" className="form-control" />
                </div>
                <div className="card-body">
                    <img width="200px" src={logo && logo.logo} alt="CompanyLogo" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                </div>
                <div className="card-footer">
                    <button className="btn button-success" onClick={() => setModal(true)}>Saqlash</button>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="" >
                        <div className="card" style={{ maxWidth: "400px" }} >
                            <div className="card-header">
                                <h6 className="text-danger">Kompaniyangizning eski logotipi xotiradan o'chirilib yangisi saqlanadi!</h6>
                            </div>
                            <div className="card-body">
                                <img width="200px" src={logo && logo.logo} alt="CompanyLogo" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                            </div>
                            <div className="card-footer text-center">
                                <button onClick={createHandler} className="btn button-success mb-2" style={{ marginRight: "30px" }}>Logotipni saqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger mb-2" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
