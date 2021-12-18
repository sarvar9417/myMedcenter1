import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../components/Loader'

toast.configure()
export const EditDirector = () => {
    const auth = useContext(AuthContext)
    const { request, error, clearError, loading } = useHttp()
    const history = useHistory()
    const notify = (e) => {
        toast.error(e)
    }
    // Modal oyna funksiyalari
    const [modal, setModal] = useState(false)
    const [director, setDirector] = useState({
        login: auth.director.login,
        password: "",
        firstname: auth.director.firstname,
        lastname: auth.director.lastname,
        fathername: auth.director.fathername,
        section: auth.director.section,
        born: auth.director.born,
        phone: auth.director.phone,
        image: auth.director.image
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
        setDirector({ ...director, image: file.secure_url })
        setLoad(false)
    }


    const changeHandler = (event) => {
        setDirector({ ...director, [event.target.name]: event.target.value })
    }

    const [borderGreen, setBorderGreen] = useState(false)
    const [borderRed, setBorderRed] = useState(false)
    const [pwd, setPwd] = useState(false)

    const createPassword = (event) => {
        if (event.target.password < 6) {
            setPwd(false)
            setBorderGreen(false)
            setBorderRed(true)
        } else {
            setPwd(false)
            setBorderGreen(false)
            setBorderRed(false)
        }
        setDirector({ ...director, [event.target.name]: event.target.value })
    }

    const changeDate = (event) => {
        setDirector({ ...director, born: new Date(event.target.value) })
    }

    const changePassword = (event) => {
        if (director.password.length < 6) {
            return notify("Parol 6 ta belgidan kam bo'lmasligi kerak. Iltimos boshqa parol kiriting!")
        }
        if (event.target.value === director.password) {
            setPwd(true)
            setBorderGreen(true)
            setBorderRed(false)
        } else {
            setPwd(false)
            setBorderGreen(false)
            setBorderRed(true)
        }
    }

    const checkData = () => {
        if (!pwd) {
            return notify("Diqqat! Parol berishda xatoga yo'l qo'yilgan. Iltimos to'g'ri parol kiritishga harakat qiling")
        }
        if (director.lastname === "") {
            return notify("Diqqat! Iltimos familiyangizni kiriting!")
        }
        if (director.firstname === "") {
            return notify("Diqqat! Iltimos ismingizni kiriting!")
        }
        if (director.fathername === "") {
            return notify("Diqqat! Iltimos otangizni kiriting!")
        }
        if (director.section === "") {
            return notify("Diqqat! Iltimos ixtisosligingizni kiriting!")
        }
        if (director.phone === "") {
            return notify("Diqqat! Iltimos telefoningizni kiriting!")
        }
        if (director.login === "") {
            return notify("Diqqat! Iltimos loginingizni kiriting!")
        }
        if (director.password === "") {
            return notify("Diqqat! Iltimos parolingizni kiriting!")
        }
        setModal(true)
        window.scrollTo({ top: 0 })
    }

    const createHandler = async () => {
        try {
            const data = await request(`/api/auth/director/${auth.director._id}`, "PATCH", { ...director }, {
                Authorization: `Bearer ${auth.token}`
            })
            auth.logout()
            history.push("/sayt")
            window.location.reload()
        } catch (e) {
            notify(e)
        }
    }



    useEffect(() => {
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
                            <img width="200px" src={auth.director && auth.director.image} alt="DirectorImage" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                            <br />
                            <br />
                            <br />
                            <br />
                            <p className="fs-4"> Login va parol </p>
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Loginingiz</label>
                            <input defaultValue={director.login} onChange={changeHandler} name="login" type="text" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parolingiz</label>
                            <input placeholder="Parolingizni kiriting" defaultValue={director.password} onChange={createPassword} name="password" type="password" className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parolingizni qayta kiriting</label>
                            <input placeholder="Parolingizni qayta kiriting" onChange={changePassword} type="password" className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />
                        </div>
                        <div className="col-12 col-md-6 p-4">
                            <p className="fs-4"> Raxbar ma'lumotlari </p>
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyangiz</label>
                            <input defaultValue={director.lastname} onChange={changeHandler} name="lastname" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismingiz</label>
                            <input defaultValue={director.firstname} onChange={changeHandler} name="firstname" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Otangizning ismi</label>
                            <input defaultValue={director.fathername} onChange={changeHandler} name="fathername" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tug'ilgan yilingiz</label>
                            <input onChange={changeDate} name="born" type="date" className="form-control" value={new Date(director.born).getFullYear().toString() + '-' + (new Date(director.born).getMonth() < 9 ? "0" + (new Date(director.born).getMonth() + 1).toString() : (new Date(director.born).getMonth() + 1).toString()) + '-' + (new Date(director.born).getDate() < 10 ? "0" + (new Date(director.born).getDate()).toString() : (new Date(director.born).getDate()).toString())} />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ixtisosligingiz</label>
                            <input defaultValue={director.section} onChange={changeHandler} name="section" type="text" className="form-control" />
                            <br />
                            <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqamingiz</label>
                            <input defaultValue={director.phone} onChange={changeHandler} name="phone" type="number" className="form-control" />
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
                                <h6 className="text-danger">Diqqat! Ma'lumotlaringiz o'chirilib quyidagi yangi ma'lumotlar saqlanadi saqlanadi!</h6>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 col-md-6 p-4">
                                        <img width="200px" src={auth.director && auth.director.image} alt="DirectorImage" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                                        <br />
                                        <br />
                                        <br />
                                        <br />
                                        <p className="fs-4"> Login va parol </p>
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Loginingiz</label>
                                        <input disabled value={director.login} onChange={changeHandler} name="login" type="text" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parolingiz</label>
                                        <input disabled placeholder="Parolingizni kiriting" value={director.password} onChange={createPassword} name="password" type="text" className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />

                                    </div>
                                    <div className="col-12 col-md-6 p-4">
                                        <p className="fs-4"> Rahbar ma'lumotlari </p>
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyangiz</label>
                                        <input disabled value={director.lastname} onChange={changeHandler} name="lastname" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismingiz</label>
                                        <input disabled value={director.firstname} onChange={changeHandler} name="firstname" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Otangizning ismi</label>
                                        <input disabled value={director.fathername} onChange={changeHandler} name="fathername" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tug'ilgan yilingiz</label>
                                        <input disabled onChange={changeHandler} name="born" type="date" className="form-control" value={new Date(director.born).getFullYear().toString() + '-' + (new Date(director.born).getMonth() < 9 ? "0" + (new Date(director.born).getMonth() + 1).toString() : (new Date(director.born).getMonth() + 1).toString()) + '-' + (new Date(director.born).getDate() < 10 ? "0" + (new Date(director.born).getDate()).toString() : (new Date(director.born).getDate()).toString())} />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ixtisosligingiz</label>
                                        <input disabled value={director.section} onChange={changeHandler} name="section" type="text" className="form-control" />
                                        <br />
                                        <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqamingiz</label>
                                        <input disabled value={director.phone} onChange={changeHandler} name="phone" type="number" className="form-control" />
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
