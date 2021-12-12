import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
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
export const AddDirection = () => {
  const auth = useContext(AuthContext)
  const { request, error, loading, clearError } = useHttp()
  const history = useHistory()
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)

  //Direction ma'lumotlari
  const [direction, setDirection] = useState({
    value: "",
    price: "",
    section: "",
    subsection: " ",
    label: ""
  })

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

  const checkDirection = () => {
    if (CheckDirection(direction)) {
      return notify(CheckDirection(direction))
    }
    window.scrollTo({top:0})
    setModal(true)
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/direction/register", "POST", { ...direction }, {
        Authorization: `Bearer ${auth.token}`
      })
      console.log(data);
      history.push('/director/directions')
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

  if (loading ) {
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
                      <th className="text-center">Saqlash</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">
                        <span className="table-avatar">
                          <span href="profile.html"> <input defaultValue={direction.section} onChange={changeSection} name="lastname" className="addDirection" /> </span>
                        </span>
                      </td>
                      <td className="text-center"><input defaultValue={direction.price} onChange={changePrice} type="number" name="lastname" className="addDirection" /> sum</td>
                      <td className="text-center"><input defaultValue={direction.subsection} onChange={changeSubsection} name="lastname" className="addDirection" /></td>
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
