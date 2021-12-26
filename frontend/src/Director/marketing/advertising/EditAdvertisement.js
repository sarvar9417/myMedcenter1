import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { Loader } from '../../components/Loader'



toast.configure()
export const EditAdvertisement = () => {
  const auth = useContext(AuthContext)
  const { request, error, clearError, loading } = useHttp()
  const history = useHistory()
  const notify = (e) => {
    toast.error(e)
  }
  // Modal oyna funksiyalari

  const [modal1, setModal1] = useState(false)
  const [modal2, setModal2] = useState(false)


  //Advertisement ma'lumotlari
  const advertisementId = useParams().id
  const [advertisement, setAdvertisement] = useState()

  const getAdvertisement = useCallback(async () => {
    try {
      const data = await request(`/api/source/${advertisementId}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setAdvertisement(data)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setAdvertisement, advertisementId, notify])


  const changeHandler = (event) => {
    setAdvertisement({ ...advertisement, [event.target.name]: event.target.value })
  }

  const checkData = () => {
    if ((advertisement.name.length < 1)) {
      return notify("Iltimos reklama nomini kiriting")
    }
    else {
      window.scrollTo({ top: 0 })
      setModal2(true)
    }
  }


  const createHandler = async () => {
    try {
      const data = await request(`/api/source/${advertisementId}`, "PATCH", { ...advertisement }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/advertisements")
    } catch (e) {
      notify(e)
    }
  }

  const Delete = async () => {
    try {
      const data = await request(`/api/source/${advertisementId}`, "DELETE", null, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/director/advertisements")
    } catch (e) {
      notify(e)
    }
  }

  useEffect(() => {
    if (error) {
      notify(error)
      clearError()
    }
    if (!advertisement) {
      getAdvertisement()
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
              <input placeholder='Nomini kiriting' defaultValue={advertisement && advertisement.name} onChange={changeHandler} name="name" type="text" className="form-control" />
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
                  Diqqat! Reklamaning quyida ko'rsatilgan barcha ma'lumotlari to'g'riligini tasdiqlaysizmi?
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 col-md-6 p-4">
                    <p className="fs-4"> Reklama </p>
                    <label htmlFor="name" className="fw-normal" style={{ color: "#888" }}>Familiyasi</label>
                    <input disabled placeholder='Nomini kiriting' value={advertisement && advertisement.name} onChange={changeHandler} name="name" type="text" className="form-control" />
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
                <h5 className='text-danger'> {advertisement && advertisement.name}ni o'chirilishini tasdiqlaysizmi?</h5>
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
