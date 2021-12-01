import React from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";


export const AddDoctor = () => {
    return (
        <>
            <div className="container">
                <div className="col-lg-6 offset-lg-3 linkk" style={{marginTop:"150px"}}>     
                    <h4 style={{textAlign:"center",padding:"15px 0"}}>Doctorning ma'lumotlarini kiritish</h4>
                    <div className="row">
                        <div className="col-md-6 input_box" data-aos="fade-right">
                            <input
                                name="lastname"
                                type="text"
                                className="form-control inp"
                                placeholder=""
                            />
                            <label className="labels">Familiya</label>
                        </div>
                        <div className="col-md-6 input_box" data-aos="fade-right">
                            <input
                                name="lastname"
                                type="text"
                                className="form-control inp"
                                placeholder=""
                            />
                            <label className="labels">Ism</label>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6 input_box" data-aos="fade-right">
                            <input
                                name="lastname"
                                type="text"
                                className="form-control inp"
                                placeholder=""
                            />
                            <label className="labels">Otasining ismi</label>
                        </div>
                        <div className="col-md-6 input_box" data-aos="fade-right">
                            <input
                                name="lastname"
                                type="date"
                                className="form-control inp"
                                placeholder=""
                            />
                            <label className="labels">Tug'ilgan kuni</label>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6 input_box" data-aos="fade-right">
                        <div className="wrapper">
                <input
                  className="input"
                  id="erkak"
                  name="gender"
                  type="radio"
                  defaultValue="man"
                />
                <label
                  className={"label"}
                  htmlFor="erkak"
                >
                  Erkak
                </label>
                <input
                  className="input"
                  type="radio"
                  id="ayol"
                  name="gender"
                  defaultValue="woman"
                />
                <label
                  className={
                     "label clabel"
                  }
                  htmlFor="ayol"
                >
                  Ayol
                </label>
              </div>
                        </div>
                        <div className="col-md-6 input_box" data-aos="fade-right">
                            <input
                                name="lastname"
                                type="number"
                                className="form-control inp"
                                placeholder=""
                            />
                            <label className="labels">Telefon nomer</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Select 
                                className="mt-3"
                                closeMenuOnSelect={false}
                                isMulti
                                options={[
                                { value: "Lor", label: "Lor" },
                                { value: "Kardiolog", label: "Kardilog" },
                                { value: "Terapevt", label: "Terapevt" },
                                ]}
                            />
                        </div>
                    </div>
                    <div className="mt-5 text-center" data-aos="fade-up">
                        <button  className="btn btn-primary profile-button">
                        Saqlash
                        </button>
                    </div>
                </div>
            </div>
            <hr />
            
            
        </>
    )
}
