import React from 'react'
import { EditCallClient } from './EditCallClient'

export const EditClient = () => {
    return (
        <div className="container" >

            <div className="row" >
                <div className=" col-lg-6 offset-lg-3 mt-5">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                            Mijozni tahrirlash
                        </button>

                    </div>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                            <EditCallClient />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
