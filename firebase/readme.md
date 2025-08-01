# 📦 Carpeta `firebase/` — Autenticación y Gestión de Datos en Nexus AG

Esta carpeta contiene toda la lógica relacionada con la **autenticación de usuarios** y el manejo de datos usando **Firebase Authentication** y **Firestore**. La estructura modular facilita el mantenimiento, extensión y comprensión del código.

---

## 📂 Estructura de la carpeta

```
firebase/
├── config/               # Configuración de Firebase
│   └── firebase.config.js # Parámetros de conexión a Firebase
├── ejemplos/             # Ejemplos de implementación
│   ├── login-ejemplo.js   # Ejemplo de uso de autenticación
│   └── productos-ejemplo.js # Ejemplo de manejo de productos
├── services/             # Servicios de Firebase
│   ├── auth.service.js    # Funciones de autenticación
│   ├── firestore.service.js # Operaciones con Firestore
│   └── index.js           # Inicialización y exportación de servicios
├── ui/                   # Componentes de interfaz de usuario
│   └── auth-ui.js         # UI para autenticación (modales, formularios)
├── utils/                # Utilidades
│   ├── error-handler.js   # Manejo centralizado de errores
│   └── validators.js      # Validación de datos
├── GUIA_MIGRACION.md     # Guía para migrar del código antiguo
└── readme.md             # Este archivo
```

---

## 🔍 ¿Qué hace cada componente?

### 1. Configuración (`config/`)

#### `firebase.config.js`
- Define y exporta el objeto de configuración `firebaseConfig` con las credenciales y parámetros de conexión a Firebase.
- Separa la configuración de la inicialización para mejor organización.

### 2. Servicios (`services/`)

#### `index.js`
- **Inicializa la app de Firebase** con la configuración del proyecto.
- Exporta las instancias de `auth` (para autenticación) y `db` (para Firestore).
- Re-exporta los servicios específicos para facilitar las importaciones.
- Es el punto de entrada principal para acceder a los servicios de Firebase.

#### `auth.service.js`
- **Funciones principales:**
  - `registrarUsuario(email, password, additionalData)`:  
    Registra un usuario en Firebase Authentication y guarda datos extra (nombre, apellido, username, etc.) en Firestore.
  - `iniciarSesion(email, password)`:  
    Inicia sesión con email y contraseña.
  - `cerrarSesion()`:  
    Cierra la sesión del usuario.
- Maneja errores utilizando las utilidades de `error-handler.js`.

#### `firestore.service.js`
- **Funciones principales:**
  - `insertarProductos(productos)`:  
    Inserta un array de productos en la colección `productos` de Firestore.
  - `obtenerProducto(id)`:  
    Obtiene un producto específico por su ID.
  - `obtenerProductos()`:  
    Obtiene todos los productos de la colección.
  - `obtenerUsuario(userId)`:  
    Obtiene los datos de un usuario por su ID.
- Maneja errores utilizando las utilidades de `error-handler.js`.

### 3. Interfaz de Usuario (`ui/`)

#### `auth-ui.js`
- **Controla la interfaz de usuario** para login y registro:
  - Funciones para mostrar/ocultar modales (`showModal`, `hideModal`).
  - Configuración de eventos para cerrar modales (`setupModalCloseEvents`).
  - Cambio entre formularios de login y registro (`setupFormSwitchEvents`).
  - Manejo de envío de formularios (`setupLoginForm`, `setupRegisterForm`).
  - Inicialización automática de componentes (`initAuthUI`).
- Integra validación de datos y servicios de autenticación.

### 4. Utilidades (`utils/`)

#### `error-handler.js`
- Define códigos de error comunes para Firebase Authentication y Firestore.
- Proporciona funciones para manejar errores de forma centralizada:
  - `handleFirebaseError`: Traduce códigos de error a mensajes amigables.
  - `createFriendlyError`: Crea un objeto Error con mensaje amigable.

#### `validators.js`
- Proporciona funciones para validar datos antes de enviarlos a Firebase:
  - `isValidEmail`: Valida formato de correo electrónico.
  - `isValidPassword`: Verifica requisitos mínimos de contraseña.
  - `doPasswordsMatch`: Comprueba que las contraseñas coincidan.
  - `validateUserRegistration`: Valida datos completos de registro.
  - `validateLogin`: Valida datos de inicio de sesión.

### 5. Ejemplos (`ejemplos/`)

#### `login-ejemplo.js`
- Muestra cómo integrar la autenticación en una página.
- Importa e inicializa los componentes de UI para autenticación.

#### `productos-ejemplo.js`
- Demuestra cómo trabajar con productos en Firestore:
  - `cargarProductosEnFirestore`: Carga productos desde JSON a Firestore.
  - `mostrarProductos`: Obtiene y muestra productos en la interfaz.

---

## 🔄 Flujo de Autenticación

1. **El usuario se registra**
   - Completa el formulario de registro.
   - Los datos son validados por `validators.js`.
   - Se llama a `registrarUsuario` de `auth.service.js` que:
     - Crea el usuario en Firebase Authentication.
     - Guarda los datos adicionales en Firestore bajo la colección `users`.
   - Se muestra un modal de éxito o error según el resultado.

2. **El usuario inicia sesión**
   - Completa el formulario de login.
   - Los datos son validados por `validators.js`.
   - Se llama a `iniciarSesion` de `auth.service.js`.
   - Se muestra un modal de éxito o error según el resultado.

3. **El usuario cierra sesión**
   - Se llama a `cerrarSesion` de `auth.service.js`.
   - Se redirige al usuario a la página principal o de login.

---

## 🛠️ Guía de Migración

Si estás migrando desde la estructura anterior, consulta el archivo `GUIA_MIGRACION.md` que contiene instrucciones detalladas sobre cómo actualizar tu código existente para usar esta nueva estructura modular.

---

## 🌟 Beneficios de esta Estructura

- **Código más limpio y mantenible**: Cada archivo tiene una única responsabilidad.
- **Mejor manejo de errores**: Errores centralizados y mensajes amigables.
- **Validación mejorada**: Validación de datos antes de enviarlos a Firebase.
- **Mejor organización**: Separación clara entre configuración, servicios y UI.
- **Más fácil de extender**: Agregar nuevas funcionalidades es más sencillo.
- **Documentación mejorada**: Uso de JSDoc para documentar funciones y parámetros.
