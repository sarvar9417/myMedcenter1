import React from 'react'
import { Link } from 'react-router-dom'
import cashier from '../icons/cashier.png'
import '../sayt.css'

export const Cashier = () => {
    return (
        <div>
            <Link to="/cashier">
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
                                <img src={cashier} alt="rasm" />
                            </div>
                        </div>
                    </div>

                </article>
            </Link>
        </div>
    )
}
