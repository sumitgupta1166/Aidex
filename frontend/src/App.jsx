import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'
import TicketsList from './pages/Tickets/List'
import TicketView from './pages/Tickets/View'
import TicketNew from './pages/Tickets/New'
import KBList from './pages/KB/List'
import KBManage from './pages/KB/Manage'
import Analytics from './pages/Admin/Analytics'
import { ToastContainer } from 'react-toastify'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/tickets" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/tickets" element={
            <ProtectedRoute>
              <TicketsList />
            </ProtectedRoute>
          } />
          <Route path="/tickets/new" element={
            <ProtectedRoute>
              <TicketNew />
            </ProtectedRoute>
          } />
          <Route path="/tickets/:id" element={
            <ProtectedRoute>
              <TicketView />
            </ProtectedRoute>
          } />

          <Route path="/kb" element={
            <ProtectedRoute>
              <KBList />
            </ProtectedRoute>
          } />
          <Route path="/kb/manage" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <KBManage />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['Agent','Admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/analytics" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Analytics />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3500} />
    </div>
  )
}
