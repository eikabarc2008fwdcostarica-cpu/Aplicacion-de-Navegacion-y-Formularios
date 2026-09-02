const API_URL = 'http://localhost:3001/productos'

/**
 * Obtiene la lista completa de productos desde el servidor.
 * @returns {Promise<Array>} Lista de productos
 */
export async function obtenerProductos() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) {
      throw new Error(`Error al obtener los productos (Estado: ${res.status})`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('productosService.obtenerProductos:', error)
    throw error
  }
}

/**
 * Registra un nuevo producto en la base de datos.
 * @param {Object} producto Datos del producto a crear
 * @returns {Promise<Object>} Producto creado con id generado
 */
export async function crearProducto(producto) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    })
    if (!res.ok) {
      throw new Error(`Error al crear el producto (Estado: ${res.status})`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('productosService.crearProducto:', error)
    throw error
  }
}

/**
 * Actualiza parcialmente los datos de un producto por su id.
 * @param {string|number} id Identificador del producto
 * @param {Object} cambios Objeto con los campos a actualizar
 * @returns {Promise<Object>} Producto actualizado
 */
export async function actualizarProducto(id, cambios) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cambios),
    })
    if (!res.ok) {
      throw new Error(`Error al actualizar el producto con id ${id} (Estado: ${res.status})`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('productosService.actualizarProducto:', error)
    throw error
  }
}

/**
 * Elimina un producto por su identificador.
 * @param {string|number} id Identificador del producto
 * @returns {Promise<boolean>} true si se eliminó con éxito
 */
export async function eliminarProducto(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      throw new Error(`Error al eliminar el producto con id ${id} (Estado: ${res.status})`)
    }
    return true
  } catch (error) {
    console.error('productosService.eliminarProducto:', error)
    throw error
  }
}
