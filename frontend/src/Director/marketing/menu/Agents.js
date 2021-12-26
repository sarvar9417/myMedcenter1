import React from 'react'
import { Link } from 'react-router-dom'

export const Agents = () => {
    return (
        <div className="col-lg-3 col-6">
            {/* small box */}
            <Link to='/director/counteragents' className="small-box bg-success">
                <div className="inner">
                    <h5>Kontragentlar</h5>
                    <p> {new Date().toLocaleDateString()} </p>
                </div>
                <div className="icon">
                    <i className="ion ion-stats-bars" />
                </div>
                <a href="#" className="small-box-footer"> <i className="fas fa-arrow-circle-right" /></a>
            </Link>
        </div>
    )
}
