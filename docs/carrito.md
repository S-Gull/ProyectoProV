# Documentación - Carpeta Carrito

## Descripción General
La carpeta `carrito` contiene todo el sistema de comercio electrónico del proyecto AHGA, implementando una arquitectura modular con servicios especializados para manejo de productos, carrito de compras, cupones de descuento e interfaz de usuario.

## Estructura de Archivos

```
carrito/
├── carrito.js      # Servicio principal del carrito de compras
├── cupones.js      # Manejo de cupones y descuentos
├── db.js           # Worker para base de datos SQLite
├── interfaz.js     # Interfaz de usuario y eventos DOM
├── productos.js    # Gestión de productos y stock
└── tienda.js       # Punto de entrada y coordinador principal
```

## Archivos Detallados

### tienda.js

**Propósito**: Punto de entrada principal que coordina todos los servicios del sistema de tienda.

**Funcionalidades**:
- Inicialización de todos los servicios (carrito, productos, cupones, interfaz)
- Configuración de dependencias entre servicios
- Manejo del ciclo de vida de la aplicación
- Exposición de servicios a nivel global para debugging

**Arquitectura**:
```javascript
// Orden de inicialización
1. ServicioCarrito_ahga
2. ServicioProductos_ahga  
3. ServicioCupones_ahga
4. ServicioInterfaz_ahga (recibe referencias de los otros)
```

### carrito.js

**Propósito**: Servicio principal para gestión del carrito de compras con persistencia en IndexedDB.

**Clase**: `ServicioCarrito_ahga`

**Funcionalidades principales**:

1. **Gestión de items**:
   - `agregarAlCarrito_ahga(producto)`: Añade productos al carrito
   - `aumentarCantidad_ahga(id)`: Incrementa cantidad de un producto
   - `disminuirCantidad_ahga(id)`: Reduce cantidad de un producto
   - `eliminarDelCarrito_ahga(id)`: Elimina producto completamente

2. **Persistencia de datos**:
   - Utiliza Web Worker para operaciones de base de datos
   - Sincronización automática con IndexedDB
   - Recuperación de carrito en sesiones posteriores

3. **Procesamiento de compras**:
   - `procesarCompra_ahga()`: Finaliza la compra y guarda el pedido
   - Validación de stock antes de procesar
   - Limpieza automática del carrito tras compra exitosa

4. **Utilidades**:
   - `obtenerTotal_ahga()`: Calcula total del carrito
   - `estaVacio_ahga()`: Verifica si el carrito está vacío
   - `actualizarCarrito_ahga()`: Sincroniza vista con datos

**Comunicación con Worker**:
```javascript
// Mensajes enviados al worker
["iniciar"]                    // Inicializar BD
["obtener_carrito"]            // Recuperar carrito guardado
["guardar_carrito", items]     // Persistir carrito actual
["procesar_pedido", items, total] // Guardar pedido final
```

### db.js

**Propósito**: Web Worker que maneja todas las operaciones de base de datos SQLite usando WASM.

**Funcionalidades**:

1. **Inicialización**:
   - Carga SQLite WASM
   - Crea base de datos con OPFS si está disponible
   - Inicializa esquema de tablas

2. **Esquema de base de datos**:
```sql
-- Tabla para pedidos completados
pedidos_ahga (
  id_ahga INTEGER PRIMARY KEY,
  fecha_ahga TEXT,
  total_ahga REAL
)

-- Detalles de cada pedido
detalle_pedido_ahga (
  id_ahga INTEGER PRIMARY KEY,
  id_pedido_ahga INTEGER,
  producto_id_ahga INTEGER,
  nombre_ahga TEXT,
  cantidad_ahga INTEGER,
  precio_unitario_ahga REAL,
  img_ahga TEXT
)

-- Carrito temporal
carrito_ahga (
  id_producto_ahga INTEGER PRIMARY KEY,
  nombre_ahga TEXT,
  cantidad_ahga INTEGER,
  precio_unitario_ahga REAL,
  img_ahga TEXT
)

-- Cache de productos
productos_ahga (
  id_producto_ahga INTEGER PRIMARY KEY,
  nombre_ahga TEXT,
  cantidad_ahga INTEGER,
  desc_ahga TEXT,
  precio_ahga REAL,
  img_ahga TEXT
)
```

3. **Operaciones principales**:
   - `guardarPedido_ahga()`: Guarda pedido completo con detalles
   - `guardarCarrito_ahga()`: Persiste estado actual del carrito
   - `obtenerCarrito_ahga()`: Recupera carrito guardado
   - `verificarStockDisponible_ahga()`: Valida disponibilidad de productos

### productos.js

**Propósito**: Gestión completa de productos, stock y visualización.

**Clase**: `ServicioProductos_ahga`

**Funcionalidades**:

1. **Carga de datos**:
   - `cargarProductos_ahga()`: Carga productos desde JSON
   - `actualizarStockDesdeBD_ahga()`: Sincroniza stock con base de datos

