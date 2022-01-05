import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
export const CallCenter = () => {
    return (
        <div>
            <div className="d-inline-block rounded-circle" style={{ left: "30px", bottom: "30px", position: "fixed" }}>
                <Link className="card shadow bg-body rounded p-3 cards rounded-circle" to="/callcenter" style={{ color: "#38c172" }}>
                    <FontAwesomeIcon icon={faPhone} className="fa-3x rounded-circle" />
                </Link>
            </div>
        </div>
    )
}
