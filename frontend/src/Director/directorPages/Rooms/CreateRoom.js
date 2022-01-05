import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckRoom } from './CheckRoom'
import { Loader } from '../../components/Loader'

toast.configure()
export const CreateRoom = () => {
  const auth = useContext(AuthContext)
  const { request, error, loading, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)

  //Room ma'lumotlari
  const [room, setRoom] = useState({
    value: "",
    label: "",
    room: "",
    roomtype: "",
    price: "",
    bed: "",
    position: "bo'sh"
  })

  const changeName = (event) => {
    setRoom({
      ...room,
      room: event.target.value,
      value: event.target.value + ", turi: " + room.roomtype + ", koyka: " + room.bed,
      label: event.target.value + ", turi: " + room.roomtype + ", koyka: " + room.bed,
    })
  }

  const changeType = (event) => {
    setRoom({
      ...room,
      roomtype: event.target.value,
      value: room.room + ", turi: " + event.target.value + ", koyka: " + room.bed,
      label: room.room + ", turi: " + event.target.value + ", koyka: " + room.bed
    })
  }

  const changePrice = (event) => {
    setRoom({ ...room, price: parseInt(event.target.value) })
  }

  const changeBed = (event) => {
    setRoom({
      ...room,
      bed: event.target.value,
      value: room.room + ", turi: " + room.roomtype + ", koyka: " + event.target.value,
      label: room.room + ", turi: " + room.roomtype + ", koyka: " + event.target.value,
    })
  }

  const checkRoom = () => {
    if (CheckRoom(room)) {
      return notify(CheckRoom(room))
    }
    window.scrollTo({ top: 0 })
    setModal(true)
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/rooms/register", "POST", { ...room }, {
        Authorization: `Bearer ${auth.token}`
      })
      console.log(data)
      history.push('/director/rooms')
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
                      <th className="text-center">Xona nomi(raqami)</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center">Narxi</th>
                      <th className="text-center">Koyka</th>
                      <th className="text-center">Saqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html">
                            <input defaultValue={room.room} onChange={changeName} name="room" className="addDirection" />
                          </span>
                        </span>
                      </td>
                      <td className="text-center"><input defaultValue={room.roomtype} onChange={changeType} name="type" className="addDirection" /></td>
                      <td className="text-center"><input defaultValue={room.price} onChange={changePrice} type="number" name="lastname" className="addDirection" /> so'm</td>
                      <td className="text-center"><input defaultValue={room.bed} onChange={changeBed} type="text" name="pieces" className="addDirection" /></td>
                      <td className="text-center"><button onClick={checkRoom} className="btn button-success" >Saqlash</button> </td>
                    </tr>
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
                      <th className="text-center">Xona nomi(raqami)</th>
                      <th className="text-center">Turi</th>
                      <th className="text-center">Narxi</th>
                      <th className="text-center">Koyka</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> {room.room} </span>
                        </span>
                      </td>
                      <td className="text-center">{room.roomtype}</td>
                      <td className="text-center">{room.price} so'm</td>
                      <td className="text-center">{room.bed}</td>
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
