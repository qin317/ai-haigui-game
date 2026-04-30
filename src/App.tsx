import { Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Game } from './pages/Game'
import { Result } from './pages/Result'

function App() {
  return (
    <div className="min-h-svh bg-slate-950 text-slate-100 antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/result/:storyId" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
