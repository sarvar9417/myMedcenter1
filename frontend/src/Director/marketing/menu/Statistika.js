import React from 'react'
import { Link } from 'react-router-dom'

export const Statistika = () => {
    return (
            <div className="col-lg-3 col-6">
                {/* small box */}
                <Link to={`/director`} className="small-box bg-info">
                    <div className="inner">
                        <h5>Statistika <span className="float-end"> </span></h5>
                        <p> {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="icon">
                        <i className="ion ion-bag" />
                    </div>
                    <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
                </Link>
            </div>
    )
}
