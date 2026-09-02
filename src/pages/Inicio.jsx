import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Sparkles,
  Database,
  Layers,
} from 'lucide-react'

function Inicio() {
  const navigate = useNavigate()

  const handleExplorarCatalogo = () => {
    navigate('/productos')
  }

  const handleIrALogin = () => {
    navigate('/login')
  }

  return (
    <div className="page-container">
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles className="hero-badge-icon" />
          <span>Gestión Integral de Inventario & Analítica</span>
        </div>
        <h1 className="hero-title">
          Panel de Control y Catálogo de Productos Tecnológicos
        </h1>
        <p className="hero-description">
          Plataforma modular construida en React con arquitectura desacoplada por capas:
          servicios REST con JSON Server, operaciones CRUD completas, autenticación de administrador
          y visualización analítica con Recharts.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleExplorarCatalogo}
            id="btn-explorar-catalogo"
          >
            <span>Explorar Catálogo (useNavigate)</span>
            <ArrowRight className="btn-icon" />
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleIrALogin}
            id="btn-acceso-admin"
          >
            <ShieldCheck className="btn-icon" />
            <span>Acceso Administrador</span>
          </button>
        </div>
      </section>

      <section className="cards-grid">
        <div className="card">
          <div className="card-icon-container">
            <Database className="card-icon-svg" />
          </div>
          <h3 className="card-title">CRUD de Productos</h3>
          <p className="card-text">
            Creación, lectura, actualización y eliminación reactiva consumiendo
            una capa de servicios REST asíncrona conectada a JSON Server.
          </p>
          <div className="card-hint">
            <span>GET &bull; POST &bull; PATCH &bull; DELETE</span>
          </div>
        </div>

        <div className="card">
          <div className="card-icon-container">
            <ShieldCheck className="card-icon-svg" />
          </div>
          <h3 className="card-title">Autenticación & Rutas Protegidas</h3>
          <p className="card-text">
            Validación segura de credenciales de usuario con protección de rutas
            privadas mediante guardianes de navegación en React Router.
          </p>
          <div className="card-hint">
            <span>Sesión persistente en localStorage</span>
          </div>
        </div>

        <div className="card">
          <div className="card-icon-container">
            <BarChart3 className="card-icon-svg" />
          </div>
          <h3 className="card-title">Panel de Métricas</h3>
          <p className="card-text">
            Cálculo de métricas en tiempo real y gráficos interactivos con Recharts
            para análisis de stock y distribución por categorías.
          </p>
          <div className="card-hint">
            <span>Gráficos con ResponsiveContainer & BarChart</span>
          </div>
        </div>
      </section>

      <section className="architecture-banner">
        <div className="architecture-content">
          <div className="arch-header">
            <Layers className="arch-icon" />
            <h3>Arquitectura Limpia y Estricta</h3>
          </div>
          <p>
            Separación de responsabilidades: <code>services/</code> gestiona exclusivamente las conexiones HTTP,
            <code>components/</code> se enfoca en elementos reutilizables sin efectos secundarios, y
            <code>pages/</code> orquesta el flujo de datos y la experiencia de usuario.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Inicio
