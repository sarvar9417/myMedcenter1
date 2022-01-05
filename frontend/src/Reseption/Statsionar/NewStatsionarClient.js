import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useHttp } from "../hooks/http.hook"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { CheckClentData } from "./CheckClentData"
import { AuthContext } from "../context/AuthContext"
import '../CSS/radio.css'
const animatedComponents = makeAnimated()



toast.configure()
export const NewStatsionarClient = () => {
  //Xatoliklar chiqaruvi
  const notify = (e) => {
    toast.error(e)
  }

  // Modal oyna funksiyalari
  let allPrice = 0
  const [modal, setModal] = useState(false)

  //Avtorizatsiyani olish
  const auth = useContext(AuthContext)
  let s = []


  // So'rov kutish va xatoliklarni olish
  const { request, error, clearError } = useHttp()
  const [advertisement, setAdvertisement] = useState(false)
  const [counteragents, setCounterAgents] = useState()
  const [counteragent, setCounterAgent] = useState(" ")
  const [sources, setSources] = useState()
  const [source, setSource] = useState(" ")


  const getCounterAgents = useCallback(async () => {
    try {
      const fetch = await request('/api/counteragent/', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let c = [{
        label: "Tanlanmagan",
        value: " "
      }]
      fetch.map((data) => {
        c.push({
          label: data.clinic.toUpperCase() + " " + data.lastname + " " + data.firstname + " " + data.fathername,
          value: data.lastname + " " + data.firstname + " " + data.fathername
        })
      })
      setCounterAgents(c)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setCounterAgents])

  const getSources = useCallback(async () => {
    try {
      const fetch = await request('/api/source/', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setSources(fetch)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setSources])

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

  const createAllServices = (id, connector) => {
    services.map((service) => {
      createService(id, service, connector)
    })
  }

  const createService = async (id, service, connector) => {
    try {
      const data = await request(`/api/service/register`, "POST", { ...service, connector, client: id }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }
  // =================================================================================
  // =================================================================================

  // =================================================================================
  // =================================================================================
  // ROOMS bo'limi

  const [rooms, setRooms] = useState()
  const [room, setRoom] = useState()
  const getRooms = useCallback(async () => {
    try {
      const fetch = await request('/api/rooms/', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      setRooms(fetch)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setRooms])

  const changeRooms = (event) => {
    console.log(event)
    setRoom({
      room: event._id,
      roomname: event.value,
      beginDay: new Date(),
      endDay: new Date(),
      position: "band",
      bed: event.bed,
      price: event.price,
      priceCashier: 0
    })
  }

  const createRoom = async (id, connector) => {
    try {
      const data = await request(`/api/usedroom/register`, "POST", { ...room, connector, client: id }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }
  // =================================================================================
  // =================================================================================


  //Registratsiyadan o'tgan bo'limlarni olish
  const [sections, setSections] = useState([])

  //Boshqa sahifaga yo'naltirish yuklanishi
  const history = useHistory()

  // Bo'limlar
  const [options, setOptions] = useState()
  const getOptions = useCallback(async () => {
    try {
      const data = await request("/api/direction/", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setOptions(data)
    } catch (e) {
      notify(e)
    }
  }, [auth, request, setOptions])

  // Mijoz sxemasi
  const [client, setClient] = useState({
    firstname: "",
    lastname: "",
    fathername: "",
    gender: "",
    phone: 998,
    id: 0,
    born: "",
    address: " "
  })


  const changeHandlar = (event) => {
    setClient({ ...client, [event.target.name]: event.target.value })
  }

  const changeDate = (event) => {
    setClient({ ...client, born: new Date(event.target.value) })
  }

  const changeCounterAgent = (event) => {
    setCounterAgent(event.value)
    sections.map((section, key) => {
      setSections(
        Object.values({
          ...sections,
          [key]: { ...sections[key], counteragent: event.value },
        })

      )
    })
  }

  const changeSource = (name) => {
    sections.map((section, key) => {
      setSections(
        Object.values({
          ...sections,
          [key]: { ...sections[key], source: name },
        })

      )
    })
    setSource(name)
  }



  const changeSections = (event) => {
    s = []
    event.map((section) => {
      s.push({
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
        counteragent: counteragent,
        paymentMethod: " ",
        source: source
      })
    })
    setSections(s)
  }

  const checkData = () => {
    if (CheckClentData(client, diagnosis)) {
      return notify(CheckClentData(client, diagnosis))
    }
    window.scrollTo({ top: 0 })
    setModal(true)
  }


  const createHandler = async () => {
    try {
      const data = await request("/api/clients/reseption/register", "POST", { ...client }, {
        Authorization: `Bearer ${auth.token}`
      })
      createConnector(data._id)
    } catch (e) {
      notify(e)
    }
  }

  const [diagnosis, setDiagnosis] = useState("")
  const [prepayment, setPrepayment] = useState(0)

  const createConnector = async (client) => {
    try {
      const connector = await request("/api/connector/register", "POST", {
        client,
        source,
        counteragent,
        type: "statsionar",
        position: "davolanishda",
        prepayment,
        diagnosis,
        bronDay: new Date(),
        prepaymentCashier: 0,
      }, {
        Authorization: `Bearer ${auth.token}`
      })
      createAllSections(client, connector._id)
      createAllServices(client, connector._id)
      createRoom(client, connector._id )
    } catch (e) {
      notify(e)
    }
  }

  const createAllSections = (id, connector) => {
    sections.map((section) => {
      create(id, section, connector)
    })
    history.push(`/reseption/reciept/${id}/${connector}`)
  }

  const create = async (id, section, connector) => {
    try {
      const data = await request(`/api/section/reseption/register/${id}`, "POST", { ...section, connector }, {
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
    if (!sources) {
      getSources()
    }
    if (!counteragents) {
      getCounterAgents()
    }
    if (error) {
      notify(error)
      clearError()
    }
    if (!warehouse) {
      getWarehouse()
    }
    if (!rooms) {
      getRooms()
    }
  }, [notify, error])

  return (
    <div>
      <div className="row" >
        <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
          <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-2 input_box" >
          <input
            defaultValue={ client.lastname}
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
            defaultValue={client.firstname}
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
            defaultValue={client.fathername}
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
            defaultValue={new Date(client.born).getFullYear().toString() + '-' + (new Date(client.born).getMonth() < 9 ? "0" + (new Date(client.born).getMonth() + 1).toString() : (new Date(client.born).getMonth() + 1).toString()) + '-' + (new Date(client.born).getDate() < 10 ? "0" + (new Date(client.born).getDate()).toString() : (new Date(client.born).getDate()).toString())}
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
        <div className="col-md-6 mb-2" >
          <div className="form-group">
            <div className="btn-group">
              <div className="wrapp">
                <input
                  className="input"
                  id="erkak"
                  onClick={changeHandlar}
                  name="gender"
                  type="radio"
                  defaultValue="man"
                  checked={client.gender === "man" ? true : false}
                />
                <label
                  className={client.gender === "man" ? "label clabel" : "label"}
                  htmlFor="erkak"
                >
                  Erkak
                </label>
                <input
                  checked={client.gender === "woman" ? true : false}
                  className="input"
                  type="radio"
                  id="ayol"
                  onChange={changeHandlar}
                  name="gender"
                  defaultValue="woman"
                />
                <label
                  className={
                    client.gender === "woman" ? "label clabel" : "label"
                  }
                  htmlFor="ayol"
                >
                  Ayol
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-2 input_box" >
          <input
            defaultValue={client.phone}
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
            defaultValue={client.address}
            onChange={changeHandlar}
            name="address"
            type="text"
            className="form-control inp"
            placeholder="Mijozning manzili"
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Mijoz manzili</label>
        </div>
        <div className="col-md-6 mb-2 input_box">
          <input
            defaultValue={prepayment}
            onChange={(event) => { setPrepayment(parseInt(event.target.value)) }}
            name="prepayment"
            type="number"
            className="form-control inp"
            placeholder="Oldindan to'lov"
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Oldindan to'lov</label>
        </div>
        <div className="col-6 mb-2 input_box">
          <textarea
            defaultValue={diagnosis}
            onChange={(event) => { setDiagnosis((event.target.value)) }}
            name="prepayment"
            type="text"
            className="form-control inp"
            placeholder="Tashxisni kiritish"
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Mijozga qo'yilgan tashxis</label>
        </div>
        <div className="col-6 mb-2 input_box">
          <Select
            placeholder="Mijoz xonasi"
            className="m-0 p-0"
            onChange={(event) => changeRooms(event)}
            components={animatedComponents}
            options={rooms && rooms}
            escapeClearsValue="true"
          />
        </div>
      </div>

      <div className="text-end">
        {
          advertisement ?
            <button onClick={() => setAdvertisement(false)} className="adver">-</button>
            :
            <button onClick={() => setAdvertisement(true)} className="adver">+</button>
        }
      </div>
      <div className={advertisement ? "row m-0 p-1 border rounded" : "d-none"}>
        <Select
          placeholder="Kontragentni tanglang"
          className="m-0 p-0"
          onChange={(event) => changeCounterAgent(event)}
          components={animatedComponents}
          options={counteragents && counteragents}
          escapeClearsValue="true"
        />
        <div className="mt-3 text-center p-0" >
          {
            sources && sources.map((adver, key) => {
              if (adver.name === source) {
                return <button onClick={() => changeSource(adver.name)} className="button-change"> {adver.name} </button>
              } else {
                return <button onClick={() => changeSource(adver.name)} className="button">{adver.name}</button>
              }
            })
          }
          <button onClick={() => { setSource(" ") }} className="button" style={{ backgroundColor: "Red" }}>X</button>
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
        <div className="col-12 mt-5" >
          <p className="m-0 ps-2">Xizmatni tanlang</p>
          <Select
            className=""
            onChange={(event) => changeServices(event)}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={warehouse && warehouse}
          />
          {services && services.map((service, key) => {
            return (
              <div className="row">
                <div className="col-4">
                  <input
                    disabled
                    value={service.name + " " + service.type}
                    id={key}
                    className="form-control mt-2"
                  />
                </div>
                <div className="col-4">
                  <input
                    onChange={changePieces}
                    defaultValue={service.pieces}
                    id={key}
                    className="form-control mt-2"
                  />
                </div>
                <div className="col-4">
                  <input
                    disabled
                    value={service.price}
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
              <span className="text-dark">Mijoz: </span>  {client.lastname} {client.firstname} {client.fathername}
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
                <button onClick={createHandler} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
