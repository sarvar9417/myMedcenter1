import React from 'react'
import { Link } from 'react-router-dom'
import ReseptionIcon from '../icons/resption.png'
import '../sayt.css'

export const Reseption = () => {
    return (
        <div>
            <Link to="/reseption">
                <article className="link cyan">
                    <div className="info">
                        <h2>QABUL</h2>
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
        </div>
    )
}
