import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '../services/api'
import { connectSocket, disconnectSocket } from '../sockets/socket'
import { toast } from 'react-toastify'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aidex_user') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('aidex_token')
    if (token) connectSocket(token)
    return () => disconnectSocket()
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, user: u } = res.data.data
      localStorage.setItem('aidex_token', token)
      localStorage.setItem('aidex_user', JSON.stringify(u))
      connectSocket(token)
      setUser(u)
      toast.success('Login successful')
      return u
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', payload)
      const { token, user: u } = res.data.data
      localStorage.setItem('aidex_token', token)
      localStorage.setItem('aidex_user', JSON.stringify(u))
      connectSocket(token)
      setUser(u)
      toast.success('Account created')
      return u
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('aidex_token')
      localStorage.removeItem('aidex_user')
      disconnectSocket()
      setUser(null)
      toast.info('Logged out')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
