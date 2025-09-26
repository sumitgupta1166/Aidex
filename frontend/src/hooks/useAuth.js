import { useState, useEffect } from 'react'
import api from '../services/api'
import { connectSocket, disconnectSocket } from '../sockets/socket'


export function useAuth() {
const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('aidex_user') || 'null'))
useEffect(() => {
const token = localStorage.getItem('aidex_token')
if (token) connectSocket(token)
return () => disconnectSocket()
}, [])


const login = async (email, password) => {
const res = await api.post('/auth/login', { email, password })
const { token, user } = res.data.data
localStorage.setItem('aidex_token', token)
localStorage.setItem('aidex_user', JSON.stringify(user))
connectSocket(token)
setUser(user)
return user
}


const register = async (payload) => {
const res = await api.post('/auth/register', payload)
const { token, user } = res.data.data
localStorage.setItem('aidex_token', token)
localStorage.setItem('aidex_user', JSON.stringify(user))
connectSocket(token)
setUser(user)
return user
}


const logout = async () => {
try { await api.post('/auth/logout') } catch (e) { /* ignore */ }
localStorage.removeItem('aidex_token')
localStorage.removeItem('aidex_user')
disconnectSocket()
setUser(null)
}


return { user, login, register, logout }
}