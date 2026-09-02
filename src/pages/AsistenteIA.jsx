import { useState, useEffect, useRef } from 'react'
import {
  Bot,
  User,
  Send,
  Sparkles,
  RefreshCw,
  Zap,
  Clock,
} from 'lucide-react'
import { obtenerProductos } from '../services/productosService'
import { consultarAsistente } from '../services/aiService'

const PREGUNTAS_RAPIDAS = [
  '¿Qué producto tiene menor stock?',
  '¿Cuáles son los productos de Audio?',
  'Dame un resumen del catálogo',
  '¿Cuál es el artículo más costoso?',
  '¿Qué productos pertenecen a Periféricos?',
]

function obtenerHoraActual() {
  const ahora = new Date()
  return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function AsistenteIA() {
  const [productos, setProductos] = useState([])
  const [cargandoContexto, setCargandoContexto] = useState(true)
  const [inputMensaje, setInputMensaje] = useState('')
  const [pensando, setPensando] = useState(false)
  const idContadorRef = useRef(1)

  const [mensajes, setMensajes] = useState(() => [
    {
      id: 'bienvenida',
      remitente: 'asistente',
      texto:
        'Hola. Soy TechStore AI, tu asistente inteligente de inventario. Estoy conectado a la base de datos de productos en tiempo real. Puedes preguntarme sobre existencias, precios, categorías o balances comerciales.',
      hora: '10:00 AM',
      fuente: 'sistema',
    },
  ])

  const chatEndRef = useRef(null)

  // Carga inicial del inventario consumiendo productosService
  useEffect(() => {
    let montado = true
    obtenerProductos()
      .then((datos) => {
        if (montado) {
          setProductos(Array.isArray(datos) ? datos : [])
        }
      })
      .catch((err) => {
        console.error('Error al cargar inventario para el asistente:', err)
      })
      .finally(() => {
        if (montado) {
          setCargandoContexto(false)
        }
      })

    return () => {
      montado = false
    }
  }, [])

  // Auto-scroll al final del chat ante nuevos mensajes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, pensando])

  const enviarMensaje = async (textoAEnviar) => {
    const texto = (textoAEnviar || inputMensaje).trim()
    if (!texto || pensando) return

    idContadorRef.current += 1
    const nuevoIdUsuario = `user-${idContadorRef.current}`
    const horaMensaje = obtenerHoraActual()

    const mensajeUsuario = {
      id: nuevoIdUsuario,
      remitente: 'usuario',
      texto,
      hora: horaMensaje,
    }

    setMensajes((prev) => [...prev, mensajeUsuario])
    setInputMensaje('')
    setPensando(true)

    try {
      // Invocación a aiService consumiendo los productos reales
      const resultado = await consultarAsistente(texto, productos)
      idContadorRef.current += 1
      const nuevoIdIA = `ia-${idContadorRef.current}`

      const mensajeAsistente = {
        id: nuevoIdIA,
        remitente: 'asistente',
        texto: resultado.respuesta,
        hora: obtenerHoraActual(),
        fuente: resultado.fuente,
      }
      setMensajes((prev) => [...prev, mensajeAsistente])
    } catch (err) {
      idContadorRef.current += 1
      const mensajeError = {
        id: `err-${idContadorRef.current}`,
        remitente: 'asistente',
        texto: `Ocurrió un error al procesar tu consulta: ${err.message}`,
        hora: obtenerHoraActual(),
        fuente: 'error',
      }
      setMensajes((prev) => [...prev, mensajeError])
    } finally {
      setPensando(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    enviarMensaje()
  }

  const handlePreguntaRapida = (pregunta) => {
    enviarMensaje(pregunta)
  }

  const reiniciarConversacion = () => {
    idContadorRef.current += 1
    setMensajes([
      {
        id: `bienvenida-${idContadorRef.current}`,
        remitente: 'asistente',
        texto:
          'Conversación reiniciada. Puedes formular una nueva consulta sobre el inventario.',
        hora: obtenerHoraActual(),
        fuente: 'sistema',
      },
    ])
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="ai-badge">
          <Sparkles size={16} className="ai-badge-icon" />
          <span>Inteligencia Artificial de Negocio</span>
        </div>
        <h1 className="page-title">Asistente IA de Inventario</h1>
        <p className="page-subtitle">
          Consulta en lenguaje natural sobre niveles de stock, valorización, artículos críticos y métricas comerciales del catálogo.
        </p>
      </div>

      {/* Contenedor Principal del Chat */}
      <section className="chat-window-card">
        {/* Cabecera del Chat */}
        <div className="chat-window-header">
          <div className="chat-header-identity">
            <div className="bot-avatar">
              <Bot size={22} />
            </div>
            <div>
              <div className="bot-name-group">
                <h2 className="bot-name">TechStore Copilot</h2>
                <span className="bot-status-online">Activo</span>
              </div>
              <p className="bot-meta">
                {cargandoContexto
                  ? 'Sincronizando catálogo...'
                  : `Contexto conectado a ${productos.length} artículos en base de datos`}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={reiniciarConversacion}
            title="Reiniciar chat"
            id="btn-reiniciar-chat"
          >
            <RefreshCw size={14} />
            <span>Limpiar Chat</span>
          </button>
        </div>

        {/* Historial de Mensajes */}
        <div className="chat-messages-container" id="chat-historial">
          {mensajes.map((m) => {
            const esUsuario = m.remitente === 'usuario'
            return (
              <div
                key={m.id}
                className={`chat-bubble-row ${esUsuario ? 'row-user' : 'row-assistant'}`}
              >
                {!esUsuario && (
                  <div className="bubble-avatar bot-avatar-sm">
                    <Bot size={16} />
                  </div>
                )}

                <div className={`chat-bubble ${esUsuario ? 'bubble-user' : 'bubble-assistant'}`}>
                  <div className="bubble-content">
                    <p className="bubble-text">{m.texto}</p>
                  </div>
                  <div className="bubble-footer">
                    <Clock size={11} />
                    <span>{m.hora}</span>
                    {m.fuente && (
                      <span className="bubble-source-tag">
                        {m.fuente === 'gemini' ? 'Gemini 1.5' : m.fuente === 'fallback' ? 'Motor Local' : 'Sistema'}
                      </span>
                    )}
                  </div>
                </div>

                {esUsuario && (
                  <div className="bubble-avatar user-avatar-sm">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {pensando && (
            <div className="chat-bubble-row row-assistant">
              <div className="bubble-avatar bot-avatar-sm">
                <Bot size={16} />
              </div>
              <div className="chat-bubble bubble-assistant thinking-bubble">
                <div className="thinking-indicator">
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                  <span className="thinking-dot"></span>
                </div>
                <span className="thinking-text">La IA está pensando...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Preguntas Rápidas */}
        <div className="quick-questions-wrapper">
          <div className="quick-questions-header">
            <Zap size={14} className="quick-icon" />
            <span>Preguntas Rápidas Sugeridas:</span>
          </div>
          <div className="quick-questions-pills">
            {PREGUNTAS_RAPIDAS.map((pregunta, idx) => (
              <button
                key={idx}
                type="button"
                className="btn-quick-pill"
                onClick={() => handlePreguntaRapida(pregunta)}
                disabled={pensando}
                id={`btn-pregunta-${idx}`}
              >
                {pregunta}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario de Entrada */}
        <form onSubmit={handleSubmit} className="chat-input-form" id="form-asistente">
          <input
            type="text"
            className="chat-text-input"
            placeholder="Escribe una pregunta sobre el inventario..."
            value={inputMensaje}
            onChange={(e) => setInputMensaje(e.target.value)}
            disabled={pensando}
            id="input-mensaje-ia"
          />
          <button
            type="submit"
            className="btn btn-primary btn-chat-send"
            disabled={pensando || !inputMensaje.trim()}
            id="btn-enviar-mensaje"
            title="Enviar mensaje"
          >
            <Send size={16} />
            <span>Enviar</span>
          </button>
        </form>
      </section>
    </div>
  )
}

export default AsistenteIA
