import React from 'react'
import { CheckCashier } from './CheckCashier'

export const CreateCheck = () => {
    return (

            <div className="row" >
                <div className=" col-lg-8 offset-lg-2 mt-5">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button className="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                            To'lov qilinmagan bo'limlar
                        </button>
                        <button className="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                            Avval xizmat ko'rsatilgan mijoz
                        </button>
                    </div>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                            <CheckCashier />
                        </div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                            {/* <OldClient /> */}
                        </div>
                    </div>
                </div>
        </div>
    )
}
