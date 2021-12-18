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
    const notify = (e) => {
        toast.error(e)
    }
    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)
    const [logo, setLogo] = useState({
        logo: "",
        name: "",
        companyname: "",
        address: "",
        orientation: "",
        bank: "",
        mfo: "",
        accountnumber: "",
        inn: "",
        phone1: "",
        phone2: "",
        phone3: ""
    })

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

    const changeHandler = (event) => {
        setLogo({ ...logo, [event.target.name]: event.target.value })
    }

    const checkData = () => {
        if (logo.logo === "") {
            return notify("Diqqat! Klinika logotipini yuklashni yoddan chiqardingiz. Iltimos logotipni yuklang!")
        }
        if (logo.name === "") {
            return notify("Diqqat! Klinika nomini kiritishni yoddan chiqardingiz. Iltimos klinika nomini kiriting")
        }
        if (logo.companyname === "") {
            return notify("Diqqat! Tashkilot nomini kiritishni yoddan chiqardingiz. Iltimos tashkilot nomini kiriting")
        }
        if (logo.address === "") {
            return notify("Diqqat! Tashkilot manzilini kiritishni yoddan chiqardingiz. Iltimos tashkilot manzilini kiriting")
        }
        if (logo.orientation === "") {
            return notify("Diqqat! Mo'ljalni kiritishni yoddan chiqardingiz. Iltimos mo'ljalni kiriting")
        }
        if (logo.phone1 === "") {
            return notify("Diqqat! Telefon raqam kiritishni yoddan chiqardingiz. Iltimos hech bo'lmaganda 1-telefon raqamni kiriting")
        }
        if (logo.bank === "") {
            return notify("Diqqat! Bank nomini kiritishni yoddan chiqardingiz. Iltimos bank nomini kiriting")
        }
        if (logo.accountnumber === "") {
            return notify("Diqqat! Bank hisob raqamingizni kiritishni yoddan chiqardingiz. Iltimos bank hisob raqamingizni kiriting")
        }
        if (logo.inn === "") {
            return notify("Diqqat! INN raqamingizni kiritishni yoddan chiqardingiz. Iltimos INN raqamingizni kiriting")
        }
        if (logo.mfo === "") {
            return notify("Diqqat! MFO raqamingizni kiritishni yoddan chiqardingiz. Iltimos MFO raqamingizni kiriting")
        }
        setModal(true)
        window.scrollTo({ top: 0 })
    }

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



    useEffect(() => {
        if (logo.logo === "") {
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
                    <div className="row">
                        <div className="col-12 col-md-6 p-4">
                            <img width="200px" src={logo && logo.logo} alt="CompanyLogo" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                            <br />
                            <br />
                            <p className="fs-4"> Bank ma'lumotlari </p>
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Bank nomi</label>
                            <input defaultValue={logo.bank} onChange={changeHandler} name="bank" type="text" className="form-control" placeholder="Bank nomini kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Hisob raqam</label>
                            <input defaultValue={logo.accountnumber} onChange={changeHandler} name="accountnumber" type="number" className="form-control" placeholder="Hisob raqamni kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>MFO</label>
                            <input defaultValue={logo.mfo} onChange={changeHandler} name="mfo" type="number" className="form-control" placeholder="MFO kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>INN</label>
                            <input defaultValue={logo.inn} onChange={changeHandler} name="inn" type="number" className="form-control" placeholder="INN ni kiriting" />
                        </div>
                        <div className="col-12 col-md-6 p-4">
                            <p className="fs-4"> Klinika ma'lumotlari </p>
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Klinika nomi</label>
                            <input defaultValue={logo.name} onChange={changeHandler} name="name" className="form-control" placeholder="Klinika nomini kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tashkilotning ro'ydan o'tgan nomi</label>
                            <input defaultValue={logo.companyname} onChange={changeHandler} name="companyname" className="form-control" placeholder="Tashkilot nomi kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Manzil</label>
                            <input defaultValue={logo.address} onChange={changeHandler} name="address" className="form-control" placeholder="Manzilni kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Mo'ljal</label>
                            <input defaultValue={logo.orientation} onChange={changeHandler} name="orientation" className="form-control" placeholder="Mo'ljalni kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqam 1</label>
                            <input defaultValue={logo.phone1} onChange={changeHandler} name="phone1" type="number" className="form-control" placeholder="Telefon raqamni kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqam 2</label>
                            <input defaultValue={logo.phone2} onChange={changeHandler} name="phone2" type="number" className="form-control" placeholder="Telefon raqamni kiriting" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqam 3</label>
                            <input defaultValue={logo.phone3} onChange={changeHandler} name="phone3" type="number" className="form-control" placeholder="Telefon raqamni kiriting" />
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <button className="btn button-success" onClick={checkData}>Saqlash</button>
                </div>
            </div>


            {/* Modal oynaning ochilishi */}
            <div className={modal ? "modal" : "d-none"}>
                <div className="modal-card">
                    <div className="" >
                        <div className="card" >
                            <div className="card-header">
                                <h6 className="text-danger">Kompaniyangizning eski ma'lumotlari xotiradan o'chirilib yangisi saqlanadi!</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-6 p-4">
                                        <img width="200px" src={logo && logo.logo} alt="CompanyLogo" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                                        <br />
                                        <br />
                                        <br />
                                        <p className="fs-4"> Bank ma'lumotlari </p>
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Bank nomi</label>
                                        <input defaultValue={logo.bank} onChange={changeHandler} name="bank" type="text" className="form-control" placeholder="Bank nomini kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Hisob raqam</label>
                                        <input defaultValue={logo.accountnumber} onChange={changeHandler} name="accountnumber" type="number" className="form-control" placeholder="Hisob raqamni kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>MFO</label>
                                        <input defaultValue={logo.mfo} onChange={changeHandler} name="mfo" type="number" className="form-control" placeholder="MFO kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>INN</label>
                                        <input defaultValue={logo.inn} onChange={changeHandler} name="inn" type="number" className="form-control" placeholder="INN ni kiriting" />
                                    </div>
                                    <div className="col-12 col-md-6 p-4">
                                        <p className="fs-4"> Klinika ma'lumotlari </p>
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Klinika nomi</label>
                                        <input defaultValue={logo.name} onChange={changeHandler} name="name" className="form-control" placeholder="Klinika nomini kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tashkilotning ro'ydan o'tgan nomi</label>
                                        <input defaultValue={logo.companyname} onChange={changeHandler} name="companyname" className="form-control" placeholder="Tashkilot nomi kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Manzil</label>
                                        <input defaultValue={logo.address} onChange={changeHandler} name="address" className="form-control" placeholder="Manzilni kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Mo'ljal</label>
                                        <input defaultValue={logo.orientation} onChange={changeHandler} name="orientation" className="form-control" placeholder="Mo'ljalni kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqam 1</label>
                                        <input defaultValue={logo.phone1} onChange={changeHandler} name="phone1" type="number" className="form-control" placeholder="Telefon raqamni kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqam 2</label>
                                        <input defaultValue={logo.phone2} onChange={changeHandler} name="phone2" type="number" className="form-control" placeholder="Telefon raqamni kiriting" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqam 3</label>
                                        <input defaultValue={logo.phone3} onChange={changeHandler} name="phone3" type="number" className="form-control" placeholder="Telefon raqamni kiriting" />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button onClick={createHandler} className="btn button-success mb-2" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                                <button onClick={() => setModal(false)} className="btn button-danger mb-2" >Qaytish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
