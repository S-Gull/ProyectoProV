# 📋 Guía de Migración a la Nueva Estructura de Firebase

Esta guía te ayudará a migrar el código existente a la nueva estructura modular de Firebase.

## Pasos para la migración

### 1. Preparación

1. **Copia de seguridad**: Antes de comenzar, haz una copia de seguridad de la carpeta `firebase/` actual.
2. **Crea la nueva estructura**: Copia la carpeta `firebase/refactorizado/` al nivel raíz del proyecto.
3. **Renombra**: Renombra `firebase/refactorizado/` a `firebase-new/` para mantener ambas versiones durante la transición.

### 2. Actualización de importaciones

Deberás actualizar las importaciones en todos los archivos que utilizan Firebase. Aquí hay algunos ejemplos:

#### Antes:

```javascript
// Importar auth y db
import { auth_ahga, db_ahga } from "./firebase/firebase.js";

// Importar funciones de autenticación
import { registrarUsuario_ahga, iniciarSesion_ahga } from "./firebase/auth.js";
```

#### Después:

```javascript
// Importar auth y db
import { auth, db } from "./firebase-new/services/index.js";

// Importar funciones de autenticación
import { registrarUsuario, iniciarSesion } from "./firebase-new/services/auth.service.js";
```

### 3. Actualización de nombres de funciones y variables

La nueva estructura elimina los sufijos `_ahga` para seguir convenciones de nomenclatura estándar:

#### Antes:

```javascript
const userCredential_ahga = await registrarUsuario_ahga(email_ahga, password_ahga);
```

#### Después:

```javascript
const userCredential = await registrarUsuario(email, password);
```

### 4. Actualización de la página de login

1. Abre `dist/login.html`
2. Actualiza el script de importación:

```html
<!-- Antes -->
<script type="module" src="../firebase/login.js"></script>

<!-- Después -->
<script type="module" src="../firebase-new/ui/auth-ui.js"></script>
```

### 5. Actualización del carrito

Si estás utilizando Firebase para productos en el carrito:

1. Abre `carrito/carrito.js`
2. Actualiza las importaciones comentadas:

```javascript
// Antes
//import { insertar_productos_ahga } from "../firebase/auth.js";

// Después
//import { insertarProductos } from "../firebase-new/services/firestore.service.js";
```

### 6. Pruebas

1. Prueba el registro de usuarios
2. Prueba el inicio de sesión
3. Prueba la funcionalidad del carrito si utiliza Firebase

### 7. Completar la migración

Una vez que hayas verificado que todo funciona correctamente:

1. Elimina la carpeta `firebase/` original
2. Renombra `firebase-new/` a `firebase/`
3. Actualiza todas las importaciones para que apunten a la nueva ubicación

## Beneficios de la nueva estructura

- **Código más limpio y mantenible**: Cada archivo tiene una única responsabilidad
- **Mejor manejo de errores**: Errores centralizados y mensajes amigables
- **Validación mejorada**: Validación de datos antes de enviarlos a Firebase
- **Mejor organización**: Separación clara entre configuración, servicios y UI
- **Más fácil de extender**: Agregar nuevas funcionalidades es más sencillo

## Notas adicionales

- Los nombres de las colecciones en Firestore se han simplificado (de `users_ahga` a `users`)
- Se han agregado nuevas funciones de utilidad que no existían en la versión original
- La nueva estructura incluye mejor documentación con JSDoc