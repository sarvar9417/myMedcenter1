import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import { curveCardinal } from 'd3-shape';
import { useHttp } from '../../hooks/http.hook';

export const BarCharts = () => {
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
  const [sections, setSections] = useState(-1)

  const getAllSections = useCallback(async (index) => {
    try {
      const fetch = await request(`/api/section/director/${index}`, 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      let d = data
      d[index].mijozlar = fetch.count
      setData(d)
      setSections(fetch.count)
    } catch (e) {

    }
  }, [request, auth, data, setData, sections])

  const getMonth = () => {
    data.map((month, index) => {
      getAllSections(index)
    })
  }

  useEffect(() => {
    if (sections === -1) {
      getMonth()
    }
  }, [getMonth, sections])


  return (
    <div className="card">
      <div className="card-header text-center pt-3">
        <h4>Mijozlar oqimi</h4>
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
            <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            <Area type={cardinal} dataKey="mijozlar" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
