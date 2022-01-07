import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import { curveCardinal } from 'd3-shape';
import { useHttp } from '../../hooks/http.hook';

export const BarChartsStatsionar = () => {
  const cardinal = curveCardinal.tension(1);
  const auth = useContext(AuthContext)
  const { request } = useHttp()
  const [data, setData] = useState([
    {
      name: "Yanvar",
      mijozlar: 0
    },
    {
      name: "Fevral",
      mijozlar: 0
    },
    {
      name: "Mart",
      mijozlar: 0
    },
    {
      name: "Aprel",
      mijozlar: 0
    },
    {
      name: "May",
      mijozlar: 0
    },
    {
      name: "Iyun",
      mijozlar: 0
    },
    {
      name: "Iyul",
      mijozlar: 0
    },
    {
      name: "Avgust",
      mijozlar: 0
    },
    {
      name: "Sentabr",
      mijozlar: 0
    },
    {
      name: "Oktabr",
      mijozlar: 0
    },
    {
      name: "Noyabr",
      mijozlar: 0
    },
    {
      name: "Dekabr",
      mijozlar: 0
    }
  ]
  )
  const [sections, setSections] = useState()

  const getAllConnectors = useCallback(async (index) => {
    try {
      const fetch = await request(`/api/connector/directorstatsionar`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let d = data
      fetch.map((month, index) => {
        d[index].mijozlar = month

      })
      setData(d)
      setSections(0)
    } catch (e) {

    }
  }, [request, auth, data, setData, sections])

  useEffect(() => {
    if (!sections) {
      getAllConnectors()
    }
  }, [])


  return (
    <div className="card">
      <div className="card-header text-center pt-3">
        <div className='row'>
          <div className='col-12'>
            <h4>Mijozlar oqimi (statsionar)</h4>
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis dataKey="mijozlar" />
            <Tooltip />
            <Area type="monotone" dataKey="uv" stroke="#FFC007" fill="#FFC007" fillOpacity={0.3} />
            <Area type={cardinal} dataKey="mijozlar" stroke="#FFC007" fill="#FFC007" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
