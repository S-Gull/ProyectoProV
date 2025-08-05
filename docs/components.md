# Documentación - Carpeta Components

## Descripción General
La carpeta `components` contiene componentes web reutilizables implementados como Custom Elements (Web Components) y módulos utilitarios para la interfaz de usuario del proyecto AHGA. Estos componentes proporcionan funcionalidades específicas que se pueden usar en múltiples páginas.

## Estructura de Archivos

```
components/
├── drag-drop-image.js    # Componente drag & drop para imágenes
├── footer.js             # Componente footer del sitio
├── geolocalizacion.js    # Utilidades de mapas y geolocalización
├── header.js             # Componente header con navegación
├── perfil.js             # Gestor de modales de perfil de usuario
└── testimonios.js        # Utilidades para testimonios y animaciones
```

## Archivos Detallados

### header.js

**Propósito**: Componente de encabezado principal con navegación adaptativa y gestión de autenticación.

**Custom Element**: `<header-ahga>`

**Clase**: `Header_AHGA`

**Funcionalidades principales**:

1. **Navegación adaptativa**:
   - Detecta automáticamente la página actual
   - Cambia enlaces según contexto (landing, breefing, general)
   - Navegación responsive con menú móvil

2. **Gestión de autenticación**:
   - `setupAuthListener()`: Escucha cambios de estado de Firebase Auth
   - `obtenerDatosUsuario_ahga()`: Recupera datos del usuario desde sessionStorage
   - `cerrarSesion_ahga()`: Maneja cierre de sesión completo
   - `cerrarSesionEnFirebase_ahga()`: Cierre de sesión en Firebase

3. **Interfaz de usuario**:
   - `crearDropdownPerfil_ahga()`: Dropdown de perfil para usuarios autenticados
   - `crearBotonLogin_ahga()`: Botón de login para usuarios no autenticados
   - `crearPerfilMovil_ahga()`: Versión móvil del perfil
   - `crearBotonLoginMovil_ahga()`: Versión móvil del botón login

4. **Eventos y listeners**:
   - `configurarEventos_ahga()`: Eventos generales del header
   - `configurarEventosPerfil_ahga()`: Eventos específicos del dropdown de perfil
   - `setupStorageListener()`: Escucha cambios en sessionStorage

**Atributos del componente**:
- `opciones_AHGA`: Configuraciones adicionales (JSON)
- `base_AHGA`: Ruta base para enlaces (default: ".")

**Navegación por contexto**:
```javascript
// Página breefing
["#inicio", "#sobre-el-juego", "#reglas"]

// Página landing
["#inicio", "#características", "#reglas"]

// Páginas generales
["/index.html", "/dist/carrito.html", "/dist/landing.html", "#galeria", "#contacto"]
```

### footer.js

**Propósito**: Componente de pie de página con información de la empresa y enlaces útiles.

**Custom Element**: `<footer-ahga>`

**Clase**: `Footer_AHGA`

**Funcionalidades**:

1. **Información corporativa**:
   - Logo y descripción de Nexus AG
   - Información de contacto
   - Ubicación de la empresa

2. **Enlaces organizados**:
   - **Menú**: Seguimiento, ubicaciones, políticas, soporte
   - **Recursos**: Blog, ayuda, documentación, guías
   - **Contacto**: Dirección, teléfono, email, redes sociales

3. **Redes sociales**:
   - Enlaces a Instagram, Twitter, YouTube, Twitch
   - Iconos SVG integrados

4. **Diseño responsive**:
   - Grid adaptativo (1 columna móvil, 4 columnas desktop)
   - Estilos Tailwind CSS integrados

**Atributos del componente**:
- `base_AHGA`: Ruta base para recursos (default: ".")

### perfil.js

**Propósito**: Gestor completo de modales para perfil de usuario con funcionalidades CRUD.

**Custom Element**: `<profile-manager-ahga>`

**Clase**: `ProfileManager_AHGA`

**Funcionalidades principales**:

