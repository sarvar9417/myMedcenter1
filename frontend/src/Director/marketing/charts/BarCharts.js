import React, { useCallback, useContext, useEffect, useState } from 'react'
import { FunnelChart } from 'react-funnel-pipeline'
import DatePicker from "react-datepicker"
import 'react-funnel-pipeline/dist/index.css'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

export const BarCharts = () => {
  const [calls, setCalls] = useState()
  const auth = useContext(AuthContext)
  const { request } = useHttp()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const getAllCalls = useCallback(async () => {
    try {
      const fetch = await request(`/api/callcenter/reseption/${startDate}/${endDate}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let d = [
        { name: "Barchasi", value: 1 },
        { name: "Javobsiz", value: 1 },
        { name: "Qiziqmadi", value: 1 },
        { name: "Qayta qo'ng'iroq", value: 1 },
        { name: "O'ylab ko'radi", value: 1 },
        { name: "Kelmoqchi", value: 1 },
        { name: "Kelgan", value: 1 },
      ]
      fetch.calls.map((call, index) => {
        d[0].value = d[0].value + 1
        if (call.position === "Javobsiz") {
          d[1].value = d[1].value + 1
        }
        if (call.position === "Qiziqmadi") {
          d[2].value = d[2].value + 1
        }
        if (call.position === "Qayta qo'ng'iroq") {
          d[3].value = d[3].value + 1
        }
        if (call.position === "O'ylab ko'radi") {
          d[4].value = d[4].value + 1
        }
        if (call.position === "Kelmoqchi") {
          d[5].value = d[5].value + 1
        }
        if (call.position === "Kelgan") {
          d[6].value = d[6].value + 1
        }

      })
      setCalls(d)
    } catch (e) {

    }
  }, [request, auth, setCalls, startDate, endDate])

  const searchDate = () => {
    getAllCalls()
  }

  useEffect(() => {
    if (!calls) {
      getAllCalls()
    }
  }, [])


  return (
    <div className="card">
      <div className="card-header text-center pt-3">
        <div className='row'>
          <div className="col-3 pt-2">
            <DatePicker className="form-control mb-2 mt-5" selected={startDate} onChange={(date) => { setStartDate(date) }} />
          </div>
          <div className='col-6'>
            <div className='fs-3 fw-bolder pb-1'>CallCenter</div> 
            <button className='btn btn-outline-primary mt-2' onClick={searchDate} style={{ fontWeight: "600" }} >
             Qidirish
            </button>
          </div>
          <div className="col-3 pt-2 mt-5">
            <DatePicker className="form-control mb-2" selected={endDate} onChange={(date) => setEndDate(date)} />
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        <FunnelChart

          data={calls && calls}
        />

      </div>
      <div className='card-footer row'>
        <div className='col-12 text-center'>
          <Link to="/director/callcenter" className='fw-bold text-success'>Mijozalar</Link>
        </div>
      </div>
    </div>
  )
}
