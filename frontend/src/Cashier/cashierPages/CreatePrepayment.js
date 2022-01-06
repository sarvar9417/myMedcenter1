import React from 'react'
import { Prepayment } from './Prepayment'

export const CreatePrepayment = () => {
    return (

        <div className="row" >
            <div className=" col-lg-8 offset-lg-2 mt-5">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                        Oldindan to'lov
                    </button>
                </div>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                        <Prepayment />
                    </div>
                </div>
            </div>
        </div>
    )
}
