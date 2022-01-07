import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import makeAnimated from "react-select/animated"
import { useHttp } from '../../hooks/http.hook'
import Select from "react-select"
import { CheckDoctorData } from './CheckDoctorData'
import { Loader } from '../../components/Loader'

// const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

export const EditDoctor = () => {
  const auth = useContext(AuthContext)
  const { request, loading, error, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari 
  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)

  //Doctor ma'lumotlari
  const doctorId = useParams().id
  const [doctor, setDoctor] = useState({
    login: "",
    password: "",
    firstname: "",
    lastname: "",
    fathername: "",
    born: "",
    phone: "",
    section: "",
    image: "",
    procient: 0
  })

  const getDoctor = useCallback(async () => {
    try {
      const data = await request(`/api/auth/doctor/director/${doctorId}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setDoctor({
        login: data.login,
        firstname: data.firstname,
        lastname: data.lastname,
        fathername: data.fathername,
        phone: data.phone,
        born: data.born,
        image: data.image,
        section: data.section,
        procient: data.procient
      })
    } catch (e) {
    }
  }, [request, doctorId, auth, setDoctor])


  // Bo'limlar
  const [options, setOptions] = useState()
  const getOptions = useCallback(async () => {
    try {
      const data = await request("/api/direction/", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      let s = []
      data.map((section) => {
        let k = 0
        s.map((m) => {
          if (m.label == section.section) {
            k++
          }
        })
        if (!k) {
          s.push({
            label: section.section,
            value: section.section,
          })
        }
      })
      setOptions(s)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setOptions])

  const changeHandler = (event) => {
    setDoctor({ ...doctor, [event.target.name]: event.target.value })
  }

  const changeDate = (event) => {
    setDoctor({ ...doctor, born: new Date(event.target.value) })
  }

  const changeSection = (event) => {
    setDoctor({ ...doctor, section: event.value })
  }

  const checkData = () => {
    if (!pwd) {
      return notify("Diqqat! Parol berishda xatoga yo'l qo'yilgan. Iltimos to'g'ri parol kiritishga harakat qiling")
    }
    if (CheckDoctorData(doctor)) {
      return notify(CheckDoctorData(doctor))
    }
    window.scrollTo({ top: 0 })
    setModal2(true)
  }

  const [load, setLoad] = useState(false)
  const uploadImage = async (e) => {
    const files = e.target.files[0]
    const data = new FormData()
    data.append('file', files)
    data.append('upload_preset', "myimage")
    setLoad(true)
    const res = await fetch("https://api.cloudinary.com/v1_1/academik/image/upload", { method: 'POST', body: data })
    const file = await res.json()
    setDoctor({ ...doctor, image: file.secure_url })
    setLoad(false)
  }

  const createHandler = async () => {
    try {
      const data = await request(`/api/auth/doctor/director/${doctorId}`, "PATCH", { ...doctor }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/doctors")
    } catch (e) {
      notify(e)
    }
  }

  const changeProcient = (event) => {
    if (parseInt(event.target.value) > 100) {
      return notify("Diqqat! Shifokor maoshi ishlagan summasidan ortib ketdi. Iltimos, maosh miqdori 100 foizdan oshmasligiga e'tibor qarating!")
    }
    if (parseInt(event.target.value) < 0) {
      return notify("Diqqat! Shifokor maoshi ishlagan summasining 0 foizidan kam. Iltimos, maosh miqdori 0 foizdan kam emasligiga e'tibor qarating!")
    }
    setDoctor({ ...doctor, procient: event.target.value })
  }
  console.log(doctor.procient)
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
    setDoctor({ ...doctor, [event.target.name]: event.target.value })
  }

  const changePassword = (event) => {
    if (doctor.password.length < 6) {
      return notify("Parol 6 ta belgidan kam bo'lmasligi kerak. Iltimos boshqa parol kiriting!")
    }
    if (event.target.value === doctor.password) {
      setBorderGreen(true)
      setBorderRed(false)
      setPwd(true)
    } else {
      setBorderGreen(false)
      setBorderRed(true)
      setPwd(false)
    }
  }


  const Delete = async () => {
    try {
      const data = await request(`/api/auth/doctor/director/${doctorId}`, "DELETE", null, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/doctors")
    } catch (e) {
      notify(e)
    }
  }

  const notify = (e) => {
    toast.error(e)
  }

  useEffect(() => {
    if (!options) {
      getOptions()
    }
    if (error) {
      notify(error)
      clearError()
    }
    if (doctor.firstname === "") {
      getDoctor()
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
              <img className={doctor.image === "" ? "d-none" : ""} width="200px" src={doctor.image} alt="DosetDoctorImage" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
              <br />
              <br />
              <br />
              <p className="fs-4"> Login va parol </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Login</label>
              <input defaultValue={doctor.login} onChange={changeHandler} name="login" type="text" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parol</label>
              <input type="password" placeholder="Parolni kiriting" defaultValue={doctor.password} onChange={createPassword} name="password" className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parolni qayta kiriting</label>
              <input type="password" placeholder="Parolni qayta kiriting" onChange={changePassword} className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ish haqi(foiz - % miqdorida)</label>
              <input defaultValue={doctor.procient} onChange={changeProcient} name="procient" type="number" className="form-control" />
            </div>
            <div className="col-12 col-md-6 p-4">
              <p className="fs-4"> Qabul bo'lim xodimi ma'lumotlari </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
              <input defaultValue={doctor.lastname} onChange={changeHandler} name="lastname" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
              <input defaultValue={doctor.firstname} onChange={changeHandler} name="firstname" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Otasining ismi</label>
              <input defaultValue={doctor.fathername} onChange={changeHandler} name="fathername" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tug'ilgan yili</label>
              <input onChange={changeDate} name="born" type="date" className="form-control" value={new Date(doctor.born).getFullYear().toString() + '-' + (new Date(doctor.born).getMonth() < 9 ? "0" + (new Date(doctor.born).getMonth() + 1).toString() : (new Date(doctor.born).getMonth() + 1).toString()) + '-' + (new Date(doctor.born).getDate() < 10 ? "0" + (new Date(doctor.born).getDate()).toString() : (new Date(doctor.born).getDate()).toString())} />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ixtisosligi</label>
              <Select
                defaultValue={doctor.section}
                className="mt-3"
                onChange={changeSection}
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={options && options}
                name="section"
              />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
              <input defaultValue={doctor.phone} onChange={changeHandler} name="phone" type="number" className="form-control" />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn button-success me-4" onClick={checkData}>Saqlash</button>
          <button className="btn button-danger" onClick={() => { setModal1(true); window.scrollTo({ top: 0 }) }}>O'chirish</button>
        </div>
      </div>


      {/* Modal oynaning ochilishi */}
      <div className={modal2 ? "modal" : "d-none"}>
        <div className="modal-card">
          <div className="" >
            <div className="card" >
              <div className="card-header">
                <h6 className="text-danger">
                  Diqqat! Shifokorning quyida ko'rsatilgan barcha ma'lumotlari to'g'riligini tasdiqlaysizmi?
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 p-4">
                    <img width="200px" src={doctor.image} alt="DosetDoctorImage" style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
                    <br />
                    <br />
                    <br />
                    <br />
                    <p className="fs-4"> Login va parol </p>
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Login</label>
                    <input disabled value={doctor.login} onChange={changeHandler} name="login" type="text" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parol</label>
                    <input disabled placeholder="Parolni kiriting" value={doctor.password} onChange={createPassword} name="password" type="text" className={borderGreen ? `form-control border border-success` : `${borderRed ? "form-control border border-danger" : "form-control border"}`} />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ish haqi(foiz - % miqdorida)</label>
                    <input defaultValue={doctor.procient} disabled name="procient" type="number" className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 p-4">
                    <p className="fs-4"> Rahbar ma'lumotlari </p>
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                    <input disabled value={doctor.lastname} onChange={changeHandler} name="lastname" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
                    <input disabled value={doctor.firstname} onChange={changeHandler} name="firstname" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Otasining ismi</label>
                    <input disabled value={doctor.fathername} onChange={changeHandler} name="fathername" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Tug'ilgan yili</label>
                    <input disabled onChange={changeHandler} name="born" type="date" className="form-control" value={new Date(doctor.born).getFullYear().toString() + '-' + (new Date(doctor.born).getMonth() < 9 ? "0" + (new Date(doctor.born).getMonth() + 1).toString() : (new Date(doctor.born).getMonth() + 1).toString()) + '-' + (new Date(doctor.born).getDate() < 10 ? "0" + (new Date(doctor.born).getDate()).toString() : (new Date(doctor.born).getDate()).toString())} />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Bo'limi</label>
                    <input disabled value={doctor.section} onChange={changeHandler} name="section" type="text" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
                    <input disabled value={doctor.phone} onChange={changeHandler} name="phone" type="number" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="card-footer text-center">
                <button onClick={createHandler} className="btn button-success mb-2" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal2(false)} className="btn button-danger mb-2" >Qaytish</button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div className={modal1 ? "modal" : "d-none"}>
        <div className="modal-card">
          <div className="" >
            <div className="card" style={{ maxWidth: "400px" }} >
              <div className="card-header" >
                <img width="400px" className="card-image img-fluid" src={doctor.image} />
              </div>
              <div className="card-body">
                <h5 className='text-danger'> {doctor.lastname + " " + doctor.firstname}ni o'chirilishini tasdiqlaysizmi?</h5>
              </div>
              <div className="card-footer text-center">
                <button onClick={Delete} className="btn button-success mb-2" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => { setModal1(false) }} className="btn button-danger mb-2" >Qaytish</button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
