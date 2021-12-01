import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import "react-toastify/dist/ReactToastify.css";
import { Loader } from "../../components/Loader";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AuthContext } from "../../context/AuthContext";

// import { CheckClentData } from './CheckClentData'
const mongoose = require("mongoose");
const animatedComponents = makeAnimated();

toast.configure();
export const OldClient = () => {

  const auth = useContext(AuthContext)
  let s = [];
  const { loading, request, error, clearError } = useHttp();
  const [turns, seTurns] = useState([]);
  const [sections, setSections] = useState([]);
  const [clients, setClients] = useState();
  const notify = (e) => {
    toast.error(e);
  };
  const history = useHistory();
  const [client, setClient] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    fathername: "",
    gender: "",
    phone: "",
    id: 0,
    born: "",
  });

  const changeHandlar = (event) => {
    setClient({ ...client, [event.target.name]: event.target.value });
  };

  const changeSections = (event) => {
    s = [];
    event.map((section) => {
      let turn = 0;
      turns.map((sec) => {
        if (checkTurn(sec, section.value)) {
          turn++;
        }
      });
      s.push({
        name: section.value,
        price: 0,
        comment: " ",
        summary: " ",
        done: "tasdiqlanmagan",
        payment: "kutilmoqda",
        turn: turn + 1,
        bron: "offline",
        bronDay: new Date(),
        bronTime: " ",
        position: "offline",
        checkup: "chaqirilmagan"
      });
    });
    setSections(s);
  };

  const createSections = (event) => {
    let key = parseInt(event.target.id);
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
    );
  };

  const allClients = useCallback(async () => {
    try {
      const fetch = await request("/api/clients/reseption", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      });
      setClients(fetch);
    } catch (e) { }
  }, [request]);

  const allTurns = useCallback(async () => {
    try {
      const sec = await request("/api/section/reseption", "GET", null, {
        Authorization: `Bearer ${auth.token}`
      });
      seTurns(sec);
    } catch (e) { }
  }, [request]);

  const searchClient = (id) => {
    clients.map((clt) => {
      if (clt.id === id) {
        setClient(clt);
      }
    });
  };

  const createAllSections = () => {
    sections.map((section) => {
      create(section);
    });
    history.push(`/reseption/reciept/${client._id}`);
  };

  const create = async (section) => {
    try {
      const data = await request(`/api/section/reseption/register/${client._id}`, "POST", { ...section }, {
        Authorization: `Bearer ${auth.token}`
      });
      console.log(data);
    } catch (e) { }
  };

  useEffect(() => {
    allClients();
    allTurns();
  }, [allClients, allTurns]);

  useEffect(() => {
    allTurns();
  }, [allTurns]);

  useEffect(() => {
    if (error) {
      notify(error);
      clearError();
    }
  }, [error, clearError]);

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
      return true;
    return false;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="row">
        <div className="col-12 mt-3 d-flex justify-content-center align-items-center">
          <h4 className="text-right">Mijozning ma'lumotlarini kiritish</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 input_box" data-aos="fade-right">
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
        <div className="col-md-6 input_box" data-aos="fade-left">
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
        <div className="col-md-6 input_box" data-aos="fade-right">
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
        <div className="col-md-6 input_box" data-aos="fade-left">
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
        <div className="col-md-6 input_box" data-aos="fade-right">
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
        <div className="col-md-6 input_box" data-aos="fade-left">
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
      <hr className="form-control" />

      <div className="row">
        <div className="col-md-12" data-aos="zoom-out">
          <label className="labels">qayta tanlaganda narx o'chib ketadi</label>
          <Select
            className="mt-3"
            onChange={(event) => changeSections(event)}
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={[
              { value: "Lor", label: "Lor" },
              { value: "Kardiolog", label: "Kardilog" },
              { value: "Terapevt", label: "Terapevt" },
            ]}
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
                  defaultValue={section.price}
                  onChange={createSections}
                  id={key}
                  type="number"
                  name={section.name}
                  className="form-control"
                  placeholder={section.name + " summasi"}
                />
              </div>
              <div className="col-5">
                <label className="text-muted mandatory">{ } navbati</label>
                <input
                  // onChange={changeHandlar}
                  type="number"
                  className="form-control"
                  placeholder="section"
                  value={section.turn}
                  disabled
                />
              </div>
            </>
          );
        })}
      </div>
      {/* <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="text-muted mandatory d-block">Maqsad</label>
                        <div className="btn-group" data-toggle="buttons">
                            <label htmlFor="intact" className="btn btn-primary form-check-label">
                                <input
                                    onChange={changeHandlar}
                                    name="intact"
                                    className="form-check-input"
                                    type="radio"
                                    defaultValue="Ko`rik"
                                />
                                Ko`rik
                            </label>
                            <label htmlFor="intact" className="btn btn-primary form-check-label">
                                <input
                                    onChange={changeHandlar}
                                    defaultValue="Davolanish"
                                    name="intact"
                                    className="form-check-input"
                                    type="radio"
                                />
                                Davolanish
                            </label>
                        </div>
                    </div>
                </div>

            </div> */}
      <div className="mt-3 text-center" data-aos="fade-up">
        <button
          onClick={createAllSections}
          className="btn btn-primary profile-button"
        >
          Saqlash
        </button>
      </div>
    </>
  );
};
