import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../services/api'
import { getSocket } from '../../sockets/socket'
import { useAuth } from '../../context/AuthContext'
import AssignModal from '../../components/AssignModal'

export default function TicketView() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [showAssign, setShowAssign] = useState(false)
  const [agents, setAgents] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/tickets/${id}`)
        setTicket(res.data.data)
      } catch (e) {}
      setLoading(false)
    })()

    const socket = getSocket()
    if (socket) {
      socket.emit('joinTicketRoom', { ticketId: id })
      socket.on('newMessage', (payload) => {
        if (payload?.message) setTicket(prev => ({ ...prev, chat: [...(prev?.chat || []), payload.message] }))
      })
      socket.on('ticketUpdated', (p) => {
        // reload ticket
        api.get(`/tickets/${id}`).then(r => setTicket(r.data.data)).catch(() => {})
      })
    }

    return () => {
      const s = getSocket()
      if (s) s.emit('leaveTicketRoom', { ticketId: id })
    }
  }, [id])

  const send = async () => {
    if (!text.trim()) return
    try {
      const res = await api.post(`/tickets/${id}/messages`, { text })
      setTicket(prev => ({ ...prev, chat: [...(prev?.chat || []), res.data.data] }))
      setText('')
    } catch (e) {}
  }

  const openAssign = async () => {
    try {
      const res = await api.get('/users?role=Agent') // endpoint optional; otherwise use seed agents
      setAgents(res.data.data || [])
    } catch (e) {
      // fallback: empty
    }
    setShowAssign(true)
  }

  if (loading) return <div>Loading...</div>
  if (!ticket) return <div>Ticket not found</div>

  const isAgentOrAdmin = user?.role === 'Agent' || user?.role === 'Admin'

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2">{ticket.title}</h2>
          <div className="text-sm text-gray-500">{ticket.department} • {ticket.priority} • {ticket.status}</div>
        </div>
        {isAgentOrAdmin && <button className="px-3 py-1 bg-brand text-white rounded" onClick={openAssign}>Assign</button>}
      </div>

      <div className="mt-4 mb-6">{ticket.description}</div>

      <h4 className="font-semibold mb-2">Chat</h4>
      <div className="space-y-2 max-h-80 overflow-auto mb-4">
        {(ticket.chat || []).map((m, idx) => (
          <div key={idx} className={`chat-bubble ${String(m.sender) === String(ticket.customer._id) ? 'bg-gray-100' : 'bg-brand text-white ml-auto text-right'}`}>
            <div className="text-sm">{m.text}</div>
            <div className="text-xs text-gray-200 mt-1">{new Date(m.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 border px-3 py-2 rounded" placeholder="Write a message..." />
        <button onClick={send} className="px-4 py-2 bg-brand text-white rounded">Send</button>
      </div>

      {showAssign && <AssignModal ticketId={ticket._id} agents={agents} onClose={() => setShowAssign(false)} onAssigned={(t) => setTicket(t)} />}
    </div>
  )
}
