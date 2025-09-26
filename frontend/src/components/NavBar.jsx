import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-semibold text-brand">Aidex</Link>
          {user && (
            <>
              <Link to="/tickets" className="text-sm text-gray-600 hover:text-brand">Tickets</Link>
              <Link to="/kb" className="text-sm text-gray-600 hover:text-brand">Knowledge Base</Link>
              {(user.role === 'Agent' || user.role === 'Admin') && (
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-brand">Dashboard</Link>
              )}
              {user.role === 'Admin' && (
                <>
                  <Link to="/analytics" className="text-sm text-gray-600 hover:text-brand">Analytics</Link>
                  <Link to="/kb/manage" className="text-sm text-gray-600 hover:text-brand">KB Manage</Link>
                </>
              )}
            </>
          )}
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-700">{user.name} • {user.role}</div>
              <button onClick={handleLogout} className="px-3 py-1 bg-red-50 text-red-600 rounded">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-brand">Login</Link>
              <Link to="/register" className="ml-2 text-sm text-gray-600">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
