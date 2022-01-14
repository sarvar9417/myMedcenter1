import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckCounterDoctorData } from './CheckCounterDoctorData'
import { Loader } from '../../components/Loader'
import Select from 'react-select'

toast.configure()
export const EditCounterDoctor = () => {
  const auth = useContext(AuthContext)
  const { request, error, clearError, loading } = useHttp()
  const history = useHistory()
  const notify = (e) => {
    toast.error(e)
  }
  // Modal oyna funksiyalari

  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)


  //CounterDoctor ma'lumotlari
  const counterdoctorId = useParams().id
  const [counterdoctor, setCounterDoctor] = useState()

  const getCounterDoctor = useCallback(async () => {
    try {
      const data = await request(`/api/counterdoctor/doctor/${counterdoctorId}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      console.log(data);
      setCounterDoctor(data)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setCounterDoctor, counterdoctorId, notify])


  const changeHandler = (event) => {
    setCounterDoctor({ ...counterdoctor, [event.target.name]: event.target.value })
  }


  const checkData = () => {
    if (CheckCounterDoctorData(counterdoctor)) {
      return notify(CheckCounterDoctorData(counterdoctor))
    }
    else {
      window.scrollTo({ top: 0 })
      setModal2(true)
    }
  }

  const createHandler = async () => {
    try {
      const data = await request(`/api/counterdoctor/${counterdoctorId}`, "PATCH", { ...counterdoctor }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/counteragent/doctors")
    } catch (e) {
      notify(e)
    }
  }

  const Delete = async () => {
    try {
      const data = await request(`/api/counterdoctor/${counterdoctorId}`, "DELETE", null, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/counteragent/doctors")
    } catch (e) {
      notify(e)
    }
  }

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
    if (!counterdoctor) {
      getCounterDoctor()
    }
  }, [error, clearError])

  if (loading) {
    return <Loader />
  }

  return (
    <div className='container'>
      <div className="card p-3">
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-md-6 p-4">
              <p className="fs-4"> Kontrdoctor </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
              <input placeholder='Familiyasini kiriting' defaultValue={counterdoctor && counterdoctor.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
              <input type="text" placeholder="Ismini kiriting" defaultValue={counterdoctor && counterdoctor.firstname} onChange={changeHandler} name="firstname" className='form-control' />
            </div>
            <div className="col-12 col-md-6 p-4">
              <p className="fs-4 text-white"> Kontrdoctor </p>

              <label htmlFor="name" className="fw-normal pt-1" style={{ color: "#888" }}>Klinikasi</label>
              <input defaultValue={counterdoctor && counterdoctor.clinic} onChange={changeHandler} name="clinic" className="form-control" />
            </div>
            <div className='col-12 col-md-6 p-4'>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn button-success me-3" onClick={checkData}>Saqlash</button>
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
                  Diqqat! Kontrdoctorning quyida ko'rsatilgan barcha ma'lumotlari to'g'riligini tasdiqlaysizmi?
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 p-4">
                    <p className="fs-4"> Kontrdoctor </p>
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                    <input disabled placeholder='Familiyasini kiriting' value={counterdoctor && counterdoctor.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
                    <input disabled type="text" placeholder="Ismini kiriting" value={counterdoctor && counterdoctor.firstname} onChange={changeHandler} name="firstname" className='form-control' />
                    <br />
                    <label htmlFor="name" className="fw-normal pt-1" style={{ color: "#888" }}>Klinikasi</label>
                    <input disabled defaultValue={counterdoctor && counterdoctor.clinic} onChange={changeHandler} name="clinic" className="form-control" />
                  </div>
                  <div className='col-12 col-md-6 p-4'>
                    <br />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Kontragent</label>
                    <input disabled defaultValue={counterdoctor && counterdoctor.counteragentname} name="phone" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="card-footer text-center">
                <button onClick={createHandler} className="btn button-success mb-2 " style={{ marginRight: "30px" }}>Tasdiqlash</button>
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
              </div>
              <div className="card-body">
                <h5 className='text-danger'> {counterdoctor && counterdoctor.lastname + " " + counterdoctor.firstname}ni o'chirilishini tasdiqlaysizmi?</h5>
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
