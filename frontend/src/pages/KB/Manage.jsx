import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function KBManage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [department, setDepartment] = useState('Technical Support')
  const [articles, setArticles] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/kb/search?q=')
        setArticles(res.data.data || [])
      } catch (e) {}
    })()
  }, [])

  const create = async () => {
    try {
      const res = await api.post('/kb', { title, content, keywords: [], department })
      setArticles(prev => [res.data.data, ...prev])
      setTitle(''); setContent('')
    } catch (e) {}
  }

  return (
    <div>
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Create KB Article</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2 rounded mb-3" />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="w-full border px-3 py-2 rounded mb-3" rows={5} />
        <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full border px-3 py-2 rounded mb-3">
          <option>Technical Support</option>
          <option>Billing</option>
          <option>General Inquiry</option>
        </select>
        <button onClick={create} className="bg-brand text-white px-4 py-2 rounded">Create Article</button>
      </div>

      <div className="grid gap-3">
        {articles.map(a => (
          <div key={a._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{a.title}</div>
            <div className="text-sm text-gray-500">{a.department}</div>
            <div className="text-sm mt-2">{a.content.substring(0, 200)}...</div>
          </div>
        ))}
      </div>
    </div>
  )
}