2. **Visualización**:
   - `mostrarProductos_ahga()`: Renderiza productos en DOM
   - Manejo de estados (disponible, sin stock, en carrito)
   - Botones dinámicos según disponibilidad

3. **Búsqueda y filtrado**:
   - `buscarProductoPorId_ahga()`: Búsqueda por ID
   - `filtrarProductos_ahga()`: Filtrado por criterios
   - `ordenarProductos_ahga()`: Ordenamiento múltiple

4. **Gestión de stock**:
   - `verificarDisponibilidad_ahga()`: Valida stock disponible
   - `actualizarExistencia_ahga()`: Actualiza cantidades
   - `obtenerProductosBajoStock_ahga()`: Productos con poco stock
   - `obtenerProductosAgotados_ahga()`: Productos sin stock

5. **Estadísticas**:
   - `obtenerEstadisticas_ahga()`: Métricas generales de inventario

### cupones.js

**Propósito**: Sistema completo de cupones de descuento integrado con Firebase.

**Clase**: `ServicioCupones_ahga`

**Funcionalidades**:

1. **Gestión de cupones**:
   - `cargarCuponesUsuario_ahga()`: Carga cupones del usuario autenticado
   - `validarCupon_ahga()`: Valida código y condiciones
   - `aplicarCupon_ahga()`: Aplica descuento al carrito
   - `removerCupon_ahga()`: Elimina cupón aplicado

2. **Integración Firebase**:
   - Sincronización con Firestore
   - Autenticación de usuario requerida
   - Marcado de cupones como usados
   - Validación de condiciones en tiempo real

3. **Tipos de descuento**:
   - Porcentaje fijo
   - Monto fijo
   - Descuento por cantidad mínima
   - Cupones de producto específico

4. **Validaciones**:
   - Fecha de expiración
   - Uso único por usuario
   - Monto mínimo de compra
   - Stock de cupón disponible

### interfaz.js

**Propósito**: Manejo completo de la interfaz de usuario y eventos DOM.

**Clase**: `ServicioInterfaz_ahga`

**Funcionalidades principales**:

1. **Gestión DOM**:
   - Inicialización de elementos DOM
   - Configuración de event listeners
   - Actualización dinámica de contenido

2. **Modales del sistema**:
   - Modal del carrito de compras
   - Modal de confirmación de compra
   - Modal de métodos de pago
   - Modal de pago móvil
   - Modal de Zelle
   - Modal de carrito vacío
   - Modal de login requerido

3. **Procesamiento de pagos**:
   - `procesarPagoMovil_ahga()`: Procesa pagos móviles
   - `procesarZelle_ahga()`: Procesa pagos Zelle
   - Validación de formularios de pago
   - Generación de facturas

4. **Gestión de cupones UI**:
   - `aplicarCupon_ahga()`: Interfaz para aplicar cupones
   - `actualizarInfoCupon_ahga()`: Actualiza información de descuentos
   - Visualización de cupones disponibles

5. **Autenticación**:
   - `verificarAutenticacion_ahga()`: Valida usuario logueado
   - `mostrarModalLoginRequerido_ahga()`: Solicita login cuando es necesario

6. **Notificaciones**:
   - Sistema de notificaciones toast
   - Feedback visual de acciones
   - Mensajes de error y éxito

## Flujo de Datos

```
1. tienda.js inicializa todos los servicios
2. productos.js carga catálogo desde JSON
3. carrito.js recupera estado desde IndexedDB
4. interfaz.js renderiza productos y carrito
5. Usuario interactúa con productos
6. carrito.js actualiza estado y persiste en BD
7. cupones.js valida y aplica descuentos
8. interfaz.js procesa pagos y genera facturas
9. carrito.js guarda pedido final en BD
```

## Dependencias Externas

- **SQLite WASM**: Base de datos local
- **Firebase**: Autenticación y cupones
- **Web Workers**: Operaciones de BD en background
- **OPFS**: Sistema de archivos persistente (cuando disponible)

## Patrones de Diseño Utilizados

1. **Módulo**: Cada archivo es un módulo independiente
2. **Servicio**: Clases especializadas por funcionalidad
3. **Observer**: Comunicación entre servicios vía eventos
4. **Worker**: Operaciones pesadas en background
5. **Singleton**: Instancia única de cada servicio

## Características de Seguridad

- Validación de stock en tiempo real
- Autenticación requerida para cupones
- Sanitización de datos de entrada
- Transacciones atómicas en base de datos
- Validación de formularios de pago

## Optimizaciones de Rendimiento

- Web Workers para operaciones de BD
- Lazy loading de productos
- Cache de productos en IndexedDB
- Debounce en búsquedas
- Virtualización de listas largas

## Posibles Mejoras

1. Implementar paginación de productos
2. Añadir filtros avanzados (precio, categoría)
3. Sistema de wishlist
4. Comparador de productos
5. Recomendaciones personalizadas
6. Integración con APIs de pago reales
7. Sistema de reviews y ratings
8. Gestión de inventario en tiempo real
9. Notificaciones push para ofertas
10. Analytics de comportamiento de usuario