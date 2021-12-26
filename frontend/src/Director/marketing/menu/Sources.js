import React from 'react'
import { Link } from 'react-router-dom'

export const Sources = () => {
    return (
        <div className="col-lg-3 col-6">
            {/* small box */}
            <Link to='/director/doctors' className="small-box bg-warning">
                <div className="inner text-white">
                    <h5>Reklama</h5>
                    <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div className="icon">
                    <i className="ion ion-person-add" />
                </div>
                <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
            </Link>
        </div>
    )
}
