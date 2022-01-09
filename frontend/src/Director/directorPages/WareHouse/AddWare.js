import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckAddWare } from './CheckAddWare'
import { Loader } from '../../components/Loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons'

toast.configure()
export const AddWare = () => {
  const warehouseId = useParams().id
  const auth = useContext(AuthContext)
  const { request, error, loading, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)
  const [modal2, setModal2] = useState(false)
  const [remove, setRemove] = useState()
  //Ware ma'lumotlari
  const [ware, setWare] = useState({
    name: "",
    type: "",
    // price: "",
    pieces: 0,
    day: new Date(),
    warehouse: ""
  })
  const [oldWare, setOldWare] = useState()
  const [warehouse, setWareHouse] = useState()
  const getWarehouse = useCallback(async () => {
    try {
      const fetch = await request(`/api/warehouse/${warehouseId}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setWareHouse(fetch)
      setWare({ ...ware, warehouse: fetch._id, name: fetch.name, type: fetch.type })
    } catch (e) {
      notify(e)
    }
  }, [setWareHouse, setWare, warehouseId])

  const getWares = useCallback(async () => {
    try {
      const fetch = await request(`/api/ware/warehouse/${warehouseId}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setOldWare(fetch)
    } catch (e) {
      notify(e)
    }
  }, [request, auth, setOldWare, warehouseId,])

  // const changePrice = (event) => {
  //   setWare({ ...ware, price: parseInt(event.target.value) })
  // }

  const changePieces = (event) => {
    setWare({ ...ware, pieces: event.target.value })
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
      const data = await request(`/api/ware/register`, "POST", { ...ware }, {
        Authorization: `Bearer ${auth.token}`
      })
      window.location.reload()
    } catch (e) {
      notify(e)
    }
  }

  const Delete = async (id) => {
    try {
      const data = await request(`/api/ware/${id}`, "DELETE", null, {
        Authorization: `Bearer ${auth.token}`
      })
      window.location.reload()
    } catch (e) {
      notify(e)
    }
  }

  const notify = (e) => {
    toast.error(e)
  }
  useEffect(() => {
    if (!oldWare) {
      getWares()
    }
    if (!warehouse) {
      getWarehouse()
    }
    if (error) {
      notify(error)
      clearError()
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
                      {/* <th className="text-center" >Narxi (1 donasi)</th> */}
                      <th className="text-center" >Donasi</th>
                      <th className="text-center">Qo'shish</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html">
                            <input style={{ width: "150px" }} defaultValue={ware.name} disabled name="name" className="addDirection" />
                          </span>
                        </span>
                      </td>
                      <td className="text-center"><input style={{ width: "150px" }} defaultValue={ware.type} disabled name="type" className="addDirection" /></td>
                      {/* <td className="text-center" ><input style={{ width: "100px" }} defaultValue={ware.price} onChange={changePrice} type="number" name="lastname" className="addDirection" /> so'm</td> */}
                      <td className="text-center" ><input style={{ width: "100px" }} defaultValue={ware.pieces} onChange={changePieces} type="number" name="pieces" className="addDirection" /></td>
                      <td className="text-center"><button onClick={checkWare} className='btn button-success'>Qo'shish</button> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead style={{ backgroundColor: "#6c7ae0", color: "white" }}>
                    <tr>
                      <th className="text-center">№</th>
                      <th className=""> Mahsulot nomi</th>
                      <th className="text-center"> Qo'shilgan sana</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center">Soni</th>
                      <th className="text-center">O'chirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      oldWare && oldWare.map((ware, index) => {
                        return (
                          <tr>
                            <td className="">{index + 1}</td>
                            <td className="text-bold text-success">
                              <span className="table-avatar">
                                <span href="profile.html" >{ware.name}</span>
                              </span>
                            </td>
                            <td className="text-center">{new Date(ware.day).toLocaleDateString()}</td>
                            <td className="text-center">{ware.type}</td>
                            <td className="text-center">{ware.pieces}</td>
                            <td className="text-center"> <button onClick={() => { setRemove(ware); window.scrollTo({ top: 0 }); setModal2(true) }} className="btn button-danger px-3" ><FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon> </button></td>
                          </tr>)
                      })
                    }

                  </tbody>
                </table>
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
                      <th className="text-center">Donasi</th>
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
                      <td className="text-center">{ware.pieces}</td>
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

      <div className={modal2 ? "modal" : "d-none"}>
        <div className="modal-card">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Mahsulot nomi</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center">Soni</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html">{remove && remove.name}</span>
                        </span>
                      </td>
                      <td className="text-center">{remove && remove.type}</td>
                      <td className="text-center">{remove && remove.pieces}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <div className=" text-center">
                <button onClick={() => { Delete(remove._id) }} className="btn button-success" style={{ marginRight: "30px" }}>Mahsulotni o'chirish</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>
          </div>



        </div>
      </div>

    </div >
  )
}
