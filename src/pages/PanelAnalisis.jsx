import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  BarChart3,
  Boxes,
  Layers,
  DollarSign,
  Package,
  RefreshCw,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Lightbulb,
} from 'lucide-react'
import { obtenerProductos } from '../services/productosService'
import { generarDiagnosticoInventario } from '../services/aiService'
import { useTheme } from '../context/ThemeContext'

// Tooltip personalizado declarado fuera del render para evitar recreaciones
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload
    return (
      <div className="chart-custom-tooltip">
        <div className="tooltip-category">{label}</div>
        <div className="tooltip-item">
          <span>Stock total:</span>
          <strong>{dataItem.stock} unidades</strong>
        </div>
        <div className="tooltip-item">
          <span>Variedad de productos:</span>
          <strong>{dataItem.cantidad} artículos</strong>
        </div>
        <div className="tooltip-item">
          <span>Valorización:</span>
          <strong>${Number(dataItem.valor).toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>
    )
  }
  return null
}

function PanelAnalisis() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [metricaActiva, setMetricaActiva] = useState('stock') // 'stock' | 'valor' | 'cantidad'
  const [diagnosticoIA, setDiagnosticoIA] = useState(null)
  const [generandoIA, setGenerandoIA] = useState(false)
  const { isDark } = useTheme()

  const cargarDatos = async () => {
    try {
      setCargando(true)
      setError('')
      const datos = await obtenerProductos()
      setProductos(Array.isArray(datos) ? datos : [])
    } catch (err) {
      setError(`No se pudieron cargar los datos analíticos: ${err.message}`)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let montado = true
    obtenerProductos()
      .then((datos) => {
        if (montado) {
          setProductos(Array.isArray(datos) ? datos : [])
        }
      })
      .catch((err) => {
        if (montado) {
          setError(`No se pudieron cargar los datos analíticos: ${err.message}`)
        }
      })
      .finally(() => {
        if (montado) {
          setCargando(false)
        }
      })

    return () => {
      montado = false
    }
  }, [])

  const handleGenerarInformeIA = async () => {
    try {
      setGenerandoIA(true)
      const informe = await generarDiagnosticoInventario(productos)
      setDiagnosticoIA(informe)
    } catch (err) {
      console.error('Error al generar informe con IA:', err)
    } finally {
      setGenerandoIA(false)
    }
  }

  // Agrupación y cálculo de métricas reales a partir del catálogo
  const resumenMetricas = productos.reduce(
    (acc, p) => {
      const precio = Number(p.precio) || 0
      const stock = Number(p.stock) || 0
      acc.totalStock += stock
      acc.valorTotal += precio * stock

      const cat = p.categoria || 'Sin Categoría'
      if (!acc.porCategoria[cat]) {
        acc.porCategoria[cat] = {
          categoria: cat,
          cantidad: 0,
          stock: 0,
          valor: 0,
        }
      }
      acc.porCategoria[cat].cantidad += 1
      acc.porCategoria[cat].stock += stock
      acc.porCategoria[cat].valor += precio * stock

      return acc
    },
    { totalStock: 0, valorTotal: 0, porCategoria: {} }
  )

  const datosGrafico = Object.values(resumenMetricas.porCategoria)
  const totalCategorias = datosGrafico.length

  return (
    <div className="page-container">
      <div className="page-header page-header-admin">
        <div className="admin-badge">
          <ShieldCheck size={16} />
          <span>Zona Exclusiva de Administrador</span>
        </div>
        <h1 className="page-title">Panel de Control & Análisis de Inventario</h1>
        <p className="page-subtitle">
          Métricas consolidadas, diagnóstico inteligente con IA y visualización gráfica procesada directamente del catálogo.
        </p>
      </div>

      {error && (
        <div className="alert-error" role="alert">
          <div className="alert-icon-wrapper">
            <AlertCircle className="alert-icon" />
          </div>
          <div>
            <strong>Error de Conexión</strong>
            <p className="alert-detail">{error}</p>
          </div>
        </div>
      )}

      {/* Tarjetas de Resumen Numérico (KPIs) */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-blue">
            <Package size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total de Productos</span>
            <span className="kpi-value">{productos.length}</span>
            <span className="kpi-helper">Artículos registrados</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-purple">
            <Layers size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Categorías Activas</span>
            <span className="kpi-value">{totalCategorias}</span>
            <span className="kpi-helper">Familias en catálogo</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-green">
            <Boxes size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Stock Total</span>
            <span className="kpi-value">{resumenMetricas.totalStock}</span>
            <span className="kpi-helper">Unidades en almacén</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper kpi-amber">
            <DollarSign size={24} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Valorización de Stock</span>
            <span className="kpi-value">
              ${Number(resumenMetricas.valorTotal).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="kpi-helper">Cálculo: precio &times; unidades</span>
          </div>
        </div>
      </section>

      {/* Gráfico Analítico Recharts */}
      <section className="chart-card">
        <div className="chart-card-header">
          <div>
            <div className="chart-title-group">
              <BarChart3 className="chart-title-icon" />
              <h2 className="chart-card-title">Distribución de Inventario por Categoría</h2>
            </div>
            <p className="chart-card-subtitle">
              Visualización interactiva procesada a partir de los datos de la base de datos simulada.
            </p>
          </div>

          <div className="chart-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm btn-ai-sparkle"
              onClick={handleGenerarInformeIA}
              disabled={generandoIA || cargando || productos.length === 0}
              id="btn-generar-informe-ia"
              title="Generar diagnóstico estratégico con IA"
            >
              <Sparkles size={16} className={generandoIA ? 'spinning' : ''} />
              <span>{generandoIA ? 'Analizando con IA...' : 'Generar Informe con IA'}</span>
            </button>

            <div className="metric-toggle-group">
              <button
                type="button"
                className={`btn-metric-toggle ${metricaActiva === 'stock' ? 'active' : ''}`}
                onClick={() => setMetricaActiva('stock')}
              >
                Stock (uds)
              </button>
              <button
                type="button"
                className={`btn-metric-toggle ${metricaActiva === 'cantidad' ? 'active' : ''}`}
                onClick={() => setMetricaActiva('cantidad')}
              >
                Cantidad Prod.
              </button>
              <button
                type="button"
                className={`btn-metric-toggle ${metricaActiva === 'valor' ? 'active' : ''}`}
                onClick={() => setMetricaActiva('valor')}
              >
                Valor ($)
              </button>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={cargarDatos}
              title="Refrescar métricas"
            >
              <RefreshCw size={15} className={cargando ? 'spinning' : ''} />
              <span>Refrescar</span>
            </button>
          </div>
        </div>

        {cargando ? (
          <div className="loading-state chart-loading">
            <RefreshCw className="spinning" size={32} />
            <p>Calculando estadísticas y renderizando gráfico...</p>
          </div>
        ) : datosGrafico.length === 0 ? (
          <div className="empty-state">
            <Package size={42} className="empty-icon" />
            <p>No hay datos suficientes para generar el gráfico estadístico.</p>
          </div>
        ) : (
          <div className="chart-container" style={{ width: '100%', height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosGrafico}
                margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#334155' : '#e2e8f0'}
                  vertical={false}
                />
                <XAxis
                  dataKey="categoria"
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 12 }}
                  tickLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 12 }}
                  tickLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Bar
                  dataKey={metricaActiva}
                  name={
                    metricaActiva === 'stock'
                      ? 'Stock Total (unidades)'
                      : metricaActiva === 'cantidad'
                      ? 'Número de Productos'
                      : 'Valoración ($ USD)'
                  }
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                  barSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Tarjeta de Diagnóstico Inteligente Generado con IA */}
      {diagnosticoIA && (
        <section className="ai-report-card" id="seccion-diagnostico-ia">
          <div className="ai-report-header">
            <div className="ai-report-title-group">
              <div className="ai-report-icon-box">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="ai-report-title">Diagnóstico Analítico con IA</h3>
                <p className="ai-report-subtitle">
                  Auditoría inteligente procesada en tiempo real sobre los datos del inventario.
                </p>
              </div>
            </div>

            <div className="ai-report-meta-group">
              <span className="ai-badge-source">
                {diagnosticoIA.fuente === 'gemini' ? 'Modelo Gemini 1.5' : 'Motor Analítico Heurístico'}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleGenerarInformeIA}
                disabled={generandoIA}
                title="Regenerar análisis"
              >
                <RefreshCw size={14} className={generandoIA ? 'spinning' : ''} />
                <span>Regenerar</span>
              </button>
            </div>
          </div>

          <div className="ai-report-body">
            <div className="ai-summary-callout">
              <p className="ai-summary-text">{diagnosticoIA.resumen}</p>
            </div>

            <div className="ai-columns-grid">
              <div className="ai-report-column">
                <div className="ai-column-header">
                  <AlertCircle size={18} className="ai-col-icon ai-col-icon-alert" />
                  <h4>Puntos de Atención & Alertas</h4>
                </div>
                <ul className="ai-feature-list">
                  {diagnosticoIA.alertas.map((alerta, idx) => (
                    <li key={idx} className="ai-feature-item ai-alert-item">
                      <span>{alerta}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ai-report-column">
                <div className="ai-column-header">
                  <Lightbulb size={18} className="ai-col-icon ai-col-icon-bulb" />
                  <h4>Recomendaciones Estratégicas</h4>
                </div>
                <ul className="ai-feature-list">
                  {diagnosticoIA.recomendaciones.map((rec, idx) => (
                    <li key={idx} className="ai-feature-item ai-rec-item">
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tabla Desglosada de Categorías */}
      <section className="table-container-card">
        <div className="table-header-meta">
          <div className="table-count-badge">
            <TrendingUp size={15} />
            <span>Desglose por Categoría</span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th scope="col">Categoría</th>
                <th scope="col" className="text-center">Artículos Únicos</th>
                <th scope="col" className="text-center">Stock Total</th>
                <th scope="col" className="text-right">Valor Estimado</th>
              </tr>
            </thead>
            <tbody>
              {datosGrafico.map((cat) => (
                <tr key={cat.categoria}>
                  <td>
                    <span className="category-pill">{cat.categoria}</span>
                  </td>
                  <td className="text-center">{cat.cantidad}</td>
                  <td className="text-center font-bold">{cat.stock} uds.</td>
                  <td className="text-right cell-price">
                    ${cat.valor.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default PanelAnalisis
