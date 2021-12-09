import React from 'react'
import { Link } from 'react-router-dom'
import DirectorIcon from '../icons/director.png'

export const Director = () => {
    return (
        <div>
            <Link to="/director">
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
                                <img src={DirectorIcon} alt="rasm" />
                            </div>
                        </div>
                    </div>

                </article>
            </Link>
        </div>
    )
}
