import React, { useCallback, useContext, useEffect, useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart';
import DatePicker from "react-datepicker"
import 'react-funnel-pipeline/dist/index.css'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import ReactApexChart from 'react-apexcharts'

export const Reklama = () => {
  const [t, setT] = useState()
  const [adver, setAdver] = useState({
    series: [1, 1, 1, 1, 1],
    options: {
      chart: {
        type: 'donut',
      },
      labels: [],
      dataLabels: {
        formatter(val, opts) {
          const name = opts.w.globals.labels[opts.seriesIndex]
          return [name, val.toFixed(1) + '%']
        }
      },
      responsive: [{
        breakpoint: 300,
        options: {
          chart: {
            width: 200
          }
        }
      }],
      legend: {
        show: false
      }
    },
  })
  const auth = useContext(AuthContext)
  const { request } = useHttp()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const getAdver = useCallback(async () => {
    try {
      const fetch = await request(`/api/connector/marketing/${startDate}/${endDate}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let a = adver
      fetch.sources.map((source, index) => {
        a.options.labels.push(source.name)
      })
      fetch.connectors.map((connector) => {
        a.options.labels.map((ad, index) => {
          if (connector.source === ad) {
            a.series[index] = a.series[index] + 1
          }
        })
      })
      console.log(a);
      setAdver(a)
    } catch (e) {
    }
  }, [request, auth, setAdver, startDate, endDate, adver])

  const searchDate = () => {
    getAdver()
  }

  useEffect(() => {
    if (!t) {
      getAdver()
    }
    if (adver.options.labels.length > 0) {
      setT(1)
    }
  }, [setT, getAdver])


  return (
    <div className="card">
      <div className="card-header text-center pt-3">
        <div className='row'>
          <div className="col-3 pt-2">
            <DatePicker className="form-control mb-2" selected={startDate} onChange={(date) => { setStartDate(date) }} />
          </div>
          <div className='col-6'>
            <button onClick={searchDate} className='btn fs-3' style={{ fontWeight: "600" }} >Reklama</button>
          </div>
          <div className="col-3 pt-2">
            <DatePicker className="form-control mb-2" selected={endDate} onChange={(date) => setEndDate(date)} />
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        {adver.options.labels.length > 0 ? <ReactApexChart type="donut" options={adver.options} series={adver.series} type="donut" /> : ""}
      </div>

    </div>
  )
}
