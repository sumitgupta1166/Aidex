import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function Analytics() {
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/tickets') // could be specialized endpoint
        const tickets = res.data.data || []
        const grouped = tickets.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1
          return acc
        }, {})
        setData(Object.entries(grouped).map(([name, value]) => ({ name, value })))
      } catch (e) {}
    })()
  }, [])

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Analytics</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
