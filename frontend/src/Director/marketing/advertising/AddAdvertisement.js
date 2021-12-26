import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../components/Loader'



toast.configure()
export const AddAdvertisement = () => {
  const auth = useContext(AuthContext)
  const { request, error, clearError, loading } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari

  const [modal, setModal] = useState(false)

  //AddAdvertisement ma'lumotlari
  const [advertisement, setAddAdvertisement] = useState({
    name: ""
  })


  const changeHandler = (event) => {
    setAddAdvertisement({ ...advertisement, [event.target.name]: event.target.value })
  }

  const checkData = () => {
    if ((advertisement.name.length < 1)) {
      return notify("Iltimos reklama nomini kiriting")
    }
    else {
      window.scrollTo({ top: 0 })
      setModal(true)
    }
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/source/register", "POST", { ...advertisement }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/advertisements")
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
              <p className="fs-4"> Reklama </p>
              <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Nomi</label>
              <input placeholder='Nomini kiriting' defaultValue={advertisement.name} onChange={changeHandler} name="name" type="text" className="form-control" />
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
                  Diqqat! Reklamaning quyida ko'rsatilgan barcha ma'lumotlari to'g'riligini tasdiqlaysizmi?
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 p-4">
                    <p className="fs-4"> Reklama </p>
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Nomi</label>
                    <input disabled defaultValue={advertisement.name} onChange={changeHandler} name="name" type="text" className="form-control" />
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
