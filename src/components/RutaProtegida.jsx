import { Navigate } from 'react-router-dom'

/**
 * Componente guardián para proteger rutas que requieren autenticación.
 * @param {Object} props
 * @param {boolean} props.estaAutenticado Estado booleano de autenticación
 * @param {React.ReactNode} props.children Contenido protegido a renderizar
 */
function RutaProtegida({ estaAutenticado, children }) {
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RutaProtegida
