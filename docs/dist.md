# Documentación de la Carpeta `dist`

## Descripción General

La carpeta `dist` contiene todas las páginas HTML del proyecto Nexus AG, que constituyen la interfaz de usuario principal de la aplicación web. Estas páginas implementan diferentes funcionalidades del sistema, desde la página de inicio hasta el carrito de compras y el juego de estrategia.

## Estructura de Archivos

```
dist/
├── carrito.html          # Página de la tienda y carrito de compras
├── editar-perfil.html    # Página para editar el perfil de usuario
├── juego.html            # Página del juego de estrategia "Asalto"
├── landing.html          # Página de inicio/landing page
├── login.html            # Página de autenticación (login/registro)
└── ver-perfil.html       # Página para visualizar el perfil de usuario
```

## Descripción Detallada de Archivos

### 1. `carrito.html`
**Propósito**: Página principal de la tienda de videojuegos con funcionalidad de carrito de compras.

**Características principales**:
- **Header fijo**: Navegación con logo de NexusAG y botón de carrito
- **Grid de productos**: Diseño responsivo para mostrar productos
- **Integración con Tailwind CSS**: Utiliza clases de utilidad para el diseño
- **Iconografía**: Implementa RemixIcon para iconos
- **Tipografía**: Fuente Mulish de Google Fonts
- **Esquema de colores**: Tema oscuro con acentos verdes (#72B01D)

**Funcionalidades**:
- Visualización de productos en grid responsivo
- Contador de items en el carrito
- Navegación de regreso al índice principal

### 2. `juego.html`
**Propósito**: Página del juego de estrategia "Asalto" con interfaz de juego completa.

**Características principales**:
- **Canvas de juego**: Área de 560x560px para el tablero de juego
- **Panel de control lateral**: Información de jugadores y controles
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla
- **CSS personalizado**: Utiliza `juego.css` para estilos específicos
- **Tema consistente**: Mantiene la paleta de colores del proyecto

**Funcionalidades**:
- Interfaz de juego interactiva
- Información de jugadores en tiempo real
- Controles de juego integrados

### 3. `landing.html`
**Propósito**: Página de inicio que presenta el juego "Asalto" y la marca.

**Características principales**:
- **Hero section**: Sección principal con imagen de fondo y call-to-action
- **Header personalizado**: Componente `<header-ahga>` reutilizable
- **Scroll suave**: Implementa `scroll-smooth` para navegación fluida
- **Tipografía Inter**: Fuente moderna de Google Fonts
- **Diseño inmersivo**: Uso de overlays y efectos visuales

**Funcionalidades**:
- Presentación del producto principal
- Navegación hacia el juego
- Integración con sistema de autenticación

### 4. `login.html`
**Propósito**: Página de autenticación que maneja login y registro de usuarios.

**Características principales**:
- **Formularios duales**: Login y registro en la misma página
- **Validación de campos**: Campos requeridos y validación de email
- **Integración con Font Awesome**: Iconos para mejorar la UX
- **Diseño centrado**: Layout optimizado para formularios
- **Campos específicos**: Username, email y password con estilos personalizados

**Funcionalidades**:
- Autenticación de usuarios existentes
- Registro de nuevos usuarios
- Validación de formularios
- Integración con backend de autenticación

### 5. `editar-perfil.html`
**Propósito**: Página para que los usuarios editen su información personal.

**Características principales**:
- **Componente drag-drop**: `<drag-drop-image-ahga>` para subir avatar
- **Formulario completo**: Campos para actualizar información personal
- **Header reutilizable**: Componente `<header-ahga>` consistente
- **Sistema de notificaciones**: Container para mostrar feedback al usuario
- **Diseño de tarjeta**: Layout en tarjeta con sombras y bordes redondeados

**Funcionalidades**:
- Edición de avatar con drag & drop
- Actualización de información personal
- Validación de formularios
- Feedback visual al usuario

### 6. `ver-perfil.html`
**Propósito**: Página para visualizar la información del perfil de usuario.

**Características principales**:
- **Diseño de perfil moderno**: Header con gradiente y avatar circular
- **Layout responsivo**: Adaptable a móviles y desktop
- **Indicador de estado**: Punto verde para mostrar usuario activo
- **Información organizada**: Secciones claras para diferentes datos
- **Navegación integrada**: Botones para editar perfil

**Funcionalidades**:
- Visualización de datos del usuario
- Navegación hacia edición de perfil
- Indicadores visuales de estado

## Características Técnicas Comunes

### Framework y Librerías
- **Tailwind CSS**: Framework de utilidades CSS para diseño rápido
- **RemixIcon**: Biblioteca de iconos vectoriales
- **Font Awesome**: Iconos adicionales para funcionalidades específicas
- **Google Fonts**: Tipografías Mulish e Inter

### Diseño y UX
- **Tema oscuro consistente**: Paleta de colores unificada
- **Color primario**: #72B01D (verde)
- **Fondo principal**: #0D0A0B (negro profundo)
- **Texto principal**: #F3EFF5 (blanco cálido)
- **Diseño responsivo**: Mobile-first approach
- **Componentes reutilizables**: Headers y elementos personalizados

### Arquitectura
- **Componentes web personalizados**: `<header-ahga>`, `<drag-drop-image-ahga>`
- **Configuración mediante atributos**: Parámetros JSON para componentes
- **Separación de responsabilidades**: HTML semántico, CSS modular, JS separado
- **Rutas relativas**: Navegación consistente entre páginas

## Integración con el Sistema

### Conexión con Backend
- **Autenticación**: Integración con Firebase Auth
- **Almacenamiento**: Firebase Storage para avatares
- **Base de datos**: Conexión con servicios de datos

### Conexión con Componentes
- **Header dinámico**: Componente que se adapta según la página
- **Sistema de notificaciones**: Feedback unificado
- **Gestión de estado**: Sincronización con servicios JavaScript

### Navegación
- **Rutas consistentes**: Estructura de URLs predecible
- **Navegación contextual**: Enlaces apropiados según el estado del usuario
- **Breadcrumbs implícitos**: Navegación de regreso clara

## Optimizaciones y Rendimiento

### Carga de Recursos
- **CDN para frameworks**: Tailwind CSS desde CDN oficial
- **Fuentes optimizadas**: Google Fonts con display=swap
- **Iconos vectoriales**: SVG para mejor rendimiento

### SEO y Accesibilidad
- **Meta tags apropiados**: Viewport, charset, title específicos
- **Estructura semántica**: Uso correcto de header, main, section
- **Alt text**: Imágenes con texto alternativo
- **Contraste adecuado**: Colores que cumplen estándares de accesibilidad

## Posibles Mejoras

### Funcionalidad
1. **Lazy loading**: Implementar carga diferida para imágenes
2. **Service Workers**: Cache offline para mejor experiencia
3. **Progressive Web App**: Convertir en PWA para instalación
4. **Internacionalización**: Soporte para múltiples idiomas

### Rendimiento
1. **Minificación**: Comprimir HTML en producción
2. **Critical CSS**: Inline CSS crítico para primera carga
3. **Preload de recursos**: Precargar recursos importantes
4. **Optimización de imágenes**: WebP y responsive images

### UX/UI
1. **Animaciones**: Transiciones suaves entre estados
2. **Skeleton loading**: Placeholders durante carga
3. **Modo claro**: Opción de tema claro
4. **Personalización**: Temas personalizables por usuario

### Mantenimiento
1. **Componentes modulares**: Mayor reutilización de código
2. **Sistema de design tokens**: Variables CSS centralizadas
3. **Testing**: Pruebas automatizadas para componentes
4. **Documentación**: Guías de estilo y patrones de diseño