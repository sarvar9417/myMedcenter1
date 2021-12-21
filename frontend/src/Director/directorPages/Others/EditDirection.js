import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Modal from 'react-modal'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckDirection } from './CheckDirection'
import { Loader } from '../../components/Loader'


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
toast.configure()
export const EditDirection = () => {
  const auth = useContext(AuthContext)
  const { request, loading, error, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)

  //Direction ma'lumotlari
  const [direction, setDirection] = useState({
    value: "",
    price: "",
    section: "",
    subsection: "", 
    room: ""
  })
  const directionId = useParams().id

  const getDirection = useCallback(async () => {
    try {
      const data = await request(`/api/direction/${directionId}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setDirection({
        value: data.value,
        price: data.price,
        section: data.section,
        subsection: data.subsection,
        room: data.room
      })
    } catch (e) {
      notify(e)
    }
  }, [request, directionId, auth, setDirection])

  const changeSection = (event) => {
    setDirection({
      ...direction,
      section: event.target.value,
      value: event.target.value + " " + direction.subsection,
      label: event.target.value + " " + direction.subsection
    })
  }

  const changeSubsection = (event) => {
    setDirection({
      ...direction,
      subsection: event.target.value,
      value: direction.section + " " + event.target.value,
      label: direction.section + " " + event.target.value
    })
  }

  const changePrice = (event) => {
    setDirection({ ...direction, price: parseInt(event.target.value) })
  }

  const changeRoom = (event) => {
    setDirection({ ...direction, room: event.target.value })
  }

  const checkDirection = () => {
    if (CheckDirection(direction)) {
      return notify(CheckDirection(direction))
    }
    window.scrollTo({top:0})
    setModal(true)
  }

  const createHandler = async () => {
    try {
      const data = await request(`/api/direction/${directionId}`, "PATCH", { ...direction }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push('/director/directions')
    } catch (e) {
      notify(e)
    }
  }




  const notify = (e) => {
    toast.error(e)
  }


  useEffect(() => {
    if (direction.value === "") {
      getDirection()
    }
    if (error) {
      notify(error)
      clearError()
    }

  }, [getDirection, notify, clearError])

  if (loading) {
    return <Loader/>
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
                      <th className="text-center">Xizmat nomi</th>
                      <th className="text-center">Xizmat narxi</th>
                      <th className="text-center">Xizmat turi</th>
                      <th className="text-center">Xizmat xonasi</th>
                      <th className="text-center">Saqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> <input defaultValue={direction.section} onChange={changeSection} name="" className="addDirection" /> </span>
                        </span>
                      </td>
                      <td className="text-center"><input defaultValue={direction.price} onChange={changePrice} name="" className="addDirection" /> sum</td>
                      <td className="text-center"><input defaultValue={direction.subsection} onChange={changeSubsection} name="" className="addDirection" /></td>
                      <td className="text-center"><input defaultValue={direction.room} onChange={changeRoom} name="room" className="addDirection" /></td>
                      <td className="text-center"><button onClick={checkDirection} className="btn button-success" >Saqlash</button> </td>
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
                      <th className="text-center">Xizmat nomi</th>
                      <th className="text-center">Xizmat narxi</th>
                      <th className="text-center">Xizmat turi</th>
                      <th className="text-center">Xizmat xonasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> {direction.section} </span>
                        </span>
                      </td>
                      <td className="text-center">{direction.price} sum</td>
                      <td className="text-center">{direction.subsection}</td>
                      <td className="text-center">{direction.room}</td>
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
