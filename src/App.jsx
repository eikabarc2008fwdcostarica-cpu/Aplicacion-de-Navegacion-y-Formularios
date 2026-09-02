import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Inicio from './pages/Inicio'
import Informacion from './pages/Informacion'
import Formulario from './pages/Formulario'
import Contacto from './pages/Contacto'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/informacion" element={<Informacion />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Ruta comodín de respaldo */}
          <Route path="*" element={<Inicio />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>Práctica de React Router y Formularios Controlados &copy; 2026</p>
      </footer>
    </div>
  )
}

export default App
