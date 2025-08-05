# Documentación del Proyecto Final AHGA

## Índice
1. [Descripción General](#descripción-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Documentación por Carpetas](#documentación-por-carpetas)
4. [Configuración y Dependencias](#configuración-y-dependencias)
5. [Flujo de la Aplicación](#flujo-de-la-aplicación)
6. [Guía de Desarrollo](#guía-de-desarrollo)

---

## Descripción General

Este es un proyecto web completo que incluye:
- **Juego interactivo** con sistema de estadísticas
- **Sistema de autenticación** con Firebase
- **Tienda virtual** con carrito de compras
- **Gestión de perfiles** de usuario
- **Sistema de cupones** y descuentos
- **Interfaz responsive** con Tailwind CSS

---

## Estructura del Proyecto

```
Proyecto_Final_AHGA/
├── backend/           # Servicios del servidor
├── carrito/          # Sistema de tienda y carrito
├── components/       # Componentes reutilizables
├── css/             # Estilos personalizados
├── dist/            # Páginas HTML principales
├── docs/            # Documentación técnica
├── firebase/        # Configuración y servicios de Firebase
├── img/             # Recursos de imágenes
├── js/              # Scripts principales de la aplicación
├── json/            # Datos estáticos
├── vendor/          # Dependencias de PHP
└── archivos de configuración
```

---

## Documentación por Carpetas

### 📁 `/backend`
**Propósito**: Servicios del lado del servidor

#### Archivos:
- **`mailer.php`**: Servicio de envío de correos electrónicos
  - Maneja el envío de notificaciones
  - Utiliza PHPMailer para el envío seguro
  - Configuración SMTP

---

### 📁 `/carrito`
**Propósito**: Sistema completo de tienda virtual

#### Archivos:
- **`carrito.js`**: Lógica principal del carrito de compras
  - Agregar/eliminar productos
  - Cálculo de totales
  - Persistencia en localStorage

- **`cupones.js`**: Sistema de cupones y descuentos
  - Validación de cupones
  - Aplicación de descuentos
  - Gestión de códigos promocionales

- **`db.js`**: Simulación de base de datos local
  - Almacenamiento temporal
  - Operaciones CRUD básicas

- **`interfaz.js`**: Interfaz de usuario de la tienda
  - Renderizado de productos
  - Interacciones del usuario
  - Actualización dinámica del DOM

- **`productos.js`**: Gestión de productos
  - Catálogo de productos
  - Filtros y búsquedas
  - Detalles de productos

- **`tienda.js`**: Controlador principal de la tienda
  - Coordinación entre módulos
  - Inicialización de la tienda
  - Gestión de estados

---

### 📁 `/components`
**Propósito**: Componentes reutilizables de la interfaz

#### Archivos:
- **`drag-drop-image.js`**: Componente de carga de imágenes
  - Funcionalidad drag & drop
  - Validación de archivos
  - Preview de imágenes

- **`footer.js`**: Componente del pie de página
  - Enlaces de navegación
  - Información de contacto
  - Redes sociales

- **`geolocalizacion.js`**: Servicios de geolocalización
  - Obtención de ubicación del usuario
  - Cálculo de distancias
  - Servicios basados en ubicación

- **`header.js`**: Componente de encabezado
  - Navegación principal
  - Menú de usuario
  - Estado de autenticación

- **`perfil.js`**: Componente de gestión de perfil
  - Edición de datos personales
  - Validación de formularios
  - Actualización de información

- **`testimonios.js`**: Componente de testimonios
  - Carrusel de testimonios
  - Gestión de reseñas
  - Animaciones

---

### 📁 `/css`
**Propósito**: Estilos personalizados de la aplicación

#### Archivos:
- **`juego.css`**: Estilos específicos del juego
  - Tablero de juego
  - Piezas y animaciones
  - Efectos visuales

- **`style.css`**: Estilos globales de la aplicación
  - Variables CSS
  - Componentes base
  - Responsive design

---

### 📁 `/dist`
**Propósito**: Páginas HTML principales de la aplicación

#### Archivos:
- **`carrito.html`**: Página del carrito de compras
  - Lista de productos seleccionados
  - Resumen de compra
  - Proceso de checkout

- **`editar-perfil.html`**: Página de edición de perfil
  - Formulario de datos personales
  - Carga de avatar
  - Validaciones en tiempo real

- **`juego.html`**: Página principal del juego
  - Tablero interactivo
  - Controles de juego
  - Estadísticas en tiempo real

- **`landing.html`**: Página de inicio/landing
  - Presentación del proyecto
  - Características principales
  - Call-to-action

- **`login.html`**: Página de autenticación
  - Formulario de login
  - Registro de usuarios
  - Recuperación de contraseña

- **`ver-perfil.html`**: Página de visualización de perfil
  - Información del usuario
  - Estadísticas de juego
  - Cupones disponibles

---

### 📁 `/docs`
**Propósito**: Documentación técnica del proyecto

#### Archivos:
- **`drag-drop-implementation.md`**: Documentación del sistema drag & drop
  - Implementación técnica
  - APIs utilizadas
  - Casos de uso

---

### 📁 `/firebase`
**Propósito**: Configuración y servicios de Firebase

#### Estructura:
```
firebase/
├── config/           # Configuración de Firebase
├── ejemplos/         # Ejemplos de implementación
├── services/         # Servicios de Firebase
├── ui/              # Componentes de UI para auth
├── utils/           # Utilidades y helpers
└── archivos principales
```

#### Archivos principales:
- **`auth.js`**: Autenticación básica
- **`firebase.js`**: Configuración principal
- **`login.js`**: Lógica de login

#### `/config`:
- **`firebase.config.js`**: Configuración de Firebase
  - API keys
  - Configuración de servicios
  - Inicialización

#### `/ejemplos`:
- **`login-ejemplo.js`**: Ejemplo de implementación de login
- **`productos-ejemplo.js`**: Ejemplo de gestión de productos

#### `/services`:
- **`auth.service.js`**: Servicios de autenticación
  - Login/logout
  - Registro de usuarios
  - Gestión de sesiones

- **`firestore.service.js`**: Servicios de Firestore
  - Operaciones CRUD
  - Consultas complejas
  - Gestión de colecciones

- **`index.js`**: Exportación de servicios

- **`partidas.service.js`**: Servicios de partidas y estadísticas
  - Registro de partidas
  - Estadísticas de usuario
  - Ranking de jugadores

#### `/ui`:
- **`auth-ui.css`**: Estilos para componentes de auth
- **`auth-ui.js`**: Componentes de interfaz de autenticación

#### `/utils`:
- **`captcha.js`**: Implementación de CAPTCHA
- **`error-handler.js`**: Manejo centralizado de errores
- **`password-policy.js`**: Políticas de contraseñas
- **`password-ui.js`**: Interfaz para contraseñas
- **`session-timer.js`**: Gestión de sesiones
- **`validators.js`**: Validadores de formularios

---

### 📁 `/img`
**Propósito**: Recursos de imágenes de la aplicación

#### Categorías:
- **Juegos**: Portadas de videojuegos (Minecraft, GTA V, FIFA, etc.)
- **UI**: Iconos, flechas, estrellas
- **Branding**: Logos del proyecto
- **Secciones**: Imágenes para diferentes secciones
- **Testimonios**: Avatares de testimonios
- **Redes sociales**: Iconos de plataformas

---

### 📁 `/js`
**Propósito**: Scripts principales de la aplicación

#### Archivos:
- **`administradorJuego.js`**: Controlador principal del juego
  - Lógica de juego
  - Gestión de turnos
  - Validación de movimientos

- **`app.js`**: Aplicación principal
  - Inicialización global
  - Gestión de estados
  - Coordinación entre módulos

- **`editar-perfil.js`**: Lógica de edición de perfil
  - Validación de formularios
  - Actualización de datos
  - Manejo de errores

- **`image-upload-service.js`**: Servicio de carga de imágenes
  - Compresión de imágenes
  - Validación de formatos
  - Upload a Firebase Storage

- **`index.js`**: Script de la página principal
  - Inicialización del landing
  - Animaciones
  - Interacciones

- **`modal.js`**: Sistema de modales
  - Creación dinámica
  - Gestión de eventos
  - Animaciones de entrada/salida

- **`piezas.js`**: Definición de piezas del juego
  - Tipos de piezas
  - Movimientos válidos
  - Representación visual

- **`tablero.js`**: Gestión del tablero de juego
  - Renderizado del tablero
  - Detección de clics
  - Actualización visual

- **`ver-perfil.js`**: Lógica de visualización de perfil
  - Carga de datos de usuario
  - Estadísticas en tiempo real
  - Gestión de cupones

---

### 📁 `/json`
**Propósito**: Datos estáticos en formato JSON

#### Archivos:
- **`productos.json`**: Catálogo de productos
  - Lista de videojuegos
  - Precios y descripciones
  - Categorías

---

### 📁 `/vendor`
**Propósito**: Dependencias de PHP (Composer)

#### Contenido:
- **PHPMailer**: Librería para envío de correos
- **Autoloader**: Carga automática de clases
- **Dependencias**: Librerías de terceros

---

## Configuración y Dependencias

### Archivos de configuración:
- **`package.json`**: Dependencias de Node.js y scripts
- **`package-lock.json`**: Versiones exactas de dependencias
- **`composer.json`**: Dependencias de PHP
- **`composer.lock`**: Versiones exactas de PHP
- **`tailwind.config.js`**: Configuración de Tailwind CSS
- **`vite.config.js`**: Configuración del bundler Vite
- **`.gitignore`**: Archivos ignorados por Git

### Tecnologías utilizadas:
- **Frontend**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS
- **Backend**: PHP, Firebase
- **Base de datos**: Firestore
- **Autenticación**: Firebase Auth
- **Build tool**: Vite
- **Gestión de dependencias**: npm (Node.js), Composer (PHP)

---

## Flujo de la Aplicación

### 1. Inicialización
1. Usuario accede a `index.html`
2. Se carga `app.js` que inicializa Firebase
3. Se verifica el estado de autenticación
4. Se redirige según el estado del usuario

### 2. Autenticación
1. Usuario accede a `login.html`
2. `firebase/auth.service.js` maneja el login
3. Se almacenan datos en `sessionStorage`
4. Redirección a la página principal

### 3. Juego
1. Usuario accede a `juego.html`
2. `administradorJuego.js` inicializa el juego
3. `tablero.js` y `piezas.js` manejan la lógica
4. `partidas.service.js` registra resultados

### 4. Perfil
1. Usuario accede a `ver-perfil.html`
2. `ver-perfil.js` carga datos desde Firebase
3. Se muestran estadísticas actualizadas
4. Gestión de cupones disponibles

### 5. Tienda
1. Usuario accede a `carrito.html`
2. Módulos de `/carrito` manejan la lógica
3. Integración con sistema de cupones
4. Proceso de checkout

---

## Guía de Desarrollo

### Instalación:
```bash
# Instalar dependencias de Node.js
npm install

# Instalar dependencias de PHP
composer install

# Iniciar servidor de desarrollo
npm run dev
```

### Estructura de archivos recomendada:
- Mantener separación entre lógica de negocio y presentación
- Utilizar módulos ES6 para mejor organización
- Seguir convenciones de nomenclatura consistentes
- Documentar funciones complejas

### Mejores prácticas:
- Validar datos tanto en frontend como backend
- Manejar errores de manera consistente
- Utilizar async/await para operaciones asíncronas
- Mantener el código DRY (Don't Repeat Yourself)
- Implementar logging para debugging

### Testing:
- Probar funcionalidades en diferentes navegadores
- Validar responsive design en múltiples dispositivos
- Verificar integración con Firebase
- Testear flujos completos de usuario

---
