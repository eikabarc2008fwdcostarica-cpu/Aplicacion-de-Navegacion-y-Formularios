import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Package,
  Bot,
  LogIn,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  Layers,
  ShieldCheck,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

/**
 * Barra de navegación principal del sistema.
 * @param {Object} props
 * @param {boolean} props.estaAutenticado Indica si hay una sesión activa
 * @param {Object|null} props.usuario Información del usuario autenticado
 * @param {Function} props.onCerrarSesion Manejador para cerrar sesión
 */
function Navbar({ estaAutenticado, usuario, onCerrarSesion }) {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    if (onCerrarSesion) {
      onCerrarSesion()
    }
  }

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-badge">
            <Layers size={14} />
            Gestión
          </span>
          <span className="brand-title">TechStore Admin</span>
        </Link>

        <div className="navbar-actions">
          <nav className="navbar-links" aria-label="Navegación principal">
            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <Home className="nav-link-icon" />
              <span>Inicio</span>
            </Link>

            <Link
              to="/productos"
              className={`nav-link ${location.pathname === '/productos' ? 'active' : ''}`}
            >
              <Package className="nav-link-icon" />
              <span>Productos</span>
            </Link>

            <Link
              to="/asistente"
              className={`nav-link ${location.pathname === '/asistente' ? 'active' : ''}`}
              id="nav-link-asistente"
            >
              <Bot className="nav-link-icon" />
              <span>Asistente IA</span>
            </Link>

            {!estaAutenticado ? (
              <Link
                to="/login"
                className={`nav-link nav-link-highlight ${location.pathname === '/login' ? 'active' : ''}`}
              >
                <LogIn className="nav-link-icon" />
                <span>Iniciar Sesión</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/admin/analisis"
                  className={`nav-link nav-link-admin ${location.pathname === '/admin/analisis' ? 'active' : ''}`}
                >
                  <BarChart3 className="nav-link-icon" />
                  <span>Panel Análisis</span>
                </Link>

                <div className="navbar-user-chip" title={`Rol: ${usuario?.rol || 'administrador'}`}>
                  <ShieldCheck size={14} className="user-chip-icon" />
                  <span className="user-chip-name">{usuario?.usuario || 'Admin'}</span>
                </div>

                <button
                  type="button"
                  className="nav-logout-btn"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  id="btn-cerrar-sesion"
                >
                  <LogOut className="nav-link-icon" />
                  <span>Salir</span>
                </button>
              </>
            )}
          </nav>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            id="btn-theme-toggle"
          >
            {isDark ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
