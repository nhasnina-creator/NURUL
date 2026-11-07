import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toasts } from './components/ui'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Learning from './pages/Learning'
import Projects from './pages/Projects'
import Schedule from './pages/Schedule'
import Activities from './pages/Activities'
import Resources from './pages/Resources'
import About from './pages/About'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-10 pt-24 sm:px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toasts />
    </div>
  )
}
