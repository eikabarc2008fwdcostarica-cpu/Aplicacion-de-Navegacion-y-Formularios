import { useNavigate } from 'react-router-dom'
import { Compass, Zap, ClipboardList, ArrowRight, Sparkles } from 'lucide-react'

function Inicio() {
  const navigate = useNavigate()

  const handleIrAFormulario = () => {
    navigate('/formulario')
  }

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles className="hero-badge-icon" />
          <span>Práctica de React Router & Hooks</span>
        </div>
        <h1 className="hero-title">
          Bienvenido a la Aplicación de Navegación y Formularios
        </h1>
        <p className="hero-description">
          Esta plataforma demuestra el uso de rutas declarativas con{' '}
          <code>react-router-dom</code>, navegación programática con{' '}
          <code>useNavigate</code> y formularios interactivos controlados con el
          hook <code>useState</code>.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleIrAFormulario}
            id="btn-ir-formulario"
          >
            <span>Ir al Formulario (Navegación Programática)</span>
            <ArrowRight className="btn-icon" />
          </button>
        </div>
      </section>

      <section className="cards-grid">
        <div className="card">
          <div className="card-icon-container">
            <Compass className="card-icon-svg" />
          </div>
          <h3 className="card-title">Rutas Dinámicas</h3>
          <p className="card-text">
            Navegación fluida entre vistas sin recarga del navegador gracias a React Router.
          </p>
        </div>

        <div className="card">
          <div className="card-icon-container">
            <Zap className="card-icon-svg" />
          </div>
          <h3 className="card-title">Navegación Programática</h3>
          <p className="card-text">
            Uso del hook <code>useNavigate</code> para controlar el flujo de navegación mediante eventos.
          </p>
        </div>

        <div className="card">
          <div className="card-icon-container">
            <ClipboardList className="card-icon-svg" />
          </div>
          <h3 className="card-title">Formularios Controlados</h3>
          <p className="card-text">
            Gestión de estado individual con <code>useState</code> y captura en tiempo real de datos.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Inicio
