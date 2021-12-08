import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Modal from 'react-modal'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import makeAnimated from "react-select/animated"
import { useHttp } from '../../hooks/http.hook'
import Select from "react-select"
import { CheckDoctorData } from './CheckDoctorData'

// const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

const customStyles = {
  content: {
    top: '10%',
    left: '30%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transdoctor: 'translate(-50%, -50%)',
  },
}

export const EditDoctor = () => {
  const auth = useContext(AuthContext)
  const { request } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari 
  const [modalIsOpen1, setIsOpen1] = useState(false)

  function openModal1() {
    setIsOpen1(true)
  }

  function closeModal1() {
    setIsOpen1(false)
  }

  const [modalIsOpen2, setIsOpen2] = useState(false)

  function openModal2() {
    setIsOpen2(true)
  }

  function closeModal2() {
    setIsOpen2(false)
  }

  //Doctor ma'lumotlari
  const doctorId = useParams().id
  const [doctor, setDoctor] = useState({
    firstname: "",
    lastname: "",
    fathername: "",
    born: "",
    phone: "",
    section: "",
    image: ""
  })

  const getDoctor = useCallback(async () => {
    try {
      const data = await request(`/api/auth/doctor/director/${doctorId}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setDoctor({
        firstname: data.firstname,
        lastname: data.lastname,
        fathername: data.fathername,
        phone: data.phone,
        born: data.born,
        image: data.image,
        section: data.section
      })
    } catch (e) {
    }
  }, [request, doctorId, auth])


  // Bo'limlar
  const [options, setOptions] = useState()
  const getOptions = useCallback(async () => {
    try {
      const data = await request("/api/direction/", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setOptions(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setOptions])

  const changeHandlar = (event) => {
    setDoctor({ ...doctor, [event.target.name]: event.target.value })
    console.log(event.target.value);
  }

  const changeDate = (event) => {
    setDoctor({ ...doctor, born: new Date(event.target.value) })
  }

  const changeSection = (event) => {
    console.log(event.value)
    setDoctor({ ...doctor, section: event.value })
  }

  const checkData = () => {
    if (CheckDoctorData(doctor)) {
      return notify(CheckDoctorData(doctor))
    }
    openModal1()
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

    if (doctor.firstname === "") {
      getDoctor()
    }
  }, [])

  return (
    <div>
      <div className="">
        <div className="col-md-12">
          <article className="linkk mt-5" >
            <h1 style={{ fontWeight: "700" }}>MedCenter </h1>
            <div className="row mt-4" style={{ border: "25px solid hsla(212, 54%, 71%, 0.471)" }}>
              <div className="row pt-3">
                <div className="col-4">
                  <input style={{ width: "150px" }} name="file" onChange={uploadImage} type="file" className="doctor-control" />
                  <img width="200px" src={doctor.image} alt={doctor.image} style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />

                </div>
              </div>
              <div className="col-md-6 mt-3">
                <div className="row">
                  <p style={{ fontWeight: "700", color: "blue", fontSize: "22px", margin: "10px" }}>Asosiy ma'lumotlar</p>
                  <div className="col-4">
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }} className="pt-2">Familiyasi:</p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }} >Ismi:</p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px" }}>Otasining ismi:</p>
                  </div>
                  <div className="col-8">
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}> <input defaultValue={doctor.lastname} onChange={changeHandlar} name="lastname" className="addDoctor" /> <div className="clr"></div>  </p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }} ><input defaultValue={doctor.firstname} onChange={changeHandlar} name="firstname" className="addDoctor" /> <div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}><input defaultValue={doctor.fathername} onChange={changeHandlar} name="fathername" className="addDoctor" /><div className="clr"></div></p>
                  </div>
                </div>
              </div>
              <div className="col-md-5 mt-3">
                <div className="row">
                  <p style={{ fontWeight: "700", color: "blue", fontSize: "20px", margin: "10px 0" }}>Qo'shimcha ma'lumotlar</p>
                  <div className="col-4">
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Tug'ilgan sanasi:</p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}> Telefon: </p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Ixtisosligi: </p>
                  </div>
                  <div className="col-8">
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}> <input value={new Date(doctor.born).getFullYear().toString() + '-' + (new Date(doctor.born).getMonth() < 9 ? "0" + (new Date(doctor.born).getMonth() + 1).toString() : (new Date(doctor.born).getMonth() + 1).toString()) + '-' + (new Date(doctor.born).getDate() < 10 ? "0" + (new Date(doctor.born).getDate()).toString() : (new Date(doctor.born).getDate()).toString())} onChange={changeDate} type="date" className="addDoctor" /><div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}><input defaultValue={doctor.phone} onChange={changeHandlar} name="phone" type="number" className="addDoctor pt-3" /><div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}><Select
                      defaultValue={doctor.section}
                      className="mt-3"
                      onChange={changeSection}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      options={options && options}
                      name="section"
                    /></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-end pt-4 px-4">
              <button onClick={checkData} className="btn btn-success mx-5">O'zgartirishni  saqlash </button>
              <button onClick={openModal2} className="btn btn-danger"> Shifokorni o'chirish </button>
            </div>
          </article>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div>
        <Modal
          isOpen={modalIsOpen1}
          onRequestClose={closeModal1}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="">
            <div className="" >
              <div className="card">
                <div className="card-header" >
                  <img width="300px" className="card-image img-fluid w-100" src={doctor.image} />
                </div>
                <div className="card-body">
                  <h5>F.I.Sh: {doctor.lastname} {doctor.firstname} {doctor.fathername}</h5>
                  <p> Tu'gilgan yili: {new Date(doctor.born).toLocaleDateString()}</p>
                  <p>tel: +{doctor.phone}</p>
                  <h6>Ixtisosligi: {doctor.section}</h6>
                </div>

              </div>
            </div>
          </div>
          <div className="row m-1">
            <div className="col-12 text-center">
              <button onClick={createHandler} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
              <button onClick={closeModal1} className="btn btn-danger" >Qaytish</button>
            </div>
          </div>

        </Modal>
      </div>

      {/* Modal oynaning ochilishi */}
      <div>
        <Modal
          isOpen={modalIsOpen2}
          onRequestClose={closeModal2}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="">
            <div className="" >
              <div className="card">
                <div className="card-header" >
                  <img width="300px" className="card-image img-fluid w-100" src={doctor.image} />
                </div>
                <div className="card-body">
                  <h5>F.I.Sh: {doctor.lastname} {doctor.firstname} {doctor.fathername}</h5>
                  <p> Tu'gilgan yili: {new Date(doctor.born).toLocaleDateString()}</p>
                  <p>tel: +{doctor.phone}</p>
                  <h6>Ixtisosligi: {doctor.section}</h6>
                </div>

              </div>
            </div>
          </div>
          <div className="row m-1">
            <div className="col-12 text-center">
              <button onClick={Delete} className="btn btn-success" style={{ marginRight: "30px" }}>O'chirishni tasdiqlang</button>
              <button onClick={closeModal2} className="btn btn-danger" >Qaytish</button>
            </div>
          </div>

        </Modal>
      </div>

    </div>
  )
}
