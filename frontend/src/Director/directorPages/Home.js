import React, { useCallback, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'


import "react-datepicker/dist/react-datepicker.css";
import { AddDoctor } from './AddDoctor'

export const Home = () => {
    const month = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]
    const auth = useContext(AuthContext)

    return (
        <>
            <div className="container mb-5">
                <article className="linkk mt-5" >
                    <h1>Alo/24 Director</h1>
                    <div className="row mt-2" style={{ borderBottom: "1px solid #999", borderTop: "1px solid #999", padding: "2rem 0" }}>
                        <div className="col-md-4 text-center">
                            <img style={{ width: "70%", borderRadius: "50%" }} src="https://www.medclean.com/wp-content/uploads/2018/03/doctor-in-white-coat-blog.jpg" />
                        </div>
                        <div className="col-md-6">
                            <h2>{auth.director && auth.director.lastname} {auth.director && auth.director.firstname} {auth.director && auth.director.fathername} </h2>
                            <p style={{ fontSize: "20px" }}> {auth.director && new Date(auth.director.born).getDate()} {auth.director && month[new Date(auth.director.born).getMonth()]} {auth.director && new Date(auth.director.born).getFullYear()}</p>
                            <p style={{ fontSize: "20px" }}> {auth.director && auth.director.section}</p>
                            <p style={{ fontSize: "20px" }}>+{auth.director && auth.director.phone}</p>
                            <p style={{ fontSize: "20px" }}>nosirovislom07@gmail.com</p>
                            <p style={{ textAlign: "right" }}>
                                <button className="btn text-white" style={{ backgroundColor: "rgb(83, 158, 241)", width: "20%", marginLeft: "5%" }}>Edit</button>
                            </p>

                        </div>

                    </div>
                    <div className="links mt-5">
                        <Link to="/director/clients" data-aos="fade-right">
                            <article className="link redd">
                                <div className="info">
                                    <h2>Mijozlar</h2>
                                    <p></p>
                                </div>
                                <div className="row">
                                    <div className="col-6" style={{ marginTop: "31px" }}>
                                        <button className="btn w-100 text-white" style={{ backgroundColor: "hsl(0, 78%, 62%)" }}>Kirish</button>
                                    </div>
                                </div>
                            </article>
                        </Link>

                        <Link data-aos="fade-up" to="/cashier">
                            <article className="link orangee">
                                <div className="info">
                                    <h2>KASSA</h2>
                                    <p></p>
                                </div>
                                <div className="row">
                                    <div className="col-6" style={{ marginTop: "31px" }}>
                                        <button className="btn w-100 text-white" style={{ backgroundColor: "#FCAE49", }}>Kirish</button>
                                    </div>

                                </div>

                            </article>
                        </Link>
                        <Link to="/director/doctors" data-aos="fade-left">
                            <article className="link blue">
                                <div className="info">
                                    <h2>DOCTOR</h2>
                                    <p></p>
                                </div>
                                <div className="row">
                                    <div className="col-6" style={{ marginTop: "31px" }}>
                                        <button className="btn w-100 text-white" style={{ backgroundColor: "#539EF1", }}>Kirish</button>
                                    </div>
                                </div>
                            </article>
                        </Link>

                    </div>

                </article>
            </div>

            <AddDoctor/>
        </>

    )
}
