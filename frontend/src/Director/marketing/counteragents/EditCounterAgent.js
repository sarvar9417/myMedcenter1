import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckCounterAgentData } from './CheckCounterAgentData'
import { Loader } from '../../components/Loader'



toast.configure()
export const EditCounterAgent = () => {
  const auth = useContext(AuthContext)
  const { request, error, clearError, loading } = useHttp()
  const history = useHistory()
  const notify = (e) => {
    toast.error(e)
  }
  // Modal oyna funksiyalari

  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)


  //CounterAgent ma'lumotlari
  const counteragentId = useParams().id
  const [counteragent, setCounterAgent] = useState()

  const getCounterAgent = useCallback(async () => {
    try {
      const data = await request(`/api/counteragent/${counteragentId}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setCounterAgent({
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
        login: data.login,
        password: "",
      })
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setCounterAgent, counteragentId, notify])


  const changeHandler = (event) => {
    setCounterAgent({ ...counteragent, [event.target.name]: event.target.value })
  }



  const checkData = () => {
    if (CheckCounterAgentData(counteragent)) {
      return notify(CheckCounterAgentData(counteragent))
    }
    else {
      window.scrollTo({ top: 0 })
      setModal2(true)
    }
  }


  const createHandler = async () => {
    try {
      const data = await request(`/api/counteragent/${counteragentId}`, "PATCH", { ...counteragent }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/counteragents")
    } catch (e) {
      notify(e)
    }
  }

  const Delete = async () => {
    try {
      const data = await request(`/api/counteragent/${counteragentId}`, "DELETE", null, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/counteragents")
    } catch (e) {
      notify(e)
    }
  }

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
    if (!counteragent) {
      getCounterAgent()
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
            <div className="col-md-6 p-4">
              <p className="fs-4"> Kontragent </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Login</label>
              <input placeholder='Login' defaultValue={counteragent && counteragent.login} onChange={changeHandler} name="login" type="text" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parol</label>
              <input type="password" placeholder="Parol" defaultValue={counteragent && counteragent.password} onChange={changeHandler} name="password" className='form-control' />
            </div>
            <div className=" col-md-6 p-4">
              <p className="fs-4 text-white" > Kontragent </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
              <input placeholder='Familiyasini kiriting' defaultValue={counteragent && counteragent.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
              <input type="text" placeholder="Ismini kiriting" defaultValue={counteragent && counteragent.firstname} onChange={changeHandler} name="firstname" className='form-control' />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
              <input defaultValue={counteragent && counteragent && counteragent.phone} type="number" placeholder="Telefon raqami" name='phone' onChange={changeHandler} className='form-control' />
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
                  Diqqat! Kontragentning quyida ko'rsatilgan barcha ma'lumotlari to'g'riligini tasdiqlaysizmi?
                </h6>
              </div>
              <div className="row">
                <div className="col-md-6 p-4">
                  <p className="fs-4"> Kontragent </p>
                  <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Login</label>
                  <input disabled placeholder='Login' defaultValue={counteragent && counteragent.login} onChange={changeHandler} name="login" type="text" className="form-control" />
                  <br />
                  <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Parol</label>
                  <input disabled type="text" placeholder="Parol" defaultValue={counteragent && counteragent.password} onChange={changeHandler} name="password" className='form-control' />
                </div>
                <div className=" col-md-6 p-4">
                  <p className="fs-4 text-white" > Kontragent </p>
                  <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                  <input disabled placeholder='Familiyasini kiriting' defaultValue={counteragent && counteragent.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
                  <br />
                  <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
                  <input disabled type="text" placeholder="Ismini kiriting" defaultValue={counteragent && counteragent.firstname} onChange={changeHandler} name="firstname" className='form-control' />
                  <br />
                  <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
                  <input disabled defaultValue={counteragent && counteragent.phone} type="number" placeholder="Telefon raqami" name='phone' onChange={changeHandler} className='form-control' />
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
                <h5 className='text-danger'> {counteragent && counteragent.lastname + " " + counteragent.firstname}ni o'chirilishini tasdiqlaysizmi?</h5>
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
