import { Link, useLocation } from 'react-router-dom'
import { Home, Info, ClipboardList, Mail, Sun, Moon, Layers } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-badge">
            <Layers size={14} />
            React
          </span>
          <span className="brand-title">Rutas & Form</span>
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
              to="/informacion"
              className={`nav-link ${location.pathname === '/informacion' ? 'active' : ''}`}
            >
              <Info className="nav-link-icon" />
              <span>Información</span>
            </Link>
            <Link
              to="/formulario"
              className={`nav-link ${location.pathname === '/formulario' ? 'active' : ''}`}
            >
              <ClipboardList className="nav-link-icon" />
              <span>Formulario</span>
            </Link>
            <Link
              to="/contacto"
              className={`nav-link ${location.pathname === '/contacto' ? 'active' : ''}`}
            >
              <Mail className="nav-link-icon" />
              <span>Contacto</span>
            </Link>
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
