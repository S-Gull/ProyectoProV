# Documentación de la Carpeta `js`

## Descripción General

La carpeta `js` contiene toda la lógica JavaScript del proyecto Nexus AG, incluyendo el motor del juego "Asalto", la gestión de perfiles de usuario, modales, y la funcionalidad principal de la aplicación. Esta carpeta implementa una arquitectura modular con separación clara de responsabilidades.

## Estructura de Archivos

```
js/
├── administradorJuego.js      # Controlador principal del juego "Asalto"
├── app.js                     # Aplicación principal y orquestador
├── editar-perfil.js           # Funcionalidad de edición de perfil
├── image-upload-service.js    # Servicio de subida de imágenes
├── index.js                   # Punto de entrada para la página principal
├── modal.js                   # Sistema de modales reutilizable
├── piezas.js                  # Lógica de piezas del juego
├── tablero.js                 # Gestión del tablero de juego
└── ver-perfil.js              # Funcionalidad de visualización de perfil
```

## Archivos Principales

### 1. `app.js` - Aplicación Principal
**Propósito**: Orquestador principal que coordina todas las funcionalidades del juego y la aplicación.

**Clases principales**:
- **`UIHandler_ahga`**: Manejo de la interfaz de usuario
  - Actualización de estadísticas de juego
  - Mostrar reglas del juego en modal
  - Gestión de elementos DOM

- **`App_ahga`**: Controlador principal de la aplicación
  - Gestión de autenticación de usuarios
  - Coordinación entre juego y Firebase
  - Manejo de modos de juego (individual/multijugador)
  - Registro de estadísticas y partidas

**Funcionalidades principales**:
- **Autenticación**: Integración con Firebase Auth
- **Modos de juego**: Individual y multijugador
- **Estadísticas**: Tracking de partidas y resultados
- **Persistencia**: Guardado de datos en Firebase
- **UI dinámica**: Actualización en tiempo real de la interfaz

**Características técnicas**:
- Patrón MVC para separación de responsabilidades
- Async/await para operaciones asíncronas
- Event-driven architecture
- Integración completa con servicios Firebase

### 2. `administradorJuego.js` - Motor del Juego
**Propósito**: Controlador principal del juego "Asalto" que maneja toda la lógica de juego.

**Clases principales**:
- **`EstadoJuego_ahga`**: Gestión del estado del juego
  - Control de turnos
  - Estado activo/inactivo
  - Pieza seleccionada
  - Movimientos permitidos

- **`InterfazUsuario_ahga`**: Manejo de la interfaz del juego
  - Actualización de información de turnos
  - Modales de resultado
  - Feedback visual al usuario

- **`ReglasJuego_ahga`**: Implementación de las reglas del juego
  - Verificación de condiciones de victoria
  - Validación de movimientos
  - Lógica de captura de piezas

- **`ControladorJuego_ahga`**: Controlador principal
  - Manejo de eventos de canvas
  - Coordinación entre tablero y piezas
  - Gestión de la partida completa

**Funcionalidades principales**:
- **Gestión de turnos**: Alternancia entre atacantes y defensores
- **Detección de victoria**: Múltiples condiciones de victoria
- **Interacción con canvas**: Click y hover en el tablero
- **Validación de movimientos**: Reglas específicas por tipo de pieza
- **Renderizado**: Actualización visual del estado del juego

### 3. `tablero.js` - Gestión del Tablero
**Propósito**: Manejo del tablero de juego, renderizado y lógica espacial.

**Clases principales**:
- **`TableroBase_ahga`**: Clase abstracta base
  - Estructura básica del tablero
  - Validación de casillas
  - Métodos abstractos para implementación

- **`RenderizadorTablero_ahga`**: Renderizado visual
  - Dibujo del tablero en canvas
  - Indicadores de movimiento
  - Efectos visuales (selección, hover)

- **`TableroJuego_ahga`**: Implementación específica del juego
  - Tablero de 8x8 con forma específica
  - Colocación inicial de piezas
  - Cálculo de tamaños y posiciones

**Funcionalidades principales**:
- **Renderizado**: Dibujo completo del tablero y piezas
- **Validación espacial**: Verificación de casillas válidas
- **Gestión de fortalezas**: Casillas especiales del juego
- **Colocación de piezas**: Posicionamiento inicial y durante el juego
- **Cálculos geométricos**: Conversión entre coordenadas de canvas y lógicas

### 4. `piezas.js` - Lógica de Piezas
**Propósito**: Implementación de las piezas del juego y sus movimientos.

