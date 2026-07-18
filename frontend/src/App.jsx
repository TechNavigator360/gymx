import { Routes, Route } from 'react-router-dom'
import CheckIn from './pages/CheckIn'
import Confirmation from './pages/Confirmation'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<CheckIn />} />
      <Route path="/confirmation" element={<Confirmation />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App