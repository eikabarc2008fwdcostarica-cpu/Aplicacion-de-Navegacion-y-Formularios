import { Link, useNavigate } from 'react-router-dom'
import { Mail, MapPin, MessageSquare, ArrowRight, Home } from 'lucide-react'

function Contacto() {
  const navigate = useNavigate()

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Canales de Contacto</h1>
        <p className="page-subtitle">
          Ponte en contacto con nuestro equipo o déjanos tus datos a través de nuestro formulario.
        </p>
      </header>

      <div className="cards-grid">
        <div className="card contact-card">
          <div className="card-icon-container">
            <Mail className="card-icon-svg" />
          </div>
          <h3 className="card-title">Correo Electrónico</h3>
          <p className="card-text">contacto@ejemplo.com</p>
          <span className="card-hint">Respuesta en menos de 24 horas</span>
        </div>

        <div className="card contact-card">
          <div className="card-icon-container">
            <MapPin className="card-icon-svg" />
          </div>
          <h3 className="card-title">Ubicación</h3>
          <p className="card-text">Campus Tecnológico, Edificio 3</p>
          <span className="card-hint">Atención presencial de L a V</span>
        </div>

        <div className="card contact-card">
          <div className="card-icon-container">
            <MessageSquare className="card-icon-svg" />
          </div>
          <h3 className="card-title">Soporte y Asistencia</h3>
          <p className="card-text">Línea directa para estudiantes</p>
          <span className="card-hint">Horario: 8:00 AM - 6:00 PM</span>
        </div>
      </div>

      <div className="cta-box contact-cta">
        <h3>¿Deseas enviar tus datos directamente?</h3>
        <p>Utiliza nuestro formulario con validación y captura de estado en React.</p>
        <div className="cta-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/formulario')}
            id="btn-contacto-formulario"
          >
            <span>Ir al Formulario de Registro</span>
            <ArrowRight className="btn-icon" />
          </button>
          <Link to="/" className="btn btn-secondary">
            <Home className="btn-icon" />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Contacto
