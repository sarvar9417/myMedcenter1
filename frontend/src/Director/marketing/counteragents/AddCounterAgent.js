import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckCounterAgentData } from './CheckCounterAgentData'
import { Loader } from '../../components/Loader'



toast.configure()
export const AddCounterAgent = () => {
  const auth = useContext(AuthContext)
  const { request, error, clearError, loading } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari

  const [modal, setModal] = useState(false)


  //CounterAgent ma'lumotlari
  const [counteragent, setCounterAgent] = useState({
    firstname: "",
    lastname: "",
    phone: 998,
  })


  const changeHandler = (event) => {
    if (event.target.name === "phone") {
      setCounterAgent({ ...counteragent, [event.target.name]: parseInt(event.target.value) })

    } else {
      setCounterAgent({ ...counteragent, [event.target.name]: event.target.value })
    }
  }


  const checkData = () => {
    if (CheckCounterAgentData(counteragent)) {
      return notify(CheckCounterAgentData(counteragent))
    }
    else {
      window.scrollTo({ top: 0 })
      setModal(true)
    }
  }


  const createHandler = async () => {
    try {
      const data = await request("/api/counteragent/register", "POST", { ...counteragent }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/counteragents")
    } catch (e) {
      notify(e)
    }
  }

  const notify = (e) => {
    toast.error(e)
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
        <div className="card-body">
          <div className="row">
            <div className="col-12 col-md-6 p-4">
              <p className="fs-4"> Kontragent </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
              <input placeholder='Familiyasini kiriting' defaultValue={counteragent.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
              <input type="text" placeholder="Ismini kiriting" defaultValue={counteragent.firstname} onChange={changeHandler} name="firstname" className='form-control' />
              <br />
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
              <input defaultValue={counteragent && counteragent.phone} type="number" placeholder="Telefon raqami" name='fathername' onChange={changeHandler} className='form-control' />
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
                  Diqqat! Kontragentning quyida ko'rsatilgan barcha ma'lumotlari to'g'riligini tasdiqlaysizmi?
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 p-4">
                    <p className="fs-4"> Kontragent </p>
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                    <input disabled placeholder='Familiyasini kiriting' defaultValue={counteragent.lastname} onChange={changeHandler} name="lastname" type="text" className="form-control" />
                    <br />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Ismi</label>
                    <input disabled type="text" placeholder="Ismini kiriting" defaultValue={counteragent.firstname} onChange={changeHandler} name="firstname" className='form-control' />
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Telefon raqami</label>
                    <input disabled defaultValue={counteragent.phone} onChange={changeHandler} name="phone" className="form-control" />
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
