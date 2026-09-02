import { Link, useNavigate } from 'react-router-dom'
import { Network, Database, CheckCircle2, ArrowRight, Mail, Compass } from 'lucide-react'

function Informacion() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Información del Proyecto</h1>
        <p className="page-subtitle">
          Conceptos fundamentales aplicados en esta práctica de React.
        </p>
      </header>

      <div className="info-grid">
        <article className="info-card">
          <div className="info-header">
            <div className="info-tag">
              <Network size={14} />
              <span>Enrutamiento</span>
            </div>
            <Compass className="info-card-icon" />
          </div>
          <h2>¿Qué es React Router DOM?</h2>
          <p>
            Es la librería estándar para el manejo de rutas en aplicaciones React de una sola página (SPA). Permite renderizar componentes de forma condicional basándose en la URL sin refrescar la página.
          </p>
          <ul className="info-list">
            <li>
              <CheckCircle2 className="info-check-icon" />
              <span><strong>BrowserRouter:</strong> Sincroniza la interfaz con la URL usando la API History de HTML5.</span>
            </li>
            <li>
              <CheckCircle2 className="info-check-icon" />
              <span><strong>Routes & Route:</strong> Define el mapeo entre rutas y componentes.</span>
            </li>
            <li>
              <CheckCircle2 className="info-check-icon" />
              <span><strong>Link:</strong> Permite navegación declarativa accesible y eficiente.</span>
            </li>
          </ul>
        </article>

        <article className="info-card">
          <div className="info-header">
            <div className="info-tag">
              <Database size={14} />
              <span>Estado</span>
            </div>
            <Database className="info-card-icon" />
          </div>
          <h2>Formularios Controlados con useState</h2>
          <p>
            En un componente controlado, los datos del formulario son manejados por el estado del componente React. Cada cambio de entrada activa una función que actualiza el estado correspondiente.
          </p>
          <ul className="info-list">
            <li>
              <CheckCircle2 className="info-check-icon" />
              <span>Sincronización bidireccional entre el input y el estado de React.</span>
            </li>
            <li>
              <CheckCircle2 className="info-check-icon" />
              <span>Validación y manipulación instantánea de datos ingresados.</span>
            </li>
            <li>
              <CheckCircle2 className="info-check-icon" />
              <span>Acceso directo a la información al disparar el evento <code>onSubmit</code>.</span>
            </li>
          </ul>
        </article>
      </div>

      <div className="cta-box">
        <h3>¿Listo para probar el formulario?</h3>
        <p>Experimenta el manejo de estado en tiempo real y revisa la consola del navegador.</p>
        <div className="cta-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/formulario')}
            id="btn-info-formulario"
          >
            <span>Completar Formulario</span>
            <ArrowRight className="btn-icon" />
          </button>
          <Link to="/contacto" className="btn btn-secondary">
            <Mail className="btn-icon" />
            <span>Ir a Contacto</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Informacion
