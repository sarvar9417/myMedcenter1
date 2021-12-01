import { Link } from 'react-router-dom'
import { Loading } from './Loading'
import { Particle } from './Particle'
import './sayt.css'
import AOS from 'aos'
import 'aos/dist/aos'
import ReseptionIcon from './icons/resption.png'
import Director from './icons/director.png'
import Cashier from './icons/cashier.png'
import Doctor from './icons/doctor.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'

export const Sayt = () => {

    const [loader, setLoader] = useState(false)
    useEffect(() => {
        AOS.init({
            duration: 2000
        })
    }, [])

    if (loader) {
        return <>
            <Loading />
        </>
    }

    return (
        <div className="body">
            {/* <Particle />  */}
            <div className="header">
                <h1>XALQ XIZMATI OLIY MAQSAD</h1>
            </div>
            <div className="links">
                <Link to="/reseption" data-aos="fade-right">
                    <article className="link cyan">
                        <div className="info">
                            <h2>QABUL BO'LIMI</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-6" style={{ marginTop: "31px" }}>
                                <button className="btn w-100 text-white" style={{ backgroundColor: "hsl(180, 62%, 55%)", }}>Kirish</button>
                            </div>
                            <div className="col-6">
                                <div className="image">
                                    <img src={ReseptionIcon} alt="rasm" />
                                </div>
                            </div>
                        </div>
                    </article>
                </Link>

                <Link to="/director" data-aos="fade-down">
                    <article className="link red">
                        <div className="info">
                            <h2>DIREKTOR</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-6" style={{ marginTop: "31px" }}>
                                <button className="btn w-100 text-white" style={{ backgroundColor: "#EA5353", }}>Kirish</button>
                            </div>
                            <div className="col-6">
                                <div className="image">
                                    <img src={Director} alt="rasm" />
                                </div>
                            </div>
                        </div>

                    </article>
                </Link>
                <Link data-aos="fade-up" to="/cashier">
                    <article className="link orange">
                        <div className="info">
                            <h2>KASSA</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-6" style={{ marginTop: "31px" }}>
                                <button className="btn w-100 text-white" style={{ backgroundColor: "#FCAE49", }}>Kirish</button>
                            </div>
                            <div className="col-6">
                                <div className="image">
                                    <img src={Cashier} alt="rasm" />
                                </div>
                            </div>
                        </div>

                    </article>
                </Link>
                <Link to="/doctor" data-aos="fade-left">
                    <article className="link blue">
                        <div className="info">
                            <h2>DOCTOR</h2>
                            <p></p>
                        </div>
                        <div className="row">
                            <div className="col-6" style={{ marginTop: "31px" }}>
                                <button className="btn w-100 text-white" style={{ backgroundColor: "#539EF1", }}>Kirish</button>
                            </div>
                            <div className="col-6">
                                <div className="image">
                                    <img src={Doctor} alt="rasm" />
                                </div>
                            </div>
                        </div>
                    </article>
                </Link>

            </div>

            <div className="d-inline-block rounded-circle" style={{ right: "30px", bottom: "30px", position: "fixed" }}>
                <Link className="card shadow bg-body rounded p-3 cards rounded-circle" to="/turn" style={{ color: "#38c172" }}>
                    <FontAwesomeIcon icon={faClock} className="fa-5x rounded-circle" />
                </Link>
            </div>
        </div>

    )
}