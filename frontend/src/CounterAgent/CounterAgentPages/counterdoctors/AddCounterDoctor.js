import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckCounterDoctorData } from './CheckCounterDoctorData'
import { Loader } from '../../components/Loader'
import Select from 'react-select'

toast.configure()
export const AddCounterDoctor = () => {
  const auth = useContext(AuthContext)
  const { request, error, clearError, loading } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari

  const [modal, setModal] = useState(false)


  //CounterDoctor ma'lumotlari
  const [counterdoctor, setCounterDoctor] = useState({
    firstname: "",
    lastname: "",
    clinic: "",
    // phone: 998,
    counteragent: auth.counteragentId,
    counteragentname: ""
  })


  const changeHandler = (event) => {
    if (event.target.name === "phone") {
      setCounterDoctor({ ...counterdoctor, [event.target.name]: parseInt(event.target.value) })

    } else {
      setCounterDoctor({ ...counterdoctor, [event.target.name]: event.target.value })
    }
  }

  const setAgent = (event) => {
    setCounterDoctor({ ...counterdoctor, counteragent: event.value, counteragentname: event.label })
  }

  const checkData = () => {
    if (CheckCounterDoctorData(counterdoctor)) {
      return notify(CheckCounterDoctorData(counterdoctor))
    }
    else {
      window.scrollTo({ top: 0 })
      setModal(true)
    }
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/counterdoctor/register", "POST", { ...counterdoctor }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/counterdoctors")
    } catch (e) {
      notify(e)
    }
  }
  const [agent, setA] = useState()
  const notify = (e) => {
    toast.error(e)
  }
  const [counteragents, setCounterAgents] = useState()
  const getCounterAgents = useCallback(async () => {
    try {
      const data = await request("/api/counteragent", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      let a = []
      data.map(d => {
        a.push({
          label: d.lastname + " " + d.firstname,
          value: d._id
        })
      })
      setCounterAgents(a)
    } catch (error) {
      notify(error)
    }
  }, [])

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
    if (!counteragents) {
      getCounterAgents()
    }
  }, [error, clearError])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="card p-3">
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-md-6 p-4">
              <p className="fs-4"> Yo'llanma beruvchi shifokor </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
              <input placeholder='Familiyasini kiriting' defaultValue={counterdoctor.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
              <input type="text" placeholder="Ismini kiriting" defaultValue={counterdoctor.firstname} onChange={changeHandler} name="firstname" className='form-control' />
              <br />
              {/* <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
              <input defaultValue={counterdoctor && counterdoctor.phone} type="number" placeholder="Telefon raqami" name='phone' onChange={changeHandler} className='form-control' />
              <br /> */}
            </div>
            <div className="col-12 col-md-6 pt-4">
              <p className="fs-4 text-white"> Kontragent  </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Klinikasi</label>
              <input defaultValue={counterdoctor && counterdoctor.clinic} type="text" placeholder="Klinikasi" name='clinic' onChange={changeHandler} className='form-control' />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Kontragent</label>
              <div className="">
                <Select onChange={(event) => setAgent(event)} options={counteragents && counteragents} />
              </div>
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
                  Diqqat! Shikorning quyida ko'rsatilgan barcha ma'lumotlari to'g'riligini tasdiqlaysizmi?
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 p-4">
                    <p className="fs-4"> Kontragent </p>
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                    <input disabled placeholder='Familiyasini kiriting' defaultValue={counterdoctor.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
                    <input disabled type="text" placeholder="Ismini kiriting" defaultValue={counterdoctor.firstname} onChange={changeHandler} name="firstname" className='form-control' />
                    {/* <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
                    <input disabled defaultValue={counterdoctor.phone} onChange={changeHandler} name="phone" className="form-control" /> */}
                  </div>
                  <div className="col-12 col-md-6 p-4">
                    <p className="fs-4 text-white"> Kontragent </p>

                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Klinikasi</label>
                    <input disabled defaultValue={counterdoctor && counterdoctor.clinic} type="text" placeholder="Klinikasi" name='clinic' onChange={changeHandler} className='form-control' />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Kontragent</label>
                    <input disabled defaultValue={counterdoctor.counteragentname} name="phone" className="form-control" />
                  </div>
                  <div className="col-12 col-md-6 p-4">
                    <p className="fs-4"> </p>
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
