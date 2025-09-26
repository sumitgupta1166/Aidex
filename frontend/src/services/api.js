import axios from 'axios'
import { toast } from 'react-toastify'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aidex_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Network error'
    // show toast for non-GET or on error
    if (err.config && !err.config.__suppressErrorToast) {
      toast.error(msg)
    }
    return Promise.reject(err)
  }
)

export default api
