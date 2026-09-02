# Navegación, Rutas y Formularios Controlados

Aplicación web desarrollada con **React** y **Vite** que implementa un sistema completo de enrutamiento mediante **React Router DOM**, formularios interactivos controlados con el hook `useState`, navegación programática, iconografía con **Lucide React** y alternancia de **Modo Oscuro / Modo Claro** con persistencia en `localStorage`.

---

## 🚀 Características Principales

- **Enrutamiento Declarativo y SPA:**
  - Configuración con `BrowserRouter`, `Routes` y `Route` de `react-router-dom`.
  - Barra de navegación (`Navbar`) accesible y reactiva utilizando el componente `<Link to="...">`.
  - Transiciones fluidas entre vistas sin recargar el navegador.

- **Navegación Programática:**
  - Implementación del hook `useNavigate` en la página de Inicio para redirigir directamente al Formulario mediante acciones de usuario.

- **Formulario Controlado e Interactivo:**
  - Estados individuales gestionados con hooks independientes de `useState` (`nombre`, `correo` y `edad`).
  - Manejo del evento `onSubmit` previniendo el comportamiento por defecto (`e.preventDefault()`).
  - Impresión en consola de desarrollo (`console.log` y `console.group`) de los valores individuales y el objeto completo capturado.
  - Mensaje de confirmación amigable y reseteo automático de campos tras el envío.
  - Panel lateral con vista previa reactiva en tiempo real de los datos introducidos.

- **Modo Oscuro / Claro (Dark & Light Mode):**
  - Gestión centralizada mediante `ThemeContext` y el custom hook `useTheme()`.
  - Persistencia automática de la preferencia del usuario en `localStorage`.
  - Detección inicial de las preferencias del sistema operativo (`prefers-color-scheme`).
  - Botón de alternancia en el `Navbar` con animación e iconos dinámicos (`Sun` y `Moon`).

- **Iconografía Profesional:**
  - Integración de iconos vectoriales SVG limpios con `lucide-react` (`Home`, `Info`, `ClipboardList`, `Mail`, `User`, `Hash`, `Send`, `Compass`, `Zap`, etc.).
  - Totalmente libre de emojis convencionales para un aspecto pulido y empresarial.

- **Diseño Visual Moderno y Responsivo:**
  - Sistema de diseño basado en variables CSS con paletas de alto contraste para ambos temas.
  - Transiciones suaves entre estados y temas (`0.3s ease`).
  - Totalmente adaptable a dispositivos móviles, tablets y escritorios.

---

## 📁 Estructura del Proyecto

```text
practicaReact2/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── Navbar.jsx        # Barra de navegación con enlaces e interruptor de tema
│   ├── context/
│   │   └── ThemeContext.jsx  # Contexto global para el tema claro/oscuro
│   ├── pages/
│   │   ├── Inicio.jsx        # Bienvenida y botón con useNavigate
│   │   ├── Informacion.jsx   # Tarjetas temáticas y navegación cruzada
│   │   ├── Formulario.jsx    # Formulario controlado con useState
│   │   └── Contacto.jsx      # Canales de comunicación y accesos directos
│   ├── App.css               # Estilos de componentes, cards, animaciones y temas
│   ├── App.jsx               # Layout y definición de las rutas
│   ├── index.css             # Tokens CSS, variables de color y estilos base
│   └── main.jsx              # Envoltura en StrictMode, BrowserRouter y ThemeProvider
├── index.html
├── package.json
└── vite.config.js
```

---

## 🛠️ Tecnologías Utilizadas

- **[React 19](https://react.dev/):** Biblioteca para la construcción de interfaces de usuario interactivas.
- **[Vite](https://vitejs.dev/):** Entorno de desarrollo rápido y empaquetador moderno.
- **[React Router DOM v7](https://reactrouter.com/):** Gestión de rutas y navegación para aplicaciones SPA.
- **[Lucide React](https://lucide.dev/):** Conjunto de iconos vectoriales SVG consistentes y modernos.
- **Vanilla CSS:** Tokens de diseño, Flexbox, CSS Grid y transiciones nativas.

---

## 📦 Instalación y Ejecución

1. **Clonar o ubicarse en la carpeta del proyecto:**
   ```bash
   cd practicaReact2
   ```

2. **Instalar las dependencias necesarias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo local:**
   ```bash
   npm run dev
   ```
   Abre tu navegador en [http://localhost:5173/](http://localhost:5173/).

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Previsualizar la compilación de producción:**
   ```bash
   npm run preview
   ```

---

## 🗺️ Rutas Disponibles

| Ruta | Componente | Descripción |
| :--- | :--- | :--- |
| `/` | `Inicio.jsx` | Página de bienvenida con llamada a la acción y navegación con `useNavigate`. |
| `/informacion` | `Informacion.jsx` | Explicación conceptual de React Router y estado en formularios. |
| `/formulario` | `Formulario.jsx` | Formulario controlado (`nombre`, `correo`, `edad`) con consola y vista previa. |
| `/contacto` | `Contacto.jsx` | Canales de atención e información de contacto. |
