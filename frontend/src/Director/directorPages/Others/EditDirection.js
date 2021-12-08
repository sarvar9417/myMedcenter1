import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import Modal from 'react-modal'
import { toast } from "react-toastify"
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http.hook'
import { CheckDirection } from './CheckDirection'


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

export const EditDirection = () => {
  const auth = useContext(AuthContext)
  const { request } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  //Direction ma'lumotlari
  const [direction, setDirection] = useState({
    value: "",
    price: "",
    subvalue: " ",
    label: ""
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
        subvalue: data.subvalue,
        label: data.label
      })
    } catch (e) {
      notify(e)
    }
  }, [request, directionId, auth, setDirection])

  const changeValue = (event) => {
    setDirection({ ...direction, value: event.target.value, label: event.target.value })
  }

  const changeSubValue = (event) => {
    setDirection({ ...direction, subvalue: event.target.value })
  }

  const changePrice = (event) => {
    setDirection({ ...direction, price: parseInt(event.target.value) })
  }

  const checkDirection = () => {
    if (CheckDirection(direction)) {
      return notify(CheckDirection(direction))
    }
    openModal()
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
  }, [getDirection])

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
                      <th className="text-center">Saqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> <input defaultValue={direction.value} onChange={changeValue} name="lastname" className="addDirection" /> </span>
                        </span>
                      </td>
                      <td className="text-center"><input defaultValue={direction.price} onChange={changePrice} name="lastname" className="addDirection" /> sum</td>
                      <td className="text-center"><input defaultValue={direction.subvalue} onChange={changeSubValue} name="lastname" className="addDirection" /></td>
                      <td className="text-center"><button onClick={checkDirection} className="btn btn-success" >Saqlash</button> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Modal oynaning ochilishi */}
      <div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="datatable table table-hover table-center mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">Xizmat nomi</th>
                      <th className="text-center">Xizmat narxi</th>
                      <th className="text-center">Xizmat turi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> {direction.value} </span>
                        </span>
                      </td>
                      <td className="text-center">{direction.price} sum</td>
                      <td className="text-center">{direction.subvalue}</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row m-1">
            <div className="col-12 text-center">
              <button onClick={createHandler} className="btn btn-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
              <button onClick={closeModal} className="btn btn-danger" >Qaytish</button>
            </div>
          </div>

        </Modal>
      </div>

    </div >
  )
}
