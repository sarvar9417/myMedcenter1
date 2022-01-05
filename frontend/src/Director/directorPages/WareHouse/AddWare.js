import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckAddWare } from './CheckAddWare'
import { Loader } from '../../components/Loader'

toast.configure()
export const AddWare = () => {
  const wareId = useParams().id
  const auth = useContext(AuthContext)
  const { request, error, loading, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)

  //Ware ma'lumotlari
  const [ware, setWare] = useState({
    value: "",
    label: "",
    name: "",
    type: "",
    price: "",
    pieces: 0,
    comment: " "
  })
  const [oldWare, setOldWare] = useState()

  const getWare = useCallback(async () => {
    try {
      const fetch = await request(`/api/warehouse/${wareId}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setOldWare(fetch)
      setWare({
        value: fetch.value,
        label: fetch.label,
        name: fetch.name,
        type: fetch.type,
        price: fetch.price,
        pieces: 0,
        comment: " "
      })
    } catch (e) {

    }
  }, [request, auth, setOldWare, setWare, wareId])

  const changeName = (event) => {
    setWare({
      ...ware,
      name: event.target.value,
      value: event.target.value + " " + ware.type,
      label: event.target.value + " " + ware.type
    })
  }

  const changeType = (event) => {
    setWare({
      ...ware,
      type: event.target.value,
      value: ware.name + " " + event.target.value,
      label: ware.name + " " + event.target.value
    })
  }

  const changePrice = (event) => {
    setWare({ ...ware, price: parseInt(event.target.value) })
  }

  const changePieces = (event) => {
    setWare({ ...ware, pieces: event.target.value })
  }

  const changeComment = (event) => {
    setWare({ ...ware, comment: event.target.value })
  }

  const checkWare = () => {
    if (CheckAddWare(ware)) {
      return notify(CheckAddWare(ware))
    }
    window.scrollTo({ top: 0 })
    setModal(true)
  }
  const createHandler = async () => {
    try {
      const data = await request(`/api/warehouse/${wareId}`, "PATCH", { ...ware }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push('/director/warehouse')
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
    if (!oldWare) {
      getWare()
    }
  }, [notify, clearError])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Mahsulot nomi</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center" >Narxi (1 donasi)</th>
                      <th className="text-center" >Donasi</th>
                      <th className="text-center">Izoh</th>
                      <th className="text-center">Jami</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html">
                            <input style={{width:"150px"}} defaultValue={ware.name} onChange={changeName} name="name" className="addDirection" />
                          </span>
                        </span>
                      </td>
                      <td className="text-center"><input style={{width:"150px"}} defaultValue={ware.type} onChange={changeType} name="type" className="addDirection" /></td>
                      <td className="text-center" ><input style={{width:"100px"}} defaultValue={ware.price} onChange={changePrice} type="number" name="lastname" className="addDirection" /> so'm</td>
                      <td className="text-center" ><input style={{width:"100px"}} defaultValue={ware.pieces} onChange={changePieces} type="number" name="pieces" className="addDirection" /></td>
                      <td className="text-center"><input style={{width:"100px"}} defaultValue={ware.comment} onChange={changeComment} type="text" name="comment" className="addDirection" /></td>
                      <td className="text-center">{oldWare && (parseInt(ware.pieces) + parseInt(oldWare.pieces))} </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-end mt-3"><button onClick={checkWare} className="btn button-success" >Saqlash</button> </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div className={modal ? "modal" : "d-none"}>
        <div className="modal-card">

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Mahsulot nomi</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center">Narxi (1 donasi)</th>
                      <th className="text-center">Donasi</th>
                      <th className="text-center">Izoh</th>
                      <th className="text-center">Jami</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> {ware.name} </span>
                        </span>
                      </td>
                      <td className="text-center">{ware.type}</td>
                      <td className="text-center">{ware.price} so'm</td>
                      <td className="text-center">{ware.pieces}</td>
                      <td className="text-center">{ware.comment}</td>
                      <td className="text-center">{oldWare && (parseInt(ware.pieces) + parseInt(oldWare.pieces))}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <div className=" text-center">
                <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>
          </div>



        </div>
      </div>

    </div >
  )
}
