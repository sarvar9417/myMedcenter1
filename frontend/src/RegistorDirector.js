import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import { toast } from "react-toastify"
import makeAnimated from "react-select/animated"
import { useHttp } from './Director/hooks/http.hook'
import Select from "react-select"
import { CheckDoctorData } from './Director/directorPages/Others/CheckDoctorData'
import './Director/directorPages/Others/chart.css'
// const mongoose = require("mongoose")
const animatedComponents = makeAnimated()

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export const RegistorDirector = () => {
  const { request, error, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  let allPrice = 0
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  // Bo'limlar
  const options = [
    {
      value: "Kardiolog",
      label: "Kardiolog"
    }
  ]

  //Director ma'lumotlari
  const [director, setDirector] = useState({
    firstname: "",
    lastname: "",
    fathername: "",
    born: "",
    phone: "",
    section: "",
    image: ""
  })

  const [loginPassword, setLoginPassword] = useState({
    login: "",
    password: "",
    directorId: ""
  })

  const changeHandlar = (event) => {
    setDirector({ ...director, [event.target.name]: event.target.value })
  }

  const changeLogin = (event) => {
    setLoginPassword({ ...loginPassword, [event.target.name]: event.target.value })
  }

  const changeDate = (event) => {
    setDirector({ ...director, born: new Date(event.target.value) })
  }

  const changeSection = (event) => {
    setDirector({ ...director, section: event.value })
  }

  const checkData = () => {
    if (CheckDoctorData(director)) {
      return notify(CheckDoctorData(director))
    }
    openModal()
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
    setDirector({ ...director, image: file.secure_url })
    setLoad(false)
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/auth/director/directorresume/register", "POST", { ...director })
      createLogin(data._id)
    } catch (e) {
      notify(e)
    }
  }

  const createLogin = useCallback(async (id) => {
    try {
      const data = await request("/api/auth/director/register", "POST", {
        login: loginPassword.login,
        password: loginPassword.password,
        directorId: id
      })
      console.log(data)
      history.push("/director")
    } catch (e) {
      notify(e)
    }
  }, [request, history, loginPassword])

  const notify = (e) => {
    toast.error(e)
  }

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
  }, [error, clearError])

  return (
    <div>
      <div className="">
        <div className="col-md-12">
          <article className="linkk mt-5" >
            <h1 style={{ fontWeight: "700" }}>MedCenter </h1>
            <div className="row mt-4" style={{ border: "25px solid hsla(212, 54%, 71%, 0.471)" }}>
              <div className="row pt-3">
                <div className="col-md-8 text-center">
                  <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}>Login: <input onChange={changeLogin} name="login" className="addDoctor" /> <div className="clr"></div>  </p>
                  <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }} >Parol: <input onChange={changeLogin} name="password" className="addDoctor" /> <div className="clr"></div></p>
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
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}> <input onChange={changeHandlar} name="lastname" className="addDoctor" /> <div className="clr"></div>  </p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }} ><input onChange={changeHandlar} name="firstname" className="addDoctor" /> <div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px" }}><input onChange={changeHandlar} name="fathername" className="addDoctor" /><div className="clr"></div></p>
                  </div>
                </div>
              </div>
              <div className="col-md-5 mt-3">
                <div className="row">
                  <p style={{ fontWeight: "700", color: "blue", fontSize: "20px", margin: "10px 0" }}>Qo'shimcha ma'lumotlar</p>
                  <div className="col-4">
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Tug'ilgan sanasi:</p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Telefon: </p>
                    <p style={{ fontWeight: "700", fontSize: "18px", margin: "10px 0" }}>Ixtisosligi: </p>
                  </div>
                  <div className="col-8">
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}> <input onChange={changeDate} type="date" className="addDoctor" /><div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}><input onChange={changeHandlar} name="phone" type="number" className="addDoctor pt-3" /><div className="clr"></div></p>
                    <p style={{ fontWeight: "500", fontSize: "18px", margin: "10px 0" }}><Select
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
              <div className="col-md-4 text-center" >
                <input style={{ width: "157px" }} name="file" onChange={uploadImage} type="file" className="form-control" />
                <img width="200px" src={director.image} alt={director.image} style={{ maxWidth: "200px", margin: "10px", borderRadius: "10px" }} />
              </div>
            </div>
            <div className="text-end pt-4 px-4">
              <button onClick={createHandler} className="btn btn-success"> Yaratish </button>
            </div>
          </article>
        </div>
      </div>



    </div>
  )
}
