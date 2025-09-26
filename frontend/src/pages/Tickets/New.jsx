import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

export default function TicketNew() {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('Technical Support')
  const [priority, setPriority] = useState('Low')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    let active = true
    if (title.length > 2) {
      const t = setTimeout(async () => {
        try {
          const res = await api.get(`/kb/search?q=${encodeURIComponent(title)}`)
          if (active) setSuggestions(res.data.data)
        } catch (e) {}
      }, 300)
      return () => { active = false; clearTimeout(t) }
    } else {
      setSuggestions([])
    }
  }, [title])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/tickets', { title, description, department, priority })
      nav('/tickets')
    } catch (e) {
      // error toast via interceptor
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded" />
          {suggestions.length > 0 && (
            <ul className="bg-gray-50 border rounded mt-2 max-h-40 overflow-auto">
              {suggestions.map(s => (
                <li key={s._id} className="p-2 text-sm hover:bg-gray-100 cursor-pointer" onClick={() => { setTitle(s.title); setDescription(s.content); setSuggestions([]) }}>
                  <div className="font-semibold">{s.title}</div>
                  <div className="text-xs text-gray-500">{s.department}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="w-full border px-3 py-2 rounded" rows={6} />
        <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option>Technical Support</option>
          <option>Billing</option>
          <option>General Inquiry</option>
        </select>
        <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border px-3 py-2 rounded">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Urgent</option>
        </select>
        <button className="w-full bg-brand text-white py-2 rounded">Submit Ticket</button>
      </form>
    </div>
  )
}
