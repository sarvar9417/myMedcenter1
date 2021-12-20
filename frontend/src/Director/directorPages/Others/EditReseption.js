import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../components/Loader'

toast.configure()
export const EditReseption = () => {
    const { request, error, clearError, loading } = useHttp()
    const history = useHistory()
    const notify = (e) => {
        toast.error(e)
    }
    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)
    const [reseptionId, setReseptionId] = useState()
    const [reseption, setReseption] = useState({
        login: "",
        password: "",
        firstname: "",
        lastname: "",
        fathername: "",
        section: "",
        born: "",
        phone: "",
        image: ""
    })

    const getReseption = useCallback(async () => {
        try {
            const data = await request("/api/auth/reseption", "GET", null)
            setReseption({
                login: data[0].login,
                password: "",
                firstname: data[0].firstname,
                lastname: data[0].lastname,
                fathername: data[0].fathername,
                section: data[0].section,
                born: data[0].born,
                phone: data[0].phone,
                image: data[0].image
            })
            setReseptionId(data[0]._id)
        } catch (e) {
            notify(e)
        }
    }, [request, setReseption])

    const [load, setLoad] = useState(false)
    const uploadImage = async (e) => {
        const files = e.target.files[0]
        const data = new FormData()
        data.append('file', files)
        data.append('upload_preset', "myimage")
        setLoad(true)
        const res = await fetch("https://api.cloudinary.com/v1_1/academik/image/upload", { method: 'POST', body: data })
        const file = await res.json()
        setReseption({ ...reseption, image: file.secure_url })
        setLoad(false)
    }


    const changeHandler = (event) => {
        setReseption({ ...reseption, [event.target.name]: event.target.value })
    }

    const changeDate = (event) => {
        setReseption({ ...reseption, born: new Date(event.target.value) })
    }

    const [borderGreen, setBorderGreen] = useState(false)
    const [borderRed, setBorderRed] = useState(false)
    const [pwd, setPwd] = useState(false)

    const createPassword = (event) => {
        if (event.target.password < 6) {
            setBorderGreen(false)
            setBorderRed(true)
            setPwd(false)
        } else {
            setBorderGreen(false)
            setBorderRed(false)
            setPwd(false)
        }
        setReseption({ ...reseption, [event.target.name]: event.target.value })
    }

    const changePassword = (event) => {
        if (reseption.password.length < 6) {
            return notify("Parol 6 ta belgidan kam bo'lmasligi kerak. Iltimos boshqa parol kiriting!")
        }
        if (event.target.value === reseption.password) {
            setBorderGreen(true)
            setBorderRed(false)
            setPwd(true)
        } else {
            setBorderGreen(false)
            setBorderRed(true)
            setPwd(false)
        }
    }

    const checkData = () => {
        if (!pwd) {
            return notify("Diqqat! Parol berishda xatoga yo'l qo'yilgan. Iltimos to'g'ri parol kiritishga harakat qiling")
        }
        if (reseption.lastname === "") {
            return notify("Diqqat! Iltimos familiyasini kiriting!")
        }
        if (reseption.firstname === "") {
            return notify("Diqqat! Iltimos ismini kiriting!")
        }
        if (reseption.fathername === "") {
            return notify("Diqqat! Iltimos otansining ismini kiriting!")
        }
        if (reseption.section === "") {
            return notify("Diqqat! Iltimos bo'limini kiriting!")
        }
        if (reseption.phone === "") {
            return notify("Diqqat! Iltimos telefoni raqamini kiriting!")
        }
        if (reseption.login === "") {
            return notify("Diqqat! Iltimos loginni kiriting!")
        }
        if (reseption.password === "") {
            return notify("Diqqat! Iltimos parolni kiriting!")
        }
        setModal(true)
        window.scrollTo({ top: 0 })
    }

    const createHandler = async () => {
        try {
            const data = await request(`/api/auth/reseption/${reseptionId}`, "PATCH", { ...reseption })
            window.location.reload()
            history.push("/director/editreseption")
        } catch (e) {
            notify(e)
        }
    }

    useEffect(() => {
        if (reseption.firstname === "") {
            getReseption()
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
                            <img width="200px" src={reseption && reseption.image} alt="ReseptionImage" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                            <br />
                            <br />
                            <br />
                            <p className="fs-4"> Login va parol </p>
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Login</label>
                            <input defaultValue={reseption.login} onChange={changeHandler} name="login" type="text" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parol</label>
                            <input type="password" placeholder="Parolni kiriting" defaultValue={reseption.password} onChange={createPassword} name="password" className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parolni qayta kiriting</label>
                            <input type="password" placeholder="Parolni qayta kiriting" onChange={changePassword} className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />
                        </div>
                        <div className="col-12 col-md-6 p-4">
                            <p className="fs-4"> Qabul bo'lim xodimi ma'lumotlari </p>
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                            <input defaultValue={reseption.lastname} onChange={changeHandler} name="lastname" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
                            <input defaultValue={reseption.firstname} onChange={changeHandler} name="firstname" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Otasining ismi</label>
                            <input defaultValue={reseption.fathername} onChange={changeHandler} name="fathername" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tug'ilgan yili</label>
                            <input onChange={changeDate} name="born" type="date" className="form-control" value={new Date(reseption.born).getFullYear().toString() + '-' + (new Date(reseption.born).getMonth() < 9 ? "0" + (new Date(reseption.born).getMonth() + 1).toString() : (new Date(reseption.born).getMonth() + 1).toString()) + '-' + (new Date(reseption.born).getDate() < 10 ? "0" + (new Date(reseption.born).getDate()).toString() : (new Date(reseption.born).getDate()).toString())} />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ixtisosligi</label>
                            <input defaultValue={reseption.section} onChange={changeHandler} name="section" type="text" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
                            <input defaultValue={reseption.phone} onChange={changeHandler} name="phone" type="number" className="form-control" />
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
                                <h6 className="text-danger">
                                    Diqqat! Qabul bo'limi xodimining barcha ma'lumotlari quyida ko'rsatilgan ma'lumotlarga o'zgartiriladi. <br />
                                    Ushbu o'zgartirishni tasdiqlaysizmi?
                                </h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-6 p-4">
                                        <img width="200px" src={reseption.image} alt="ReseptionImage" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <p className="fs-4"> Login va parol </p>
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Login</label>
                                        <input disabled value={reseption.login} onChange={changeHandler} name="login" type="text" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parol</label>
                                        <input disabled placeholder="Parolni kiriting" value={reseption.password} onChange={createPassword} name="password" type="text" className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />

                                    </div>
                                    <div className="col-12 col-md-6 p-4">
                                        <p className="fs-4"> Rahbar ma'lumotlari </p>
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                                        <input disabled value={reseption.lastname} onChange={changeHandler} name="lastname" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
                                        <input disabled value={reseption.firstname} onChange={changeHandler} name="firstname" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Otasining ismi</label>
                                        <input disabled value={reseption.fathername} onChange={changeHandler} name="fathername" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tug'ilgan yili</label>
                                        <input disabled onChange={changeHandler} name="born" type="date" className="form-control" value={new Date(reseption.born).getFullYear().toString() + '-' + (new Date(reseption.born).getMonth() < 9 ? "0" + (new Date(reseption.born).getMonth() + 1).toString() : (new Date(reseption.born).getMonth() + 1).toString()) + '-' + (new Date(reseption.born).getDate() < 10 ? "0" + (new Date(reseption.born).getDate()).toString() : (new Date(reseption.born).getDate()).toString())} />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Bo'limi</label>
                                        <input disabled value={reseption.section} onChange={changeHandler} name="section" type="text" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
                                        <input disabled value={reseption.phone} onChange={changeHandler} name="phone" type="number" className="form-control" />
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
