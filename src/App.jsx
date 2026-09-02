import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import RutaProtegida from './components/RutaProtegida'
import Inicio from './pages/Inicio'
import ProductosCRUD from './pages/ProductosCRUD'
import Login from './pages/Login'
import PanelAnalisis from './pages/PanelAnalisis'
import AsistenteIA from './pages/AsistenteIA'
import './App.css'

function App() {
  const navigate = useNavigate()

  // Estado global de autenticación sincronizado con localStorage
  const [usuario, setUsuario] = useState(() => {
    try {
      const sesionGuardada = localStorage.getItem('auth-user')
      return sesionGuardada ? JSON.parse(sesionGuardada) : null
    } catch {
      return null
    }
  })

  const estaAutenticado = Boolean(usuario)

  const handleLoginSuccess = (datosUsuario) => {
    setUsuario(datosUsuario)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-user')
    setUsuario(null)
    navigate('/login')
  }

  return (
    <div className="app-layout">
      <Navbar
        estaAutenticado={estaAutenticado}
        usuario={usuario}
        onCerrarSesion={handleLogout}
      />

      <main className="main-content">
        <Routes>
          {/* Ruta pública principal */}
          <Route path="/" element={<Inicio />} />

          {/* Catálogo y gestión CRUD de productos */}
          <Route path="/productos" element={<ProductosCRUD />} />

          {/* Asistente Inteligente de Inventario */}
          <Route path="/asistente" element={<AsistenteIA />} />

          {/* Inicio de sesión */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Ruta protegida exclusiva para administradores */}
          <Route
            path="/admin/analisis"
            element={
              <RutaProtegida estaAutenticado={estaAutenticado}>
                <PanelAnalisis />
              </RutaProtegida>
            }
          />

          {/* Ruta comodín de respaldo: redirige a Inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>
          Sistema de Navegación, CRUD y Analítica en React &copy; {new Date().getFullYear()} &bull; Arquitectura por Capas
        </p>
      </footer>
    </div>
  )
}

export default App