1. **Gestión de modales**:
   - `createProfileModals()`: Crea modales dinámicamente en el DOM
   - `getModalsHTML()`: Genera HTML de los modales
   - `showModal()` / `hideModal()`: Control de visibilidad

2. **Modal de perfil**:
   - `mostrarModalPerfil()`: Muestra información del usuario
   - Visualización de datos: nombre, email, teléfono, fecha registro
   - Botones para editar perfil y cambiar contraseña
   - Estadísticas de juego (partidas ganadas)

3. **Modal de edición**:
   - `mostrarModalEditarPerfil()`: Formulario de edición
   - Campos editables: nombre, apellido, teléfono
   - Validación de formularios
   - `guardarCambiosPerfil()`: Guarda cambios en Firebase y sessionStorage

4. **Cambio de contraseña**:
   - `mostrarModalCambiarContrasena()`: Modal para cambio de contraseña
   - `cambiarContrasena()`: Actualiza contraseña en Firebase
   - Validación de contraseña actual

5. **Integración Firebase**:
   - `actualizarUsuarioEnFirebase()`: Actualiza datos en Firestore
   - Sincronización con autenticación de Firebase
   - Manejo de errores de red y validación

**Estructura de modales**:
```html
<!-- Modal Principal -->
<div id="modalPerfil_ahga">
  <!-- Información del usuario -->
  <!-- Botones de acción -->
</div>

<!-- Modal de Edición -->
<div id="modalEditarPerfil_ahga">
  <!-- Formulario de edición -->
</div>

<!-- Modal Cambiar Contraseña -->
<div id="modalCambiarContrasena_ahga">
  <!-- Formulario de contraseña -->
</div>
```

### drag-drop-image.js

**Propósito**: Componente avanzado para carga de imágenes con drag & drop, preview y validación.

**Custom Element**: `<drag-drop-image-ahga>`

**Clase**: `DragDropImage_AHGA`

**Funcionalidades principales**:

1. **Drag & Drop**:
   - Zona de drop visual con feedback
   - Soporte para arrastrar archivos desde el explorador
   - Validación de tipos de archivo (imágenes)
   - Efectos visuales durante el drag

2. **Selección de archivos**:
   - Click para abrir selector de archivos
   - Botón de cámara para acceso rápido
   - Input file oculto para compatibilidad

3. **Preview de imagen**:
   - Vista previa inmediata de la imagen seleccionada
   - Redimensionamiento automático
   - Mantenimiento de aspect ratio
   - Imagen por defecto configurable

4. **Validación y procesamiento**:
   - Validación de tipo MIME
   - Límite de tamaño de archivo
   - Conversión a base64 para preview
   - Callback personalizable para cambios

**Atributos configurables**:
- `width`: Ancho del componente (default: "120")
- `height`: Alto del componente (default: "120")
- `default-image`: Imagen por defecto
- `border-radius`: Estilo de bordes (default: "rounded-full")

**Eventos**:
- `onImageChange`: Callback cuando cambia la imagen
- Eventos de drag: dragenter, dragover, dragleave, drop

### geolocalizacion.js

**Propósito**: Utilidades para integración de mapas y geolocalización usando Leaflet.

**Funciones exportadas**:

1. **`setupCompanyMap_AHGA()`**:
   - Inicializa mapa de la ubicación de la empresa
   - Coordenadas fijas: Oripoto, Caracas (10.40974, -66.827068)
   - Usa tiles de OpenStreetMap locales
   - Marcador con popup informativo
   - Zoom nivel 17 para vista detallada

**Configuración del mapa**:
```javascript
// Coordenadas de la empresa
const latEmpresa_AHGA = 10.40974;
const lngEmpresa_AHGA = -66.827068;

// Tiles locales para mejor rendimiento
L.tileLayer("/osm-tiles/{z}/{x}/{y}.png")
```

**Dependencias**:
- Leaflet.js para renderizado de mapas
- Tiles de OpenStreetMap (almacenados localmente)

### testimonios.js

