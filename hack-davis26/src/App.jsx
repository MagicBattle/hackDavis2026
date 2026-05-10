import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Scan from './Scan'

function App() {
  return (
    <BrowserRouter basename="/hackDavis2026/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scan" element={<Scan />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