**Clases principales**:
- **`PiezaBase_ahga`**: Clase abstracta para todas las piezas
  - Propiedades básicas (posición, tipo, estado)
  - Métodos abstractos para movimiento

- **`ValidadorMovimiento_ahga`**: Utilidades de validación
  - Verificación de casillas válidas
  - Detección de ocupación
  - Validación de movimientos diagonales

- **`EstrategiaMovimientoSoldado_ahga`**: Lógica específica de soldados
  - Movimientos ortogonales y diagonales
  - Restricciones de dirección
  - Validación de avance

- **`EstrategiaMovimientoOficial_ahga`**: Lógica específica de oficiales
  - Movimientos en todas las direcciones
  - Captura por salto
  - Movimientos múltiples

- **`Soldado_ahga`** y **`Oficial_ahga`**: Implementaciones concretas
- **`PiezaFactory_ahga`**: Factory pattern para creación de piezas

**Funcionalidades principales**:
- **Cálculo de movimientos**: Algoritmos específicos por tipo de pieza
- **Validación**: Verificación de movimientos legales
- **Captura**: Lógica de eliminación de piezas enemigas
- **Factory pattern**: Creación centralizada de piezas

### 5. `modal.js` - Sistema de Modales
**Propósito**: Sistema reutilizable de modales para toda la aplicación.

**Clase principal**:
- **`ModalDialog_ahga`**: Gestor de modales
  - Diferentes tipos de modal (success, error, warning, info)
  - Modales de confirmación
  - Modales informativos
  - Gestión de promesas para confirmación

**Funcionalidades principales**:
- **Tipos de modal**: Success, error, warning, info
- **Confirmación**: Modales con botones de acción
- **Promesas**: Integración con async/await
- **Personalización**: Iconos y colores según el tipo
- **Event handling**: Gestión de clicks y teclado

### 6. `index.js` - Página Principal
**Propósito**: Inicialización y funcionalidad de la página de inicio.

**Funcionalidades principales**:
- **Importación de componentes**: Header, footer, mapa, testimonios
- **Formulario de contacto**: Envío de emails a través del backend
- **Inicialización**: Setup de funcionalidades de la landing page
- **Integración**: Conexión con servicios backend

### 7. `editar-perfil.js` - Edición de Perfil
**Propósito**: Funcionalidad completa para editar perfiles de usuario.

**Clase principal**:
- **`EditarPerfil_AHGA`**: Gestor de edición de perfil
  - Validación de contraseñas en tiempo real
  - Integración con servicio de imágenes
  - Actualización de datos en Firebase
  - Feedback visual al usuario

**Funcionalidades principales**:
- **Validación de contraseñas**: Políticas de seguridad en tiempo real
- **Subida de avatar**: Integración con servicio de imágenes
- **Actualización de datos**: Sincronización con Firebase
- **UX mejorada**: Feedback inmediato y validación visual

### 8. `image-upload-service.js` - Servicio de Imágenes
**Propósito**: Servicio especializado para manejo de imágenes de perfil.

**Clase principal**:
- **`ImageUploadService_AHGA`**: Gestor de imágenes
  - Subida a Firebase Storage
  - Optimización automática
  - Preview local
  - Validación de archivos

**Funcionalidades principales**:
- **Subida a Firebase**: Integración con Firebase Storage
- **Optimización**: Redimensionado y compresión automática
- **Validación**: Tipo y tamaño de archivo
- **Fallback**: Preview local si Firebase no está disponible
- **Progreso**: Indicadores de progreso de subida

### 9. `ver-perfil.js` - Visualización de Perfil
**Propósito**: Funcionalidad para mostrar información del perfil de usuario.

**Funcionalidades principales**:
- **Carga de datos**: Obtención de información desde Firebase
- **Renderizado**: Mostrar datos del usuario
- **Navegación**: Enlaces a edición de perfil
- **Estados**: Manejo de carga y errores

## Arquitectura y Patrones de Diseño

### Patrones Implementados

#### 1. **Factory Pattern**
- **`PiezaFactory_ahga`**: Creación centralizada de piezas
- **Ventajas**: Encapsulación de lógica de creación, extensibilidad

#### 2. **Strategy Pattern**
- **`EstrategiaMovimientoSoldado_ahga`** y **`EstrategiaMovimientoOficial_ahga`**
- **Ventajas**: Algoritmos intercambiables, código más limpio

#### 3. **Observer Pattern**
- **Event listeners**: Comunicación entre componentes
- **Callbacks**: Notificación de cambios de estado

