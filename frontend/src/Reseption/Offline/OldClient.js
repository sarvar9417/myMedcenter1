import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useHttp } from "../hooks/http.hook"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { AuthContext } from "../context/AuthContext"
const mongoose = require("mongoose")
const animatedComponents = makeAnimated()



toast.configure()
export const OldClient = () => {

  const auth = useContext(AuthContext)
  let s = []
  const { loading, request, error, clearError } = useHttp()
  const [turns, seTurns] = useState()
  const [sections, setSections] = useState()
  const notify = (e) => {
    toast.error(e)
  }

  const [advertisement, setAdvertisement] = useState(false)
  const [sources, setSources] = useState()
  const [source, setSource] = useState(" ")
  //==============================================================================
  //==============================================================================
  //Counteragents begin
  const [counteragent, setCounterAgent] = useState()
  const [counteragents, setCounterAgents] = useState()
  const getCounterAgents = useCallback(async () => {
    try {
      const fetch = await request('/api/counterdoctor', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let c = [{
        label: "Tanlanmagan",
        value: " ",
        counterdoctor: "",
        counteragent: "",
      }]
      fetch.map((data) => {
        c.push({
          label: data.clinic.toUpperCase() + " " + data.lastname + " " + data.firstname,
          value: data.lastname + " " + data.firstname,
          counterdoctor: data._id,
          counteragent: data.counteragent
        })
      })
      setCounterAgents(c)
    } catch (error) {
      notify(error)
    }
  }, [auth, request, setCounterAgents])

  const changeCounterAgent = (event) => {
    if (event.label === "Tanlanmagan") {
      setCounterAgent(null)
    } else {
      setCounterAgent({
        counteragent: event.counteragent,
        counterdoctor: event.counterdoctor,
        paymentDay: new Date()
      })
    }
  }

  const createPaymentCounteragent = async (connector) => {
    try {
      console.log(connector, client._id)
      const data = await request(`/api/counteragentpayment/reseption/register`, "POST", { ...counteragent, connector, client: client._id }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }
  //==============================================================================
  //==============================================================================

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

  // Modal oyna funksiyalari
  let allPrice = 0
  const [modal, setModal] = useState(false)

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

  const history = useHistory()
  const [client, setClient] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    fathername: "",
    gender: "",
    phone: "",
    id: 0,
    born: "",
    address: ""
  })

  const changeHandlar = (event) => {
    setClient({ ...client, [event.target.name]: event.target.value })
  }

  const changeSource = (name) => {
    sections && sections.map((section, key) => {
      setSections(
        Object.values({
          ...sections,
          [key]: { ...sections[key], source: name },
        })

      )
    })
    setSource(name)
  }

  const [ids, setIds] = useState([])

  const changeSections = (event) => {
    s = []
    let i = []
    event.map((section) => {
      i.push(section._id)
      let turn = 0
      turns && turns.map((sec) => {
        if (checkTurn(sec, section.section)) {
          turn++
        }
      })
      s.map((sec) => {
        if (sec.name === section.section) {
          turn++
        }
      })
      s.push({
        client: client._id,
        name: section.section,
        subname: section.subsection,
        price: section.price,
        priceCashier: 0,
        commentCashier: " ",
        comment: " ",
        summary: " ",
        done: "tasdiqlanmagan",
        payment: "kutilmoqda",
        turn: turn + 1,
        bron: "offline",
        bronDay: new Date(),
        bronTime: " ",
        position: "offline",
        checkup: "chaqirilmagan",
        doctor: " ",
        counteragent: " ",
        paymentMethod: " ",
        source: source
      })
    })
    setSections(s)
    setIds(i)
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
        client: client._id,
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

  const createAllServices = (connector) => {
    services && services.map((service) => {
      createService(service, connector)
    })
  }

  const createService = async (service, connector) => {
    try {
      const data = await request(`/api/service/register`, "POST", { ...service, connector }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }
  // =================================================================================
  // =================================================================================


  const getClient = useCallback(async (id) => {
    try {
      const fetch = await request(`/api/clients/reseption/id/${id}`, "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setClient(fetch)
    } catch (e) {
      notify(e)
    }
  }, [request, auth])

  const searchClient = (id) => {
    if (id > 1000000) {
      getClient(id)
    }
  }

  const allTurns = useCallback(async () => {
    try {
      const sec = await request("/api/section/reseption/turn", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      seTurns(sec)
    } catch (e) { }
  }, [request])


  const createConnector = async () => {
    try {
      const connector = await request("/api/connector/register", "POST", {
        client: client._id,
        source,
        counteragent: counteragent ? counteragent.counteragent : " ",
        type: "offline",
        position: " ",
        prepayment: 0,
        diagnosis: " ",
        bronDay: new Date(),
        prepaymentCashier: 0,
      }, {
        Authorization: `Bearer ${auth.token}`
      })
      createAllSections(connector._id)
      createAllServices(connector._id)
      counteragent && createPaymentCounteragent(connector._id)
    } catch (e) {
      notify(e)
    }
  }

  const createAllSections = (connector) => {
    sections && sections.map((section) => {
      create(section, connector)
    })
    WareUseds(connector)
    history.push(`/reseption/clients`)
  }

  const create = async (section, connector) => {
    try {
      const data = await request(`/api/section/reseption/register/${client._id}`, "POST", { ...section, connector }, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }

  // =================================================================================
  // =================================================================================
  //Omborxona
  const [wareconnectors, setWareConnectors] = useState()
  const getWareConnectors = useCallback(async () => {
    try {
      const fetch = await request("/api/wareconnector", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setWareConnectors(fetch)
    } catch (e) {
      notify(e)
    }
  }, [request, auth, setWareConnectors])

  const WareUseds = (bind) => {
    let wareuseds = []
    ids && ids.map((id) => {
      wareconnectors && wareconnectors.map((wareconnector) => {
        if (id === wareconnector.section) {
          wareuseds.push({
            section: wareconnector.section,
            sectionname: wareconnector.sectionname,
            warehouse: wareconnector.warehouse,
            warehousename: wareconnector.warehousename,
            count: wareconnector.count,
            connector: bind,
            day: new Date()
          })
        }
      })
    })
    createWareUseds(wareuseds)
  }

  const createWareUseds = useCallback(async (wareuseds) => {
    try {
      const fetch = await request(`/api/wareused/register`, "POST", wareuseds, {
        Authorization: `Bearer ${auth.token}`
      })
    } catch (e) {
      notify(e)
    }
  }, [request, auth])
  // =================================================================================
  // =================================================================================


  useEffect(() => {
    if (!options) {
      getOptions()
    }
    if (!counteragents) {
      getCounterAgents()
    }
    if (error) {
      notify(error)
      clearError()
    }
    if (!sources) {
      getSources()
    }
    if (!turns) {
      allTurns()
    }
    if (!warehouse) {
      getWarehouse()
    }
    if (!wareconnectors) {
      getWareConnectors()
    }
  }, [notify, clearError])


  const checkTurn = (turn, name) => {
    if (
      mongoose.Types.ObjectId(turn._id).getTimestamp().getFullYear() ===
      new Date().getFullYear() &&
      mongoose.Types.ObjectId(turn._id).getTimestamp().getMonth() ===
      new Date().getMonth() &&
      mongoose.Types.ObjectId(turn._id).getTimestamp().getDate() ===
      new Date().getDate() &&
      turn.name === name
    )
      return true
    return false
  }


  return (
    <div>
      <div className="row">
        <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
          <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 input_box mb-2" >
          <input
            onChange={(event) => searchClient(parseInt(event.target.value))}
            name="ID"
            type="number"
            className="form-control inp"
            placeholder=""
            style={{ fontSize: "14px" }}
          />
          <label className="labels">Mijoznig ID raqami</label>
        </div>
        <div className="col-md-6 input_box mb-2" >
          <input
            defaultValue={client.phone}
            onChange={changeHandlar}
            type="number"
            name="phone"
            maxLength="12"
            minLength="12"
            className="form-control inp"
            placeholder=""
            style={{ fontSize: "14px" }}
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Telefon raqami</label>
        </div>
      </div>
      <div className="row" style={{ padding: "15px 0" }}>
        <div className="col-md-6 input_box mb-2">
          <input
            defaultValue={client.lastname}
            disabled
            name="lastname"
            type="text"
            className="form-control inp"
            placeholder=""
            style={{ background: "#fff" }}
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Familiya</label>
        </div>
        <div className="col-md-6 input_box" >
          <input
            defaultValue={client.firstname}
            disabled
            name="firstname"
            type="text"
            className="form-control inp"
            placeholder=""
            style={{ background: "#fff" }}
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Ism</label>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 input_box mb-2" >
          <input
            defaultValue={client.fathername}
            disabled
            name="fathername"
            type="text"
            className="form-control inp"
            placeholder=""
            style={{ background: "#fff" }}
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Otasining ismi</label>
        </div>
        <div className="col-md-6 input_box" >
          <input
            value={
              new Date(client.born).getFullYear().toString() +
              "-" +
              (new Date(client.born).getMonth() < 9
                ? "0" + (new Date(client.born).getMonth() + 1).toString()
                : (new Date(client.born).getMonth() + 1).toString()) +
              "-" +
              (new Date(client.born).getDate() < 10
                ? "0" + new Date(client.born).getDate().toString()
                : new Date(client.born).getDate().toString())
            }
            disabled
            type="date"
            name="born"
            className="form-control inp"
            placeholder=""
            style={{ background: "#fff", color: "#999" }}
          />
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }} style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Tug'ilgan sanasi</label>
        </div>
        <div className="col-12">
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
      </div>
      <div className="row"></div>

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
        <button
          onClick={() => { setModal(true); window.scrollTo({ top: 0 }) }}
          className="btn btn-primary profile-button"
        >
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
            <table className="w-100 mt-3">
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
                        < td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                          {section.name}
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
                <button onClick={createConnector} disabled={loading} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>

          </div>
        </div>
      </div>


    </div>
  )
}
