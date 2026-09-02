import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  LogIn,
  KeyRound,
  Info,
} from 'lucide-react'
import { iniciarSesion } from '../services/authService'

/**
 * Vista de inicio de sesión para el administrador.
 * @param {Object} props
 * @param {Function} props.onLoginSuccess Callback para actualizar el estado global de autenticación en App
 */
function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errorMensaje, setErrorMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMensaje('')

    if (!usuario.trim() || !contrasena.trim()) {
      setErrorMensaje('Por favor ingresa tanto el usuario como la contraseña.')
      return
    }

    try {
      setCargando(true)
      // Invocación a la capa de servicios
      const usuarioAutenticado = await iniciarSesion(usuario.trim(), contrasena.trim())

      // Guardar en localStorage para persistencia
      localStorage.setItem('auth-user', JSON.stringify(usuarioAutenticado))

      // Notificar al componente raíz
      if (onLoginSuccess) {
        onLoginSuccess(usuarioAutenticado)
      }

      // Redirección programática a la ruta protegida
      navigate('/admin/analisis', { replace: true })
    } catch (err) {
      setErrorMensaje(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setCargando(false)
    }
  }

  // Ayudante para autocompletar credenciales de prueba
  const llenarDemoAdmin = () => {
    setUsuario('admin')
    setContrasena('admin123')
    setErrorMensaje('')
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-badge-icon">
            <ShieldCheck size={28} />
          </div>
          <h1 className="login-title">Acceso de Administrador</h1>
          <p className="login-subtitle">
            Ingresa tus credenciales para acceder al Panel de Análisis y Métricas protegidas.
          </p>
        </div>

        {errorMensaje && (
          <div className="alert-error" role="alert">
            <div className="alert-icon-wrapper">
              <AlertCircle className="alert-icon" />
            </div>
            <div>
              <strong>Error de Autenticación</strong>
              <p className="alert-detail">{errorMensaje}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" id="form-login">
          <div className="form-group">
            <label htmlFor="usuario" className="form-label">
              <User size={15} className="form-label-icon" />
              Usuario
            </label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                id="usuario"
                type="text"
                className="form-input"
                placeholder="Nombre de usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="contrasena" className="form-label">
              <Lock size={15} className="form-label-icon" />
              Contraseña
            </label>
            <div className="input-wrapper">
              <KeyRound className="input-icon" />
              <input
                id="contrasena"
                type="password"
                className="form-input"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-login"
            disabled={cargando}
            id="btn-submit-login"
          >
            <LogIn size={18} />
            <span>{cargando ? 'Verificando...' : 'Iniciar Sesión'}</span>
          </button>
        </form>

        <div className="login-demo-box">
          <div className="demo-box-header">
            <Info size={16} className="demo-icon" />
            <span>Credenciales de prueba del sistema:</span>
          </div>
          <div className="demo-box-credentials">
            <code>admin</code> / <code>admin123</code>
          </div>
          <button
            type="button"
            className="btn-fill-demo"
            onClick={llenarDemoAdmin}
            id="btn-llenar-demo"
          >
            Autocompletar credenciales demo
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
