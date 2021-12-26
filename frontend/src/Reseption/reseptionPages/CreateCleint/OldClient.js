import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useHttp } from "../../hooks/http.hook"
import "react-toastify/dist/ReactToastify.css"
import { Loader } from "../../components/Loader"
import { toast } from "react-toastify"
import Select from "react-select"
import makeAnimated from "react-select/animated"
import { AuthContext } from "../../context/AuthContext"
const mongoose = require("mongoose")
const animatedComponents = makeAnimated()



toast.configure()
export const OldClient = () => {

  const auth = useContext(AuthContext)
  let s = []
  const { loading, request, error, clearError } = useHttp()
  const [turns, seTurns] = useState([])
  const [sections, setSections] = useState([])
  const [clients, setClients] = useState()
  const notify = (e) => {
    toast.error(e)
  }

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
      let c = []
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
  }, [auth, request, setCounterAgents, notify])

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
  })

  const changeHandlar = (event) => {
    setClient({ ...client, [event.target.name]: event.target.value })
  }

  const changeCounterAgent = (event) => {
    setCounterAgent(event.value)
  }

  const changeSections = (event) => {
    s = []
    event.map((section) => {
      let turn = 0
      turns.map((sec) => {
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
        counterAgent: counteragent,
        paymentMethod: " ",
        source: source
      })
    })
    setSections(s)
  }

  const createSections = (event) => {
    let key = parseInt(event.target.id)
    setSections(
      Object.values({
        ...sections,
        [key]: { ...sections[key], price: event.target.value },
      }),
      () =>
        setSections(
          Object.values({
            ...sections,
            [key]: { ...sections[key], turn: parseInt(event.target.name) },
          })
        )
    )
  }

  const allClients = useCallback(async () => {
    try {
      const fetch = await request("/api/clients/reseption", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      setClients(fetch)
    } catch (e) { }
  }, [request])

  const allTurns = useCallback(async () => {
    try {
      const sec = await request("/api/section/reseption", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      seTurns(sec)
    } catch (e) { }
  }, [request])

  const searchClient = (id) => {
    clients.map((clt) => {
      if (clt.id === id) {
        setClient(clt)
      }
    })
  }

  const createConnector = async () => {
    try {
      const connector = await request("/api/connector/register", "POST", { client: client._id }, {
        Authorization: `Bearer ${auth.token}`
      })

      createAllSections(connector._id)
    } catch (e) {
      notify(e)
    }
  }

  const createAllSections = (connector) => {
    sections.map((section) => {
      create(section, connector)
    })
    history.push(`/reseption/reciept/${client._id}/${connector}`)
  }

  const create = async (section, connector) => {
    try {
      const data = await request(`/api/section/reseption/register/${client._id}`, "POST", { ...section, connector }, {
        Authorization: `Bearer ${auth.token}`
      })
      console.log(data)
    } catch (e) {
      notify(e)
    }
  }

  useEffect(() => {
    if (!options) {
      getOptions()
    }
    if (!counteragents) {
      getCounterAgents()
    }
    allClients()
    if (error) {
      notify(error)
      clearError()
    }
    if (!sources) {
      getSources()
    }
    allTurns()
  }, [allClients, allTurns])


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
          <label className="labels">Telefon raqami</label>
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
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Familiya</label>
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
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Ism</label>
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
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Otasining ismi</label>
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
          <label className="labels" style={{ top: "-7px", fontSize: "12px", fontWeight: "500" }}>Tug'ilgan sanasi</label>
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
            sources && sources.map((adver) => {
              if (adver.name === source) {
                return <button onClick={() => { setSource(adver.name) }} className="button-change"> {adver.name} </button>
              } else {
                return <button onClick={() => { setSource(adver.name); console.log(adver.name); }} className="button">{adver.name}</button>
              }
            })
          }
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <p className="m-0 ps-2 mt-3">Bo'limni tanlang</p>
          <Select
            className=""
            onChange={(event) => changeSections(event)}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={options}
          />
        </div>
      </div>
      <div className="row">
        {sections.map((section, key) => {
          return (
            <>
              <div className="col-7">
                <label className="text-muted mandatory"></label>
                <input
                  disabled
                  defaultValue={section.price}
                  onChange={createSections}
                  id={key}
                  type="number"
                  name={section.name}
                  className="form-control mt-2"
                  placeholder={section.name + " summasi"}
                />
              </div>
              <div className="col-5">
                <label className="text-muted mandatory">{ } navbati</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="section"
                  value={section.turn}
                  disabled
                />
              </div>
            </>
          )
        })}
      </div>

      <div className="mt-5 text-center" >
        <button
          onClick={() => setModal(true)}
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
                  sections.map((section, key) => {
                    allPrice = allPrice + section.price
                    return (
                      <tr key={key}>
                        <td style={{ width: "10%", textAlign: "center", padding: "10px 0" }}>{key + 1}</td>
                        <td style={{ width: "30%", textAlign: "center", padding: "10px 0" }}>
                          {section.name}
                        </td>
                        <td style={{ width: "15%", textAlign: "center", padding: "10px 0" }}>{section.price}</td>
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
                <button onClick={createConnector} className="btn button-success" style={{ marginRight: "30px" }}>Tasdiqlash</button>
                <button onClick={() => setModal(false)} className="btn button-danger" >Qaytish</button>
              </div>
            </div>

          </div>
        </div>
      </div>


    </div>
  )
}
