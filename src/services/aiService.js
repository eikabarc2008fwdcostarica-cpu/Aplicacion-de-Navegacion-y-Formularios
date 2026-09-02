/**
 * Servicio de Inteligencia Artificial para el Asistente y Diagnóstico de Inventario.
 * Respeta la jerarquía arquitectónica: funciones async/await con try/catch y fetch.
 * Dispone de un motor heurístico de respaldo (fallback) en caso de que la clave API esté ausente o falle la conexión.
 */

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

function obtenerApiKey() {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_GEMINI_API_KEY
    }
    if (typeof globalThis !== 'undefined' && globalThis.process?.env) {
      return globalThis.process.env.VITE_GEMINI_API_KEY
    }
  } catch {
    return null
  }
  return null
}

/**
 * Verifica si la clave API es válida y no es el valor por defecto de ejemplo.
 */
function esApiKeyValida(key) {
  return Boolean(key && typeof key === 'string' && key.trim() !== '' && key !== 'tu_api_key_aqui')
}

/**
 * Genera el prompt de sistema inyectando el inventario actual.
 */
function construirPromptSistema(contextoInventario) {
  const productosFormateados = contextoInventario
    .map(
      (p) =>
        `- [ID ${p.id}] ${p.nombre} | Categoría: ${p.categoria} | Precio: $${p.precio} | Stock: ${p.stock} unidades`
    )
    .join('\n')

  return `Eres "TechStore AI", un Asistente Senior de Inteligencia Artificial experto en gestión de inventario, analítica comercial y asesoría de catálogo para una tienda de tecnología.
Tu objetivo es responder con precisión, tono profesional, conciso y estructurado, en español.
Basa tus respuestas estrictamente en los siguientes datos reales del catálogo de la tienda:

=== INVENTARIO ACTUAL ===
${productosFormateados || 'No hay productos disponibles actualmente.'}
=========================

Instrucciones:
1. Responde preguntas sobre stock, precios, productos por categoría, productos con mayor o menor existencia, etc.
2. Si te piden sugerencias de negocio, brinda consejos accionables basados en los números reales.
3. No uses emojis en la respuesta. Usa formato markdown limpio con viñetas o texto en negrita cuando convenga.`
}

/**
 * Motor heurístico local que procesa consultas en lenguaje natural si la API externa no está disponible.
 */
