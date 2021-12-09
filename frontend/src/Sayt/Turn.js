import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
export const Turn = () => {
    return (
        <div>
            <div className="d-inline-block rounded-circle" style={{ right: "30px", bottom: "30px", position: "fixed" }}>
                <Link className="card shadow bg-body rounded p-3 cards rounded-circle" to="/turn" style={{ color: "#38c172" }}>
                    <FontAwesomeIcon icon={faClock} className="fa-5x rounded-circle" />
                </Link>
            </div>
        </div>
    )
}