**Propósito**: Utilidades para manejo de testimonios, animaciones y formularios.

**Funciones exportadas**:

1. **`setupMobileMenu_AHGA()`**:
   - Configura menú móvil responsive
   - Toggle de visibilidad con data attributes
   - Manejo de clases CSS para animaciones

2. **`setupScrollAnimations_AHGA()`**:
   - Animaciones basadas en scroll usando Intersection Observer
   - Detecta elementos que entran en viewport
   - Aplica clase `animate-fade-in` automáticamente
   - Optimizado para rendimiento (unobserve después de animar)

3. **`cargarTestimonios_AHGA()`**:
   - Carga testimonios desde JSONPlaceholder API
   - Combina datos de todos y usuarios
   - Genera HTML dinámico para testimonios
   - Manejo de errores de red

4. **`setupFormSubmission_AHGA(options)`**:
   - Configuración de envío de formularios
   - Validación de campos
   - Integración con backend de email
   - Feedback visual de estado

**Configuración de animaciones**:
```javascript
// Elementos que se animan al hacer scroll
".benefit-item, .service-card, .animate-on-scroll"

// Opciones del Intersection Observer
{
  threshold: 0.1  // Se activa cuando 10% del elemento es visible
}
```

## Patrones de Diseño Utilizados

1. **Custom Elements**: Componentes web nativos reutilizables
2. **Module Pattern**: Exportación de funciones específicas
3. **Observer Pattern**: Intersection Observer para animaciones
4. **Template Method**: Estructura común para modales
5. **Strategy Pattern**: Diferentes estrategias de navegación por página

## Características Técnicas

### Compatibilidad
- Custom Elements v1 (soporte nativo en navegadores modernos)
- ES6 Modules
- Async/Await para operaciones asíncronas
- Intersection Observer API

### Estilos
- Tailwind CSS para estilos utilitarios
- CSS custom properties para temas
- Animaciones CSS y transiciones
- Diseño responsive mobile-first

### Integración Firebase
- Firebase Authentication
- Firestore para datos de usuario
- Manejo de estados de autenticación
- Sincronización en tiempo real

## Uso de los Componentes

### En HTML
```html
<!-- Header con configuración -->
<header-ahga base_AHGA="." opciones_AHGA='{"theme": "dark"}'></header-ahga>

<!-- Footer simple -->
<footer-ahga base_AHGA="."></footer-ahga>

<!-- Gestor de perfil -->
<profile-manager-ahga></profile-manager-ahga>

<!-- Drag & drop de imagen -->
<drag-drop-image-ahga 
  width="150" 
  height="150" 
  default-image="./img/avatar.png"
  border-radius="rounded-lg">
</drag-drop-image-ahga>
```

### En JavaScript
```javascript
// Importar utilidades
import { setupCompanyMap_AHGA } from './components/geolocalizacion.js';
import { cargarTestimonios_AHGA } from './components/testimonios.js';

// Usar funciones
setupCompanyMap_AHGA();
cargarTestimonios_AHGA();
```

## Ventajas de la Arquitectura

1. **Reutilización**: Componentes usables en múltiples páginas
2. **Encapsulación**: Lógica y estilos contenidos en cada componente
3. **Mantenibilidad**: Código organizado y fácil de mantener
4. **Escalabilidad**: Fácil agregar nuevos componentes
5. **Rendimiento**: Carga bajo demanda y optimizaciones específicas

## Posibles Mejoras

1. **Shadow DOM**: Encapsulación completa de estilos
2. **Lazy Loading**: Carga diferida de componentes pesados
3. **State Management**: Sistema centralizado de estado
4. **Testing**: Unit tests para cada componente
5. **Documentation**: JSDoc para mejor documentación
6. **Accessibility**: Mejoras en ARIA y navegación por teclado
7. **Internationalization**: Soporte multi-idioma
8. **Theme System**: Sistema de temas dinámico
9. **Performance Monitoring**: Métricas de rendimiento
10. **Error Boundaries**: Manejo robusto de errores