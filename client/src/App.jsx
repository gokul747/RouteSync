import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import Fleet from './pages/Fleet'
import Shipments from './pages/Shipments'
import Login from './pages/Login'
import { useAuth } from './context/AuthContext'

function Protected({ children }) { const { token } = useAuth(); return token ? children : <Navigate to="/login" replace /> }
export default function App() { return <Routes><Route path="/login" element={<Login />} /><Route path="/*" element={<Protected><AppShell><Routes><Route path="/" element={<Dashboard />} /><Route path="/fleet" element={<Fleet />} /><Route path="/shipments" element={<Shipments />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell></Protected>} /></Routes> }
