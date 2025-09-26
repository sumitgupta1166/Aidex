import React from 'react'
import { Link } from 'react-router-dom'

export default function TicketCard({ t }) {
  return (
    <Link to={`/tickets/${t._id}`} className="block border p-3 rounded hover:shadow bg-white">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{t.title}</div>
          <div className="text-sm text-gray-500">{t.department} • {t.priority}</div>
        </div>
        <div className="text-sm text-gray-600">{t.status}</div>
      </div>
    </Link>
  )
}
