import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useHttp } from "../hooks/http.hook"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { AuthContext } from "../context/AuthContext"
import '../CSS/radio.css'
const animatedComponents = makeAnimated()

toast.configure()
export const EditStatsionarClient = () => {
  const connectorId = useParams().id
  //Xatoliklar chiqaruvi
  const notify = (e) => {
    toast.error(e)
  }

  // Mijoz sxemasi
  const [client, setClient] = useState()

  // Modal oyna funksiyalari
  let allPrice = 0
  const [modal, setModal] = useState(false)

  //Avtorizatsiyani olish
  const auth = useContext(AuthContext)
  let s = []


  // So'rov kutish va xatoliklarni olish
  const { request, error, clearError, loading } = useHttp()

  //Registratsiyadan o'tgan bo'limlarni olish
  const [sections, setSections] = useState([])

  //Boshqa sahifaga yo'naltirish yuklanishi
  const history = useHistory()

  const [connector, setConnector] = useState()
  // Bo'limlar
  const [options, setOptions] = useState()
  const getOptions = useCallback(async () => {
    try {
      const data = await request("/api/direction/fizioterapevt", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setOptions(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setOptions])

  const getConnector = useCallback(async () => {
    try {
      const data = await request(`/api/connector/${connectorId}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      getClient(data.client)
      setConnector(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setConnector, connectorId])

  const getClient = useCallback(async id => {
    try {
      const data = await request(`/api/clients/reseption/${id}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setClient(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setClient, connectorId])

  const changeHandlar = (event) => {
    setClient({ ...client, [event.target.name]: event.target.value })
  }

  const changeDate = (event) => {
    setClient({ ...client, born: new Date(event.target.value) })
  }

  const changeSections = (event) => {
    s = []
    event.map((section) => {
      s.push({
        client: client && client._id,
        connector: connector && connector._id,
        name: section.section,
        subname: section.subsection,
        price: section.price,
        priceCashier: 0,
        commentCashier: " ",
        comment: " ",
        summary: " ",
        done: "tasdiqlanmagan",
        payment: "kutilmoqda",
        turn: 0,
        bron: "statsionar",
        bronDay: new Date(),
        bronTime: " ",
        position: "statsionar",
        checkup: "chaqirilmagan",
        doctor: " ",
        counteragent: connector && connector.counteragent,
        paymentMethod: " ",
        source: connector && connector.source
      })
    })
    setSections(s)
  }

  // =================================================================================
  // =================================================================================
  // Servislar bo'limi
  const [services, setServices] = useState()
  const [warehouse, setWarehouse] = useState()
  const getWarehouse = useCallback(async () => {
    try {
      const fetch = await request('/api/warehouse/', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setWarehouse(fetch)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setWarehouse])

  const changeServices = (event) => {
    s = []
    event.map((service) => {
      s.push({
        connector: connector && connector._id,
        client: client && client._id,
        warehouse: service._id,
        name: service.name,
        type: service.type,
        price: service.price,
        pieces: 1,
        priceone: service.price,
        payment: "kutilmoqda",
        priceCashier: 0,
        commentCashier: " ",
        paymentMethod: " "
      })
    })
    setServices(s)
  }
  const changePieces = (event) => {
    const key = parseInt(event.target.id)
    setServices(
      Object.values({
        ...services,
        [key]: {
          ...services[key],
          pieces: parseInt(event.target.value),
          price: parseInt(services[key].priceone) * parseInt(event.target.value)
        },
      })
    )
  }

  const createAllServices = () => {
    services && services.map((service) => {
      createService(service)
    })
  }

  const createService = async (service) => {
    try {
      const data = await request(`/api/service/register`, "POST", { ...service }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }
  // =================================================================================
  // =================================================================================

  const checkData = () => {
    window.scrollTo({ top: 0 })
    setModal(true)
  }


  const createAllSections = () => {
    sections && sections.map((section) => {
      create(section)
    })
    services && createAllServices()
    history.push(`/medsestra/clients`)
  }

  const create = async (section) => {
    try {
      const data = await request(`/api/section/reseption/register/${client._id}`, "POST", { ...section, connector: connectorId }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }

  useEffect(() => {
    if (!options) {
      getOptions()
    }
    if (error) {
      notify(error)
      clearError()
    }
    if (!connector) {
      getConnector()
    }
    if (!warehouse) {
      getWarehouse()
    }
  }, [notify, clearError])

  return (
    <div>
      <div className="row" >
        <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
          <h4 className="text-right">Mijozga xizmat qo'shish</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-2 input_box" >
          <input
            disabled
            defaultValue={client && client.lastname}
            onChange={changeHandlar}
            name="lastname"
            type="text"
            className="form-control inp"
            placeholder=""
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Familiya</label>
        </div>
        <div className="col-md-6 mb-2 input_box" >
          <input
            disabled
            defaultValue={client && client.firstname}
            onChange={changeHandlar}
            name="firstname"
            type="text"
            className="form-control inp"
            placeholder=""
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Ism</label>
        </div>
      </div>
      <div className="row" style={{ padding: "15px 0" }}>
        <div className="col-md-6 mb-2 input_box" >
          <input
            disabled
            defaultValue={client && client.fathername}
            onChange={changeHandlar}
            name="fathername"
            type="text"
            className="form-control inp"
            placeholder=""
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Otasining ismi</label>
        </div>
        <div className="col-md-6 mb-2 input_box" >
          <input
            disabled
            defaultValue={client && new Date(client.born).getFullYear().toString() + '-' + (new Date(client.born).getMonth() < 9 ? "0" + (new Date(client.born).getMonth() + 1).toString() : (new Date(client.born).getMonth() + 1).toString()) + '-' + (new Date(client.born).getDate() < 10 ? "0" + (new Date(client.born).getDate()).toString() : (new Date(client.born).getDate()).toString())}
            onChange={changeDate}
            type="date"
            name="born"
            className="form-control inp"
            placeholder=""
            style={{ color: "#999" }}
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Tug'ilgan sanasi</label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-2 input_box" >
          <input
            disabled
            defaultValue={client && client.phone}
            onChange={changeHandlar}
            type="number"
            name="phone"
            maxLength="12"
            minLength="12"
            className="form-control inp"
            placeholder=""
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Telefon raqami</label>
        </div>
        <div className="col-md-6 mb-2 input_box">
          <input
            disabled
            defaultValue={client && client.address}
            onChange={changeHandlar}
            name="address"
            type="text"
            className="form-control inp"
            placeholder="Mijozning manzili"
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Mijoz manzili</label>
        </div>
        <div className="col-12 mb-2 input_box">
          <textarea
            disabled
            defaultValue={connector && connector.diagnosis}
            name="prepayment"
            type="text"
            className="form-control inp"
            placeholder="Tashxisni kiritish"
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Mijozga qo'yilgan tashxis</label>
        </div>
      </div>

      <div className="row pt-3">
        <div className="col-12" >
          <p className="m-0 ps-2">Bo'limni tanlang</p>
          <Select
            className=""
            onChange={(event) => changeSections(event)}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options && options}
          />
          {sections && sections.map((section, key) => {
            return (
              <div className="row">
                <div className="col-6">
                  <input
                    disabled
                    value={section.name + " " + section.subname}
                    id={key}
                    className="form-control mt-2"
                  />
                </div>
                <div className="col-6">
                  <input
                    disabled
                    value={section.price}
                    id={key}
                    className="form-control mt-2"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-5 text-center" >
        <button onClick={checkData} className="btn btn-primary profile-button mb-5">
          Saqlash
        </button>
      </div>

      {/* Modal oynaning ochilishi */}
      <div className={modal ? "modal" : "d-none"}>
        <div className="modal-card">
          <div className="card p-4" style={{ fontFamily: "times" }}>
            <div className="text-center fs-4 fw-bold text-secondary">
              <span className="text-dark">Mijoz: </span>  {client && client.lastname} {client && client.firstname} {client && client.fathername}
            </div>
            <table className="w-100 mt-3" style={{ overflow: "auto" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #999" }} >
                  <th style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>№</th>
                  <th style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>Bo'limlar</th>
                  <th style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>Hisob</th>
                </tr>
              </thead>
              <tbody style={{ borderBottom: "1px solid #999" }}>

                {
                  sections && sections.map((section, key) => {
                    allPrice = allPrice + section.price
                    return (
                      <tr key={key}>
                        <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                        <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                          {section.name} {section.subname}
                        </td>
                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
                      </tr>
                    )
                  })
                }
                {
                  services && services.map((service, key) => {
                    allPrice = allPrice + service.price
                    return (
                      <tr key={key}>
                        <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                        <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                          {service.name} {service.type}
                        </td>
                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{service.price}</td>
                      </tr>
                    )
                  })
                }

              </tbody>
            </table>

            <div className="row m-1 mt-3">
              <div className="col-6">
                <div className="fw-bold text-primary">Jami to'lov:</div>
              </div>
              <div className="col-6">
                <div className="fw-bold  text-end ">{allPrice}</div>
              </div>
              <hr />

            </div>
            <div className="row m-1">
              <div className="col-12 text-center">
                <button onClick={createAllSections} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
