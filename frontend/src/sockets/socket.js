import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

let socket = null

export const connectSocket = (token) => {
  if (!token) return null
  if (socket) return socket
  const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'
  socket = io(url, { auth: { token } })

  socket.on('connect', () => {
    console.log('socket connected', socket.id)
  })

  socket.on('newTicketCreated', (payload) => {
    // payload: { ticketId, title, department, status, priority }
    toast.info(`New ticket: ${payload.title}`)
  })

  socket.on('connect_error', (err) => {
    console.error('Socket connect error', err)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
