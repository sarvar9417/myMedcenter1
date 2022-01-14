import React, { useCallback, useContext, useEffect, useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart';
import DatePicker from "react-datepicker"
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'

export const Reklama = () => {
  const [t, setT] = useState()
  const [adver, setAdver] = useState()
  const [label, setLabel] = useState()
  const auth = useContext(AuthContext)
  const { request } = useHttp()
  const COLORS = ['#0088FE', '#00C49F', '#fA01Ef', '#FFBB28', '#FF8042', '#00EEff'];
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const getAdver = useCallback(async () => {
    try {
      const fetch = await request(`/api/connector/marketing/${startDate}/${endDate}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let a = []
      let l = []
      fetch.sources.map((source, index) => {
        l.push({
          label: source.name
        })
        a.push({
          title: source.name,
          value: 1,
          color: COLORS[index]
        })
      })
      fetch.connectors.map((connector) => {
        a.map((source) => {
          if (source.name === connector.source) {
            source.value = source.value + 1
          }
        })
      })
      setAdver(a)
      setLabel(l)
    } catch (e) {
    }
  }, [request, auth, setAdver, startDate, endDate, adver, setLabel])

  const searchDate = () => {
    getAdver()
  }

  useEffect(() => {
    if (!adver) {
      getAdver()
    }

    // if (adver.options.labels.length > 0) {
    //   setT(1)
    // }
  }, [])


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
      <div className="card-body p-4 chart-container">
        <PieChart
          animation
          animationDuration={500}
          animationEasing="ease-out"
          width="300px"
          data={adver && adver}
          label={({ x, y, dx, dy, dataEntry }) => (
            <text
              x={x}
              y={y}
              dx={dx}
              dy={dy}
              dominant-baseline="central"
              text-anchor="middle"
              style={{ fontSize: "4pt", color: "white", }}
            >
              {dataEntry.title + `
              `
                + dataEntry.value}
            </text>
          )}
          lengthAngle={360}
          lineWidth={20}
          paddingAngle={0}
          radius={50}
          startAngle={0}
          viewBoxSize={[100, 100]}
          labelPosition={65}
          labelStyle={{
            fontSize: "10px",
            fontColor: "FFFFFF",
            fontWeight: "800",
          }}
        />
      </div>
      <style jsx>{`
        .chart-container {
          margin-left: auto;
          margin-right: auto;
          color: white
        }
      `}</style>

    </div>
  )
}
