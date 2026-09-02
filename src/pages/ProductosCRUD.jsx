import { useState, useEffect } from 'react'
import {
  Package,
  PlusCircle,
  Edit2,
  Trash2,
  Save,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Layers,
  DollarSign,
  Boxes,
} from 'lucide-react'
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../services/productosService'

const CATEGORIAS_DISPONIBLES = ['Periféricos', 'Monitores', 'Audio', 'Componentes', 'Accesorios']

const ESTADO_FORM_INICIAL = {
  nombre: '',
  precio: '',
  categoria: 'Periféricos',
  stock: '',
}

function ProductosCRUD() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [formulario, setFormulario] = useState(ESTADO_FORM_INICIAL)
  const [productoEnEdicionId, setProductoEnEdicionId] = useState(null)
  const [alerta, setAlerta] = useState({ visible: false, tipo: '', mensaje: '' })
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('Todas')
  const [procesandoAccion, setProcesandoAccion] = useState(false)

  const mostrarAlerta = (tipo, mensaje) => {
    setAlerta({ visible: true, tipo, mensaje })
    setTimeout(() => {
      setAlerta({ visible: false, tipo: '', mensaje: '' })
    }, 4500)
  }

  // Recarga manual de productos para el botón de actualización
  const cargarListaProductos = async () => {
    try {
      setCargando(true)
      const datos = await obtenerProductos()
      setProductos(Array.isArray(datos) ? datos : [])
    } catch (err) {
      mostrarAlerta('error', `Error al cargar los productos: ${err.message}`)
    } finally {
      setCargando(false)
    }
  }

  // Carga inicial al montar el componente
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
          mostrarAlerta('error', `Error al cargar los productos: ${err.message}`)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const iniciarEdicion = (prod) => {
    setProductoEnEdicionId(prod.id)
    setFormulario({
      nombre: prod.nombre,
      precio: prod.precio.toString(),
      categoria: prod.categoria,
      stock: prod.stock.toString(),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cancelarEdicion = () => {
    setProductoEnEdicionId(null)
    setFormulario(ESTADO_FORM_INICIAL)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formulario.nombre.trim()) {
      mostrarAlerta('error', 'El nombre del producto es obligatorio.')
      return
    }
    const precioNumerico = Number(formulario.precio)
    const stockNumerico = Number(formulario.stock)

    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      mostrarAlerta('error', 'El precio debe ser un número mayor a cero.')
      return
    }
    if (isNaN(stockNumerico) || stockNumerico < 0) {
      mostrarAlerta('error', 'El stock debe ser un número entero mayor o igual a cero.')
      return
    }

    const payload = {
      nombre: formulario.nombre.trim(),
      precio: precioNumerico,
      categoria: formulario.categoria,
      stock: Math.floor(stockNumerico),
    }

    try {
      setProcesandoAccion(true)
      if (productoEnEdicionId) {
        // Operación PATCH a través del servicio
        const actualizado = await actualizarProducto(productoEnEdicionId, payload)
        setProductos((prev) =>
          prev.map((p) => (p.id === productoEnEdicionId ? { ...p, ...actualizado } : p))
        )
        mostrarAlerta('exito', `Producto "${actualizado.nombre}" actualizado correctamente.`)
        cancelarEdicion()
      } else {
        // Operación POST a través del servicio
        const nuevo = await crearProducto(payload)
        setProductos((prev) => [...prev, nuevo])
        mostrarAlerta('exito', `Producto "${nuevo.nombre}" creado exitosamente.`)
        setFormulario(ESTADO_FORM_INICIAL)
      }
    } catch (err) {
      mostrarAlerta('error', `Error al guardar producto: ${err.message}`)
    } finally {
      setProcesandoAccion(false)
    }
  }

  const handleEliminar = async (id, nombre) => {
    const confirmacion = window.confirm(
      `¿Confirmas que deseas eliminar el producto "${nombre}" de la base de datos?`
    )
    if (!confirmacion) return

    try {
      setProcesandoAccion(true)
      await eliminarProducto(id)
      setProductos((prev) => prev.filter((p) => p.id !== id))
      mostrarAlerta('exito', `Producto "${nombre}" eliminado del sistema.`)
      if (productoEnEdicionId === id) {
        cancelarEdicion()
      }
    } catch (err) {
      mostrarAlerta('error', `No se pudo eliminar el producto: ${err.message}`)
    } finally {
      setProcesandoAccion(false)
    }
  }

  // Filtrado de productos para la tabla
  const productosFiltrados = productos.filter((prod) => {
    const coincideTexto = prod.nombre.toLowerCase().includes(filtroTexto.toLowerCase())
    const coincideCategoria =
      filtroCategoria === 'Todas' || prod.categoria === filtroCategoria
    return coincideTexto && coincideCategoria
  })

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Catálogo y Productos</h1>
        <p className="page-subtitle">
          Operaciones CRUD asíncronas conectadas a la API REST mediante la capa de servicios.
        </p>
      </div>

      {alerta.visible && (
        <div
          className={alerta.tipo === 'exito' ? 'alert-success' : 'alert-error'}
          role="alert"
        >
          <div className="alert-icon-wrapper">
            {alerta.tipo === 'exito' ? (
              <CheckCircle2 className="alert-icon" />
            ) : (
              <AlertCircle className="alert-icon" />
            )}
          </div>
          <div>
            <strong>{alerta.tipo === 'exito' ? 'Operación Exitosa' : 'Atención'}</strong>
            <p className="alert-detail">{alerta.mensaje}</p>
          </div>
        </div>
      )}

      {/* Formulario Controlado de Creación / Edición */}
      <section className="form-card crud-form-card">
        <div className="form-card-header">
          <div className="form-card-title-group">
            {productoEnEdicionId ? (
              <Edit2 className="form-title-icon" />
            ) : (
              <PlusCircle className="form-title-icon" />
            )}
            <div>
              <h2 className="form-card-title">
                {productoEnEdicionId ? 'Modificar Producto Existente' : 'Registrar Nuevo Producto'}
              </h2>
              <p className="form-card-subtitle">
                {productoEnEdicionId
                  ? `Editando registro ID: ${productoEnEdicionId} (PATCH)`
                  : 'Ingresa los detalles del artículo para agregarlo a la base de datos (POST)'}
              </p>
            </div>
          </div>

          {productoEnEdicionId && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={cancelarEdicion}
            >
              <XCircle size={16} />
              <span>Cancelar Edición</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="crud-form-grid" id="form-producto">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              <Package size={15} className="form-label-icon" />
              Nombre del Producto <span className="required">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className="form-input"
              placeholder="Ej. Monitor Gamer 27'' IPS"
              value={formulario.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria" className="form-label">
              <Layers size={15} className="form-label-icon" />
              Categoría <span className="required">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              className="form-input form-select"
              value={formulario.categoria}
              onChange={handleInputChange}
            >
              {CATEGORIAS_DISPONIBLES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="precio" className="form-label">
              <DollarSign size={15} className="form-label-icon" />
              Precio ($ USD) <span className="required">*</span>
            </label>
            <input
              id="precio"
              name="precio"
              type="number"
              step="0.01"
              min="0.01"
              className="form-input"
              placeholder="Ej. 129.99"
              value={formulario.precio}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock" className="form-label">
              <Boxes size={15} className="form-label-icon" />
              Stock Disponible <span className="required">*</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              className="form-input"
              placeholder="Ej. 20"
              value={formulario.stock}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="crud-form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-submit-crud"
              disabled={procesandoAccion}
              id="btn-guardar-producto"
            >
              <Save size={18} />
              <span>
                {procesandoAccion
                  ? 'Guardando...'
                  : productoEnEdicionId
                  ? 'Actualizar Producto'
                  : 'Guardar Producto'}
              </span>
            </button>

            {productoEnEdicionId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelarEdicion}
              >
                <XCircle size={18} />
                <span>Descartar</span>
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Controles de Búsqueda y Filtrado */}
      <section className="table-controls-card">
        <div className="controls-left">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por nombre de producto..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              id="input-buscar-producto"
            />
          </div>

          <div className="filter-select-wrapper">
            <Filter className="filter-icon" size={16} />
            <select
              className="filter-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              id="select-filtro-categoria"
            >
              <option value="Todas">Todas las Categorías</option>
              {CATEGORIAS_DISPONIBLES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={cargarListaProductos}
          title="Recargar catálogo desde el servidor"
          id="btn-recargar-catalogo"
        >
          <RefreshCw size={15} className={cargando ? 'spinning' : ''} />
          <span>Actualizar</span>
        </button>
      </section>

      {/* Tabla de Productos */}
      <section className="table-container-card">
        <div className="table-header-meta">
          <div className="table-count-badge">
            <Package size={15} />
            <span>
              Total Mostrado: {productosFiltrados.length} de {productos.length}
            </span>
          </div>
        </div>

        {cargando ? (
          <div className="loading-state">
            <RefreshCw className="spinning" size={28} />
            <p>Cargando inventario desde el servidor...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="empty-state">
            <Package size={48} className="empty-icon" />
            <h3>No se encontraron productos</h3>
            <p>
              {productos.length === 0
                ? 'El catálogo se encuentra vacío. Comienza agregando tu primer producto arriba.'
                : 'No hay productos que coincidan con los filtros de búsqueda aplicados.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table" id="tabla-productos">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Producto</th>
                  <th scope="col">Categoría</th>
                  <th scope="col" className="text-right">Precio</th>
                  <th scope="col" className="text-center">Stock</th>
                  <th scope="col" className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((prod) => {
                  const enEdicion = prod.id === productoEnEdicionId
                  return (
                    <tr key={prod.id} className={enEdicion ? 'row-editing' : ''}>
                      <td className="cell-id">
                        <code>#{prod.id}</code>
                      </td>
                      <td className="cell-name">
                        <strong>{prod.nombre}</strong>
                      </td>
                      <td>
                        <span className="category-pill">{prod.categoria}</span>
                      </td>
                      <td className="text-right cell-price">
                        ${Number(prod.precio).toFixed(2)}
                      </td>
                      <td className="text-center">
                        <span
                          className={`stock-badge ${
                            prod.stock <= 5
                              ? 'stock-low'
                              : prod.stock <= 15
                              ? 'stock-medium'
                              : 'stock-high'
                          }`}
                        >
                          {prod.stock} uds.
                        </span>
                      </td>
                      <td className="text-center cell-actions">
                        <div className="action-buttons-group">
                          <button
                            type="button"
                            className="btn-action-edit"
                            onClick={() => iniciarEdicion(prod)}
                            title="Editar producto"
                            id={`btn-editar-${prod.id}`}
                          >
                            <Edit2 size={15} />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            className="btn-action-delete"
                            onClick={() => handleEliminar(prod.id, prod.nombre)}
                            title="Eliminar producto"
                            id={`btn-eliminar-${prod.id}`}
                          >
                            <Trash2 size={15} />
                            <span>Eliminar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default ProductosCRUD
