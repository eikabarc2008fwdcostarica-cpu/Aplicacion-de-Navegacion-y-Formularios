const API_URL = 'http://localhost:3001/usuarios'

/**
 * Autentica un usuario contra la base de datos simulada.
 * @param {string} usuario Nombre de usuario
 * @param {string} contrasena Contraseña
 * @returns {Promise<{id: string|number, usuario: string, rol: string}>} Objeto de usuario sanitizado (sin contraseña)
 * @throws {Error} Si las credenciales no son válidas o falla la petición
 */
export async function iniciarSesion(usuario, contrasena) {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) {
      throw new Error(`Error al consultar el servicio de autenticación (Estado: ${res.status})`)
    }
    const usuarios = await res.json()

    // Búsqueda de coincidencia exacta
    const usuarioEncontrado = usuarios.find(
      (u) => u.usuario === usuario && u.contrasena === contrasena
    )

    if (!usuarioEncontrado) {
      throw new Error('Credenciales inválidas')
    }

    // Retorna el objeto sin contraseña sensible
    return {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol,
    }
  } catch (error) {
    console.error('authService.iniciarSesion:', error)
    throw error
  }
}
