# Implementación de Drag and Drop para Fotos de Perfil

## Descripción General

Se ha implementado una funcionalidad completa de **drag and drop** para las fotos de perfil que permite a los usuarios:

- Arrastrar y soltar imágenes directamente en la zona de avatar
- Hacer clic para seleccionar imágenes desde el explorador de archivos
- Previsualizar imágenes antes de guardar
- Optimización automática de imágenes
- Subida a Firebase Storage (cuando esté configurado)
- Validación de tipos y tamaños de archivo

## Componentes Implementados

### 1. Componente Drag-Drop-Image (`components/drag-drop-image.js`)

**Características:**

- Web Component reutilizable
- Interfaz visual intuitiva con efectos hover
- Validación de archivos (tipos: JPG, PNG, GIF, WebP | tamaño máx: 5MB)
- Indicadores visuales de carga y progreso
- Botón para eliminar imagen seleccionada
- Eventos personalizados para integración

**Uso:**

```html
<drag-drop-image-ahga
  id="avatarDragDrop_ahga"
  width="120"
  height="120"
  border-radius="rounded-full"
  default-image="https://ui-avatars.com/api/?name=Usuario&background=72b01d&color=fff&size=120"
></drag-drop-image-ahga>
```

**Eventos:**

- `imageChanged`: Se dispara cuando se selecciona una nueva imagen
- `imageRemoved`: Se dispara cuando se elimina la imagen

### 2. Servicio de Subida de Imágenes (`js/image-upload-service.js`)

**Características:**

- Integración con Firebase Storage
- Optimización automática de imágenes
- Redimensionamiento manteniendo proporción
- Compresión con calidad configurable
- Fallback a preview local si Firebase no está disponible
- Eliminación de imágenes anteriores

**Métodos principales:**

- `processProfileImage(file, userId, options)`: Procesa y sube imagen completa
- `optimizeImage(file, maxWidth, maxHeight, quality)`: Optimiza imagen
- `uploadProfileImage(file, userId)`: Sube imagen a Firebase
- `deleteProfileImage(imageUrl)`: Elimina imagen anterior

## Integración en el Sistema

### Editar Perfil (`dist/editar-perfil.html`)

1. **Reemplazo del sistema anterior**: Se sustituyó el input file tradicional por el componente drag-drop
2. **Eventos integrados**: El componente se conecta automáticamente con la lógica de guardado
3. **Validación mejorada**: Validación en tiempo real de archivos

### Actualización de JavaScript (`js/editar-perfil.js`)

1. **Integración del servicio**: Se inicializa el servicio de imágenes
2. **Manejo de eventos**: Escucha eventos del componente drag-drop
3. **Proceso de guardado mejorado**:
   - Optimización automática de imágenes
   - Subida a Firebase Storage
   - Eliminación de imágenes anteriores
   - Fallback a preview local
   - Notificaciones de progreso

## Flujo de Funcionamiento

### 1. Selección de Imagen

```
Usuario arrastra imagen → Validación → Preview → Evento imageChanged
```

### 2. Guardado de Perfil

```
Click Guardar → Optimización → Subida Firebase → Actualización BD → Redirección
```

### 3. Visualización

```
Ver Perfil → Carga datos → Muestra imagen actualizada
Header → Actualización automática del avatar
```

## Configuración y Personalización

### Opciones del Componente

| Atributo        | Descripción               | Valor por defecto |
| --------------- | ------------------------- | ----------------- |
| `width`         | Ancho en píxeles          | `120`             |
| `height`        | Alto en píxeles           | `120`             |
| `border-radius` | Clase CSS para bordes     | `rounded-full`    |
| `default-image` | URL de imagen por defecto | Avatar generado   |

### Opciones del Servicio

```javascript
const options = {
  optimize: true, // Optimizar imagen
  maxWidth: 400, // Ancho máximo
  maxHeight: 400, // Alto máximo
  quality: 0.8, // Calidad de compresión (0-1)
  maxSizeMB: 5, // Tamaño máximo en MB
};
```

## Beneficios de la Implementación

### Para el Usuario

- **Experiencia intuitiva**: Drag and drop natural
- **Feedback visual**: Indicadores claros de estado
- **Validación inmediata**: Errores mostrados al instante
- **Optimización automática**: Imágenes optimizadas sin intervención

### Para el Desarrollador

- **Componente reutilizable**: Fácil de implementar en otras partes
- **Código modular**: Separación clara de responsabilidades
- **Manejo de errores robusto**: Fallbacks y validaciones
- **Integración Firebase**: Preparado para producción

### Para el Sistema

- **Rendimiento optimizado**: Imágenes comprimidas automáticamente
- **Almacenamiento eficiente**: Solo se guardan imágenes necesarias
- **Consistencia visual**: Mismo componente en toda la aplicación
- **Escalabilidad**: Fácil de extender y mantener

## Archivos Modificados

1. **Nuevos archivos:**

   - `components/drag-drop-image.js`
   - `js/image-upload-service.js`
   - `docs/drag-drop-implementation.md`

2. **Archivos modificados:**
   - `dist/editar-perfil.html`
   - `js/editar-perfil.js`

## Próximos Pasos Recomendados

1. **Configurar Firebase Storage** para subida real de imágenes
2. **Implementar en ver-perfil.html** para consistencia visual
3. **Añadir soporte para múltiples imágenes** si es necesario
4. **Implementar caché de imágenes** para mejor rendimiento
5. **Añadir filtros de imagen** (opcional)

## Notas Técnicas

- **Compatibilidad**: Funciona en todos los navegadores modernos
- **Accesibilidad**: Incluye atributos ARIA y navegación por teclado
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Performance**: Optimización automática reduce el tamaño de archivos
- **Seguridad**: Validación tanto en cliente como en servidor
