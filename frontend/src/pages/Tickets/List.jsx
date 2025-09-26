import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import TicketCard from '../../components/TicketCard'
import { Link } from 'react-router-dom'

export default function TicketsList() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/tickets')
        setTickets(res.data.data)
      } catch (e) {
        // handled by api interceptor
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Tickets</h3>
        <Link to="/tickets/new" className="text-brand">New Ticket</Link>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.length === 0 && <div className="text-sm text-gray-500">No tickets found</div>}
          {tickets.map(t => <TicketCard key={t._id} t={t} />)}
        </div>
      )}
    </div>
  )
}
