import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import { useHttp } from '../../hooks/http.hook';

export const SimpleChartStatsionar = () => {

  const auth = useContext(AuthContext)
  const { request } = useHttp()
  const [data, setData] = useState([
    {
      name: "Yanvar",
      daromad: 0
    },
    {
      name: "Fevral",
      daromad: 0
    },
    {
      name: "Mart",
      daromad: 0
    },
    {
      name: "Aprel",
      daromad: 0
    },
    {
      name: "May",
      daromad: 0
    },
    {
      name: "Iyun",
      daromad: 0
    },
    {
      name: "Iyul",
      daromad: 0
    },
    {
      name: "Avgust",
      daromad: 0
    },
    {
      name: "Sentabr",
      daromad: 0
    },
    {
      name: "Oktabr",
      daromad: 0
    },
    {
      name: "Noyabr",
      daromad: 0
    },
    {
      name: "Dekabr",
      daromad: 0
    }
  ]
  )
  const [sections, setSections] = useState()

  const getAllSections = useCallback(async () => {
    try {
      const fetch = await request(`/api/section/directorproceedsstatsionar`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let d = data
      fetch.map((daromad, index) => {
        d[index].daromad = daromad

      })
      setData(d)
      setSections(0)
    } catch (e) {

    }
  }, [request, auth, data, setData, sections])


  useEffect(() => {
    if (!sections) {
      getAllSections()
    }
  }, [])


  return (
    <div className="card">
      <div className="card-header text-center pt-3">
        <h4>Daromad(Statsionar)</h4>
      </div>
      <div className="card-body p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={250}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="daromad" fill="#FFC007" background={{ fill: '#eee' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
