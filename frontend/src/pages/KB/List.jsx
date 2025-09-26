import React, { useState } from 'react'
import api from '../../services/api'

export default function KBList() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])

  const search = async () => {
    try {
      const res = await api.get(`/kb/search?q=${encodeURIComponent(q)}`)
      setResults(res.data.data)
    } catch (e) {}
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Knowledge Base</h3>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e => setQ(e.target.value)} className="flex-1 border px-3 py-2 rounded" placeholder="Search articles" />
        <button onClick={search} className="px-4 py-2 bg-brand text-white rounded">Search</button>
      </div>
      <div className="space-y-3">
        {results.map(r => (
          <div key={r._id} className="border p-3 rounded">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-gray-500">{r.department}</div>
            <div className="text-sm mt-2">{r.content.substring(0, 200)}...</div>
          </div>
        ))}
      </div>
    </div>
  )
}
