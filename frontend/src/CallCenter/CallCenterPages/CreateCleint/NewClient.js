import React, { useCallback, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useHttp } from "../../hooks/http.hook"
import "react-toastify/dist/ReactToastify.css"
import { toast } from "react-toastify"
import { CheckClentData } from "./CheckClentData"
import { AuthContext } from "../../context/AuthContext"
import '../radio.css'




toast.configure()
export const NewClient = () => {
  //Xatoliklar chiqaruvi
  const notify = (e) => {
    toast.error(e)
  }

  const sources = [
    { name: "Javobsiz" },
    { name: "Qayta qo'ng'iroq" },
    { name: "Qiziqmadi" },
    { name: "O'ylab ko'radi" },
    { name: "Kelmoqchi" }
  ]
  const [advertisement, setAdvertisement] = useState(false)
  // Modal oyna funksiyalari
  const [modal, setModal] = useState(false)

  //Avtorizatsiyani olish
  const auth = useContext(AuthContext)

  // So'rov kutish va xatoliklarni olish
  const { loading, request, error, clearError } = useHttp()

  //Boshqa sahifaga yo'naltirish yuklanishi
  const history = useHistory()

  // Mijoz sxemasi
  const [client, setClient] = useState({
    firstname: " ",
    lastname: " ",
    fathername: " ",
    gender: " ",
    phone: 998,
    id: 0,
    born: new Date(),
    address: " "
  })

  const [call, setCall] = useState({
    position: "",
    voucher: " ",
    illness: " ",
    callDay: new Date()
  })


  const changeHandlar = (event) => {
    setClient({ ...client, [event.target.name]: event.target.value })
  }

  const changeDate = (event) => {
    setClient({ ...client, born: new Date(event.target.value) })
  }

  const changeCall = (event) => {
    setCall({ ...call, [event.target.name]: event.target.value })
  }


  const allClients = useCallback(async () => {
    try {
      const fetch = await request("/api/clients/reseption/length", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      })
      client.id = fetch + 1000001
    } catch (e) {
      notify(e)
    }
  }, [request, auth])

  const checkData = () => {
    if (CheckClentData(client)) {
      return notify(CheckClentData(client))
    }
    if (call.position === "") {
      return notify("Diqqat. Qo'ng'iroq natijasini belgilashni unutdingiz!")
    }
    window.scrollTo({ top: 0 })
    setModal(true)
  }

  const createHandler = async () => {
    try {
      const data = await request("/api/clients/reseption/register", "POST", { ...client }, {
        Authorization: `Bearer ${auth.token}`
      })
      createCallCenter(data._id)
    } catch (e) {
      notify(e)
    }
  }

  const createCallCenter = async (client) => {
    try {
      const caller = await request("/api/callcenter/register", "POST", { ...call, client }, {
        Authorization: `Bearer ${auth.token}`
      })
      history.push("/callcenter/clients")
    } catch (e) {
      notify(e)
    }
  }


  useEffect(() => {
    allClients()
    if (error) {
      notify(error)
      clearError()
    }
  }, [allClients])

  return (
    <div>
      <div className="row" >
        <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
          <h5 className="text-right">Mijozning ma'lumotlarini kiritish</h5>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-2 input_box" >
          <input
            defaultValue={client.lastname}
            onChange={changeHandlar}
            name="lastname"
            type="text"
            className="form-control inp"
            placeholder=""
          />
          <label className="labels">Familiya</label>
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
          <label className="labels">Ism</label>
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
          <label className="labels">Otasining ismi</label>
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
          <label className="labels">Tug'ilgan sanasi</label>
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
          <label className="labels">Telefon raqami</label>
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
          <label className="labels">Mijoz manzili</label>
        </div>
      </div>

      <hr />
      <div className="text-end">
        {
          advertisement ?
            <button onClick={() => setAdvertisement(false)} className="adver">-</button>
            :
            <button onClick={() => setAdvertisement(true)} className="adver">+</button>
        }
      </div>
      <div className={advertisement ? "row m-0 p-1 border rounded pt-3" : "d-none"}>
        <div className="col-12">
          <label className="labels">Mijozning shikoyati yoki izoh</label>
          <textarea defaultValue={call.illness} name="illness" onChange={changeCall} className="form-control" placeholder="Mijozning shikoyati yoki izoh"></textarea>
        </div>
        <div className="col-12 mt-3">
          <label className="labels">Yo'llanma</label>
          <textarea defaultValue={call.voucher} name="voucher" onChange={changeCall} className="form-control" placeholder="Yo'llanma"></textarea>
        </div>
      </div>

      <hr />

      <div className={"row m-0 p-1 border rounded mt-2"}>
        <div className=" p-0" >
          {
            sources.map((adver) => {
              if (adver.name === call.position) {
                return <button onClick={() => { setCall({ ...call, position: adver.name }) }} className="button-change"> {adver.name} </button>
              } else {
                return <button onClick={() => { setCall({ ...call, position: adver.name }) }} className="button">{adver.name}</button>
              }
            })
          }
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
            <div className="card-header">
              <div className="row">
                  <div className="col-md-6">
                  <h5>Mijoz: </h5>
                  </div>
                <div className="col-md-6">
                  <h5><span style={{ color: "#666", textAlign:"right" }}>{client.lastname + " " + client.firstname + " " + client.fathername}</span></h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5>Tug'ilgan sanasi: </h5>
                </div>
                <div className="col-md-6">
                  <h5><span style={{ color: "#666", textAlign: "right" }}>{new Date(client.born).toLocaleDateString()}</span></h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5>Telefon raqami: </h5>
                </div>
                <div className="col-md-6">
                  <h5><span style={{ color: "#666", textAlign: "right" }}>+{client.phone}</span></h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5>Manzili: </h5>
                </div>
                <div className="col-md-6">
                  <h5><span style={{ color: "#666", textAlign: "right" }}>{client.address}</span></h5>
                </div>
              </div>
              <hr/>
              <div className="row">
                <div className="col-md-6">
                  <h5>Holati: </h5>
                </div>
                <div className="col-md-6">
                  <h5><span style={{ color: "#666", textAlign: "right" }}>{call.position}</span></h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5>Shikoyati yoki izoh: </h5>
                </div>
                <div className="col-md-6">
                  <h5><span style={{ color: "#666", textAlign: "right" }}>{call.illness}</span></h5>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <h5>Yo'llanma: </h5>
                </div>
                <div className="col-md-6">
                  <h5><span style={{ color: "#666", textAlign: "right" }}>{call.voucher}</span></h5>
                </div>
              </div>
              
              
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
