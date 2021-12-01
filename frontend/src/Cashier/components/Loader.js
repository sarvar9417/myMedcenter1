import React from 'react'

export const Loader = () => {
    return (
        <div style={{textAlign:"center"}} className="m-5" >
            <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="visually-hidden">Loading...</span>
            </button>
        </div>
    )
}
