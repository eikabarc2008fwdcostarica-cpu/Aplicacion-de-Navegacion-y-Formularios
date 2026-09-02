import { useState } from 'react'
import { CheckCircle2, User, Mail, Hash, Send, Eye, FileCheck } from 'lucide-react'

function Formulario() {
  // Hooks de estado independientes para cada campo del formulario
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [edad, setEdad] = useState('')

  // Estado para mensaje de retroalimentación amigable
  const [mensajeExito, setMensajeExito] = useState('')
  const [ultimoEnvio, setUltimoEnvio] = useState(null)

  const handleSubmit = (e) => {
    // Evita la recarga de la página por defecto
    e.preventDefault()

    // 1. Imprime en consola los valores individuales
    console.group('--- Datos Recibidos del Formulario ---')
    console.log('Nombre individual:', nombre)
    console.log('Correo individual:', correo)
    console.log('Edad individual:', edad)

    // 2. Imprime el objeto completo con la información capturada
    const formData = {
      nombre: nombre.trim(),
      correo: correo.trim(),
      edad: edad.trim(),
    }
    console.log('Objeto de datos capturado:', formData)
    console.groupEnd()

    // Guardar para el mensaje amigable en pantalla
    setUltimoEnvio(formData)
    setMensajeExito(`¡Datos registrados correctamente para ${nombre.trim()}!`)

    // 3. Limpiar los inputs
    setNombre('')
    setCorreo('')
    setEdad('')
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1 className="page-title">Formulario de Registro</h1>
        <p className="page-subtitle">
          Ejemplo de formulario controlado en React con hooks individuales de <code>useState</code>.
        </p>
      </header>

      <div className="form-layout">
        <div className="form-card">
          {mensajeExito && (
            <div className="alert-success" role="status" aria-live="polite">
              <CheckCircle2 className="alert-icon-wrapper" />
              <div>
                <strong>{mensajeExito}</strong>
                <p className="alert-detail">
                  Revisa la consola de desarrollo (F12) para ver la salida de <code>console.log</code>.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="custom-form" noValidate={false}>
            <div className="form-group">
              <label htmlFor="input-nombre" className="form-label">
                <User className="form-label-icon" />
                <span>Nombre Completo</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="input-nombre"
                  name="nombre"
                  className="form-input"
                  placeholder="Ej. Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
                <User className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="input-correo" className="form-label">
                <Mail className="form-label-icon" />
                <span>Correo Electrónico</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="input-correo"
                  name="correo"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
                <Mail className="input-icon" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="input-edad" className="form-label">
                <Hash className="form-label-icon" />
                <span>Edad</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="number"
                  id="input-edad"
                  name="edad"
                  className="form-input"
                  placeholder="Ej. 25"
                  min="1"
                  max="120"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  required
                />
                <Hash className="input-icon" />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                id="btn-submit-formulario"
              >
                <Send className="btn-icon" />
                <span>Enviar Información</span>
              </button>
            </div>
          </form>
        </div>

        {/* Panel lateral con vista previa y resumen */}
        <div className="preview-card">
          <div className="preview-header">
            <Eye className="preview-header-icon" />
            <h3 className="preview-title">Estado en Tiempo Real</h3>
          </div>
          <p className="preview-desc">
            Valores sincronizados reactivamente con <code>useState</code>:
          </p>

          <div className="preview-items">
            <div className="preview-item">
              <span className="preview-key">
                <User className="preview-key-icon" />
                Nombre:
              </span>
              <span className="preview-val">{nombre || <em>(Vacío)</em>}</span>
            </div>
            <div className="preview-item">
              <span className="preview-key">
                <Mail className="preview-key-icon" />
                Correo:
              </span>
              <span className="preview-val">{correo || <em>(Vacío)</em>}</span>
            </div>
            <div className="preview-item">
              <span className="preview-key">
                <Hash className="preview-key-icon" />
                Edad:
              </span>
              <span className="preview-val">{edad || <em>(Vacío)</em>}</span>
            </div>
          </div>

          {ultimoEnvio && (
            <div className="last-submission">
              <div className="last-submission-header">
                <FileCheck className="last-submission-icon" />
                <h4>Último registro capturado:</h4>
              </div>
              <pre>{JSON.stringify(ultimoEnvio, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Formulario