function procesarConsultaLocalmente(mensaje, productos) {
  const texto = mensaje.toLowerCase()

  if (!productos || productos.length === 0) {
    return 'Actualmente no hay productos registrados en el catálogo para analizar. Puedes agregar artículos desde la sección de Productos.'
  }

  // 1. Pregunta sobre menor stock o alertas de inventario
  if (
    texto.includes('menor stock') ||
    texto.includes('menos stock') ||
    texto.includes('bajo stock') ||
    texto.includes('agotarse') ||
    texto.includes('escaso')
  ) {
    const ordenados = [...productos].sort((a, b) => a.stock - b.stock)
    const criticos = ordenados.slice(0, 3)
    const lineas = criticos
      .map((p) => `* ${p.nombre} (${p.categoria}): solo ${p.stock} unidades disponibles a $${p.precio}.`)
      .join('\n')

    return `Análisis de inventario crítico:\n\nEl producto con menor existencia es "${criticos[0].nombre}" con ${criticos[0].stock} unidades.\n\nTop 3 productos que requieren reabastecimiento urgente:\n${lineas}\n\nRecomendación: Contactar a los proveedores para emitir una orden de compra preventiva.`
  }

  // 2. Pregunta sobre mayor stock o sobreabastecimiento
  if (
    texto.includes('mayor stock') ||
    texto.includes('más stock') ||
    texto.includes('mas stock') ||
    texto.includes('mas unidades') ||
    texto.includes('mayor inventario')
  ) {
    const ordenados = [...productos].sort((a, b) => b.stock - a.stock)
    const lideres = ordenados.slice(0, 3)
    const lineas = lideres
      .map((p) => `* ${p.nombre} (${p.categoria}): ${p.stock} unidades en almacén ($${p.precio} c/u).`)
      .join('\n')

    return `Artículos con mayor volumen en almacén:\n\nEl producto con mayor inventario es "${lideres[0].nombre}" con ${lideres[0].stock} unidades.\n\nPrincipales existencias:\n${lineas}\n\nRecomendación: Monitorear la rotación de estos artículos para optimizar el capital de trabajo inmovilizado.`
  }

  // 3. Preguntas sobre productos más caros / precios altos
  if (
    texto.includes('mas caro') ||
    texto.includes('más caro') ||
    texto.includes('mayor precio') ||
    texto.includes('mas costoso') ||
    texto.includes('más costoso')
  ) {
    const ordenados = [...productos].sort((a, b) => b.precio - a.precio)
    const masCaro = ordenados[0]
    return `El producto de mayor valor unitario en el catálogo es "${masCaro.nombre}" con un precio de $${masCaro.precio.toFixed(
      2
    )} USD (${masCaro.categoria}, stock actual: ${masCaro.stock} unidades).\n\nLe siguen:\n* ${ordenados[1]?.nombre || ''}: $${ordenados[1]?.precio || 0} USD\n* ${ordenados[2]?.nombre || ''}: $${ordenados[2]?.precio || 0} USD`
  }

  // 4. Preguntas sobre productos más económicos
  if (
    texto.includes('mas barato') ||
    texto.includes('más barato') ||
    texto.includes('menor precio') ||
    texto.includes('mas economico') ||
    texto.includes('más económico')
  ) {
    const ordenados = [...productos].sort((a, b) => a.precio - b.precio)
    const masBarato = ordenados[0]
    return `El artículo más accesible de la tienda es "${masBarato.nombre}" a un valor de $${masBarato.precio.toFixed(
      2
    )} USD (${masBarato.categoria}, existencias: ${masBarato.stock} unidades).`
  }

  // 5. Filtros por categorías específicas
  const categoriasConocidas = ['periféricos', 'perifericos', 'monitores', 'audio', 'componentes', 'accesorios']
  const catEncontrada = categoriasConocidas.find((c) => texto.includes(c))
  if (catEncontrada) {
    const normalizada = catEncontrada.charAt(0).toUpperCase() + catEncontrada.slice(1)
    const filtrados = productos.filter(
      (p) => p.categoria.toLowerCase().includes(catEncontrada.slice(0, 5))
    )

    if (filtrados.length === 0) {
      return `Actualmente no disponemos de artículos registrados bajo la categoría "${normalizada}".`
    }

    const lista = filtrados
      .map((p) => `* ${p.nombre}: $${p.precio} USD (${p.stock} unidades en stock)`)
      .join('\n')

    return `Productos disponibles en el segmento "${normalizada}" (${filtrados.length} artículos):\n\n${lista}`
  }

  // 6. Resumen general del catálogo / balance
  if (
    texto.includes('resumen') ||
    texto.includes('catalogo') ||
    texto.includes('catálogo') ||
    texto.includes('inventario') ||
    texto.includes('metricas') ||
    texto.includes('métricas')
  ) {
    const totalProductos = productos.length
    const stockTotal = productos.reduce((sum, p) => sum + (Number(p.stock) || 0), 0)
    const valorizacionTotal = productos.reduce(
      (sum, p) => sum + (Number(p.precio) || 0) * (Number(p.stock) || 0),
      0
    )
    const categorias = [...new Set(productos.map((p) => p.categoria))]

    return `Resumen Ejecutivo del Catálogo TechStore:\n\n* Total de artículos registrados: ${totalProductos} productos.\n* Categorías activas (${categorias.length}): ${categorias.join(', ')}.\n* Stock acumulado en bodega: ${stockTotal} unidades.\n* Valorización estimada del inventario: $${valorizacionTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD.\n\nEl catálogo presenta una distribución equilibrada con rotación regular en categorías clave.`
  }

  // 7. Saludo o consulta general
  if (
    texto.includes('hola') ||
    texto.includes('buenos') ||
    texto.includes('saludos') ||
    texto.includes('ayuda') ||
    texto.includes('que puedes hacer') ||
    texto.includes('qué puedes hacer')
  ) {
    return `Hola. Soy tu Asistente Inteligente de Inventario. Puedo analizar en tiempo real los ${productos.length} productos registrados en tu catálogo. Puedes preguntarme:\n\n* ¿Qué producto tiene menor stock?\n* ¿Cuáles son los productos de Audio o Periféricos?\n* ¿Cuál es el artículo más costoso?\n* Dame un balance general del inventario.`
  }

  // 8. Respuesta contextual predeterminada
  return `He analizado tu consulta sobre el inventario. En este momento el catálogo cuenta con ${productos.length} productos disponibles. Para darte una respuesta puntual, puedes preguntarme sobre niveles de stock, precios, productos por categoría específica o solicitar un balance comercial completo.`
}

/**
 * Consulta al Asistente IA (Gemini API con fallback heurístico local).
 * @param {string} mensajeUsuario Consulta del usuario
 * @param {Array} contextoInventario Lista actual de productos
 * @returns {Promise<{respuesta: string, fuente: 'gemini' | 'fallback'}>}
 */
