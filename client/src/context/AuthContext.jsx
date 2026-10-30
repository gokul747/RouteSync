import { createContext, useContext, useMemo, useState } from 'react'
import api from '../services/api'
const Context = createContext(null)
export function AuthProvider({ children }) { const [token, setToken] = useState(localStorage.getItem('routesync_token')); const [user, setUser] = useState(JSON.parse(localStorage.getItem('routesync_user') || 'null'))
  async function login(email, password) { const result = await api.post('/auth/login', { email, password }); localStorage.setItem('routesync_token', result.data.token); localStorage.setItem('routesync_user', JSON.stringify(result.data.user)); setToken(result.data.token); setUser(result.data.user) }
  async function register(name, email, password) { const result = await api.post('/auth/register', { name, email, password }); localStorage.setItem('routesync_token', result.data.token); localStorage.setItem('routesync_user', JSON.stringify(result.data.user)); setToken(result.data.token); setUser(result.data.user) }
  function logout() { localStorage.removeItem('routesync_token'); localStorage.removeItem('routesync_user'); setToken(null); setUser(null) }
  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]); return <Context.Provider value={value}>{children}</Context.Provider>
}
export const useAuth = () => useContext(Context)
