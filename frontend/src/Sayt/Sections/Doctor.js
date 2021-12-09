import React from 'react'
import { Link } from 'react-router-dom'
import doctor from '../icons/doctor.png'
import '../sayt.css'

export const Doctor = () => {
    return (
        <div>
            <Link to="/doctor">
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
                                <img src={doctor} alt="rasm" />
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </div>
    )
}