export async function consultarAsistente(mensajeUsuario, contextoInventario = []) {
  const apiKey = obtenerApiKey()

  if (esApiKeyValida(apiKey)) {
    try {
      const promptSistema = construirPromptSistema(contextoInventario)
      const promptCompleto = `${promptSistema}\n\nUsuario pregunta: "${mensajeUsuario}"\n\nRespuesta:`

      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptCompleto }],
            },
          ],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const textoRespuesta =
          data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

        if (textoRespuesta) {
          return {
            respuesta: textoRespuesta,
            fuente: 'gemini',
          }
        }
      }
      console.warn('aiService: Respuesta de Gemini no óptima, recurriendo al motor heurístico.')
    } catch (apiError) {
      console.warn('aiService: Error al invocar Gemini API. Activando fallback local:', apiError)
    }
  }

  // Mecanismo de respaldo heurístico garantizado
  const respuestaLocal = procesarConsultaLocalmente(mensajeUsuario, contextoInventario)
  return {
    respuesta: respuestaLocal,
    fuente: 'fallback',
  }
}

/**
 * Genera un diagnóstico inteligente y estructurado del inventario.
 * @param {Array} productos Lista de productos
 * @returns {Promise<{resumen: string, alertas: Array<string>, recomendaciones: Array<string>, fuente: 'gemini' | 'fallback'}>}
 */
export async function generarDiagnosticoInventario(productos = []) {
  if (!productos || productos.length === 0) {
    return {
      resumen: 'No hay productos registrados para elaborar un diagnóstico.',
      alertas: ['El catálogo está vacío.'],
      recomendaciones: ['Registrar los primeros productos desde la interfaz CRUD.'],
      fuente: 'fallback',
    }
  }

  const apiKey = obtenerApiKey()

  if (esApiKeyValida(apiKey)) {
    try {
      const prompt = `Actúa como un Auditor de Inventario y Analista Comercial Senior. Analiza los siguientes productos:
${JSON.stringify(productos, null, 2)}

Devuelve una respuesta en formato JSON estricto con las siguientes claves:
{
  "resumen": "Resumen ejecutivo del estado del inventario en 2 oraciones.",
  "alertas": ["Alerta 1 de stock bajo o riesgo comercial", "Alerta 2"],
  "recomendaciones": ["Recomendación estratégica 1", "Recomendación estratégica 2", "Recomendación estratégica 3"]
}
No agregues texto fuera del JSON.`

      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
        const jsonMatch = rawText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          return {
            resumen: parsed.resumen,
            alertas: parsed.alertas || [],
            recomendaciones: parsed.recomendaciones || [],
            fuente: 'gemini',
          }
        }
      }
    } catch (err) {
      console.warn('aiService.generarDiagnosticoInventario: Fallback activado debido a:', err)
    }
  }

  // Generación heurística estructurada local
  const totalStock = productos.reduce((sum, p) => sum + (Number(p.stock) || 0), 0)
  const valorTotal = productos.reduce(
    (sum, p) => sum + (Number(p.precio) || 0) * (Number(p.stock) || 0),
    0
  )

  // Agrupación por categoría
  const porCategoria = productos.reduce((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] || 0) + p.stock
    return acc
  }, {})
  const categoriaTop = Object.entries(porCategoria).sort((a, b) => b[1] - a[1])[0]

  // Productos con menor stock
  const productosBajoStock = productos.filter((p) => p.stock <= 15)
  const productoMasCaro = [...productos].sort((a, b) => b.precio - a.precio)[0]

  const alertas = []
  if (productosBajoStock.length > 0) {
    alertas.push(
      `${productosBajoStock.length} productos cuentan con 15 o menos unidades en inventario (${productosBajoStock
        .map((p) => `${p.nombre}: ${p.stock} uds.`)
        .join(', ')}).`
    )
  }
  if (categoriaTop) {
    alertas.push(
      `La categoría "${categoriaTop[0]}" concentra la mayor parte del inventario físico (${categoriaTop[1]} unidades, representando el ${(
        (categoriaTop[1] / (totalStock || 1)) *
        100
      ).toFixed(1)}% del stock global).`
    )
  }
  if (productoMasCaro) {
    alertas.push(
      `Mayor exposición financiera por unidad en "${productoMasCaro.nombre}" ($${productoMasCaro.precio} USD con ${productoMasCaro.stock} unidades en existencia).`
    )
  }

  const recomendaciones = [
    'Emitir órdenes de reabastecimiento prioritarias para monitores y periféricos con inventario inferior a 15 unidades.',
    'Implementar promociones de venta cruzada combinando periféricos de alta rotación con artículos de audio para acelerar la liquidación de existencias.',
    `Diversificar el catálogo incorporando nuevas líneas en categorías con menor participación para equilibrar el valor total de $${valorTotal.toLocaleString(
      'en-US',
      { minimumFractionDigits: 2 }
    )} USD.`,
  ]

  return {
    resumen: `El inventario cuenta con ${productos.length} artículos y un volumen total de ${totalStock} unidades, valuado en $${valorTotal.toLocaleString(
      'en-US',
      { minimumFractionDigits: 2 }
    )} USD. La salud general del catálogo es estable con alertas puntuales de reabastecimiento.`,
    alertas,
    recomendaciones,
    fuente: 'fallback',
  }
}
