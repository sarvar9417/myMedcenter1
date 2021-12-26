import React from 'react'
import { Link } from 'react-router-dom'

export const CallCenter = () => {
    return (
        <div className="col-lg-3 col-6">
            <Link to="/director/callcenter" className="small-box bg-danger">
                <div className="inner">
                    <h5>Call Center</h5>
                    <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div className="icon">
                    <i className="ion ion-pie-graph" />
                </div>
                <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
            </Link>
        </div>
    )
}
