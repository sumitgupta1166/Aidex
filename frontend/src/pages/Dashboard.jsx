import React, { useEffect, useState } from 'react'
import api from '../services/api'
import TicketCard from '../components/TicketCard'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [newTickets, setNewTickets] = useState([])
  const [assigned, setAssigned] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const resAll = await api.get('/tickets?status=New')
        setNewTickets(resAll.data.data || [])
        if (user.role === 'Agent') {
          const resAssigned = await api.get('/tickets')
          setAssigned(resAssigned.data.data || [])
        } else if (user.role === 'Admin') {
          const resAssigned = await api.get('/tickets')
          setAssigned(resAssigned.data.data || [])
        }
      } catch (e) {}
      setLoading(false)
    })()
  }, [user])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Active Ticket</h3>
        <div className="text-sm text-gray-500">Select a ticket from queues to view details (click on ticket)</div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Queues</h4>
        {loading ? <div>Loading...</div> : (
          <>
            <div className="mb-3">
              <div className="font-semibold text-sm mb-1">New Tickets</div>
              <div className="space-y-2">
                {newTickets.map(t => <TicketCard key={t._id} t={t} />)}
              </div>
            </div>

            <div>
              <div className="font-semibold text-sm mb-1">Assigned / My Tickets</div>
              <div className="space-y-2">
                {assigned.map(t => <TicketCard key={t._id} t={t} />)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