#### 4. **MVC (Model-View-Controller)**
- **Model**: Clases de datos (piezas, tablero, estado)
- **View**: Renderizado y UI
- **Controller**: Lógica de negocio y coordinación

#### 5. **Singleton Pattern**
- **`modal_ahga`**: Instancia única del sistema de modales
- **`imageUploadService`**: Servicio único de imágenes

### Separación de Responsabilidades

#### **Lógica de Juego**
- **`piezas.js`**: Comportamiento de piezas
- **`tablero.js`**: Gestión del espacio de juego
- **`administradorJuego.js`**: Coordinación y reglas

#### **Interfaz de Usuario**
- **`modal.js`**: Componentes de UI reutilizables
- **Renderizado**: Separado de la lógica de negocio
- **Event handling**: Centralizado y organizado

#### **Servicios**
- **`image-upload-service.js`**: Manejo de archivos
- **Firebase integration**: Autenticación y datos
- **Backend communication**: APIs y servicios externos

## Integración con Firebase

### Servicios Utilizados
- **Authentication**: Login y registro de usuarios
- **Firestore**: Almacenamiento de datos de usuario y partidas
- **Storage**: Subida de imágenes de perfil

### Flujo de Datos
1. **Autenticación**: Usuario se autentica
2. **Carga de datos**: Información del usuario desde Firestore
3. **Juego**: Interacción local con sincronización opcional
4. **Persistencia**: Guardado de estadísticas y partidas
5. **Actualización**: Sincronización de cambios

## Optimizaciones y Rendimiento

### Renderizado
- **Canvas optimizado**: Redibujado solo cuando es necesario
- **Event throttling**: Limitación de eventos de mouse
- **Lazy loading**: Carga diferida de recursos

### Memoria
- **Cleanup**: Limpieza de event listeners
- **Object pooling**: Reutilización de objetos cuando es posible
- **Garbage collection**: Gestión cuidadosa de referencias

### Red
- **Batch operations**: Agrupación de operaciones Firebase
- **Caching**: Cache local de datos frecuentes
- **Offline support**: Funcionalidad básica sin conexión

## Manejo de Errores

### Estrategias
- **Try-catch**: Manejo de errores asíncronos
- **Validation**: Validación de entrada en múltiples niveles
- **Fallbacks**: Alternativas cuando servicios fallan
- **User feedback**: Mensajes claros de error al usuario

### Logging
- **Console logging**: Información de desarrollo
- **Error tracking**: Registro de errores críticos
- **Performance monitoring**: Métricas de rendimiento

## Testing y Debugging

### Herramientas
- **Console debugging**: Logs detallados
- **Browser DevTools**: Inspección de estado
- **Firebase console**: Monitoreo de datos

### Estrategias de Testing
- **Unit testing**: Funciones individuales
- **Integration testing**: Interacción entre componentes
- **User testing**: Validación de UX

## Seguridad

### Validación
- **Client-side validation**: Validación inmediata
- **Server-side validation**: Validación en Firebase
- **Input sanitization**: Limpieza de datos de entrada

### Autenticación
- **Firebase Auth**: Gestión segura de sesiones
- **Token validation**: Verificación de autenticidad
- **Permission checking**: Control de acceso

## Posibles Mejoras

### Funcionalidad
1. **AI opponent**: Oponente artificial para modo individual
2. **Replay system**: Reproducción de partidas
3. **Tournament mode**: Sistema de torneos
4. **Chat system**: Comunicación entre jugadores
5. **Spectator mode**: Observación de partidas

### Rendimiento
1. **WebGL rendering**: Renderizado acelerado por hardware
2. **Web Workers**: Cálculos en background
3. **Service Workers**: Cache avanzado
4. **Code splitting**: Carga modular de código

### UX/UI
1. **Animations**: Transiciones suaves
2. **Sound effects**: Efectos de sonido
3. **Themes**: Temas personalizables
4. **Accessibility**: Mejoras de accesibilidad
5. **Mobile optimization**: Optimización para móviles

### Arquitectura
1. **TypeScript**: Tipado estático
2. **Module bundling**: Webpack o similar
3. **State management**: Redux o similar
4. **Component framework**: React o Vue
5. **Testing framework**: Jest o similar

### Escalabilidad
1. **Microservices**: Arquitectura de microservicios
2. **CDN**: Distribución de contenido
3. **Load balancing**: Balanceador de carga
4. **Database optimization**: Optimización de consultas
5. **Monitoring**: Monitoreo avanzado de rendimiento