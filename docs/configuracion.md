# Documentación de Configuración del Proyecto

## Descripción General

Este documento describe la configuración completa del proyecto Nexus AG, incluyendo las herramientas de desarrollo, dependencias, scripts de construcción y configuración del entorno. El proyecto utiliza una arquitectura híbrida con frontend moderno (Vite + JavaScript) y backend PHP para funcionalidades específicas.

## Archivos de Configuración

### Estructura de Configuración

```
Proyecto_Final_AHGA/
├── package.json              # Configuración de Node.js y dependencias frontend
├── package-lock.json         # Lock file de dependencias Node.js
├── composer.json             # Configuración de PHP y dependencias backend
├── composer.lock             # Lock file de dependencias PHP
├── vite.config.js           # Configuración del bundler Vite
├── tailwind.config.js       # Configuración de Tailwind CSS (vacío)
├── .gitignore               # Archivos ignorados por Git
├── README.md                # Documentación principal del proyecto
├── SETUP.md                 # Guía de instalación y configuración
└── DOCUMENTACION.md         # Documentación técnica
```

## Configuración Frontend (Node.js)

### `package.json`

**Información del proyecto**:
- **Nombre**: `frontend`
- **Versión**: `0.0.0`
- **Tipo**: `module` (ES Modules)
- **Privado**: `true` (no se publica en npm)

**Scripts disponibles**:
```json
{
  "dev": "vite",           // Servidor de desarrollo
  "build": "vite build",   // Construcción para producción
  "preview": "vite preview", // Vista previa de la build
  "start": "npm run dev"   // Alias para desarrollo
}
```

**Dependencias de desarrollo**:
- **Vite v7.0.4**: Bundler y servidor de desarrollo moderno
  - Build tool rápido
  - Hot Module Replacement (HMR)
  - Soporte nativo para ES modules
  - Optimización automática

**Dependencias de producción**:
- **@sqlite.org/sqlite-wasm v3.42.0-build6**: SQLite compilado a WebAssembly
  - Base de datos local en el navegador
  - Persistencia de datos offline
  - Compatibilidad con SQL estándar
  - Rendimiento optimizado

### Comandos de Desarrollo

#### **Desarrollo local**
```bash
npm run dev
# o
npm start
```
- Inicia servidor de desarrollo en `http://localhost:5173`
- Hot reload automático
- Proxy configurado para APIs

#### **Construcción para producción**
```bash
npm run build
```
- Genera archivos optimizados en `/dist`
- Minificación automática
- Tree shaking
- Code splitting

#### **Vista previa de producción**
```bash
npm run preview
```
- Sirve la build de producción localmente
- Útil para testing antes del deploy

## Configuración Backend (PHP)

### `composer.json`

**Dependencias**:
- **phpmailer/phpmailer ^6.10**: Librería para envío de correos electrónicos
  - Soporte SMTP completo
  - Autenticación OAuth2
  - Seguridad mejorada
  - Manejo de adjuntos

**Características**:
- Configuración mínima y enfocada
- Solo dependencias esenciales
- Versionado semántico (^6.10 = >=6.10.0 <7.0.0)

### Comandos de PHP

#### **Instalación de dependencias**
```bash
composer install
```

#### **Actualización de dependencias**
```bash
composer update
```

#### **Autoload de clases**
```php
require_once 'vendor/autoload.php';
```

## Configuración de Vite

### `vite.config.js`

**Configuración del servidor de desarrollo**:

#### **Página de inicio**
```javascript
open: "/carrito.html"
```
- Abre automáticamente la página del carrito al iniciar

#### **Headers de seguridad**
```javascript
headers: {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp"
}
```
- **COOP**: Aislamiento de contexto de navegación
- **COEP**: Requerimiento de CORP para recursos
- **Propósito**: Habilitar SharedArrayBuffer y APIs avanzadas

#### **Configuración de Proxy**

**1. Tiles de OpenStreetMap**
```javascript
"/osm-tiles/": {
  target: "https://a.tile.openstreetmap.org",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^/osm-tiles/, "")
}
```
- **Propósito**: Evitar problemas de CORS con mapas
- **Uso**: Componente de geolocalización

**2. Avatares de Pravatar**
```javascript
"/pravatar/": {
  target: "https://i.pravatar.cc",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^/pravatar/, "")
}
```
- **Propósito**: Servir avatares aleatorios
- **Uso**: Imágenes de perfil por defecto

**3. Backend PHP**
```javascript
"/api/": {
  target: "http://localhost:8000",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^/api/, "")
}
```
- **Propósito**: Comunicación con backend PHP
- **Uso**: Envío de correos electrónicos
- **Servidor**: PHP built-in server en puerto 8000

#### **Optimización de dependencias**
```javascript
optimizeDeps: {
  exclude: ["@sqlite.org/sqlite-wasm"]
}
```
- **Propósito**: Excluir SQLite WASM de la optimización
- **Razón**: Manejo especial para archivos WASM

#### **Configuración de Workers**
```javascript
worker: {
  format: "es"
}
```
- **Propósito**: Usar ES modules en Web Workers
- **Beneficio**: Mejor compatibilidad y rendimiento

#### **Assets especiales**
```javascript
assetsInclude: ["**/*.wasm"]
```
- **Propósito**: Incluir archivos WASM como assets
- **Uso**: SQLite WebAssembly

## Configuración de Tailwind CSS

### `tailwind.config.js`

**Estado actual**: Archivo vacío

**Configuración recomendada**:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./dist/**/*.html",
    "./js/**/*.js",
    "./components/**/*.js",
    "./carrito/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'nexus-primary': '#your-primary-color',
        'nexus-secondary': '#your-secondary-color'
      },
      fontFamily: {
        'nexus': ['Your-Font', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

## Configuración de Git

### `.gitignore`

**Archivos típicamente ignorados**:
```gitignore
# Dependencias
node_modules/
vendor/

# Builds
dist/
build/

# Logs
*.log
npm-debug.log*

# Entorno
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporales
*.tmp
*.temp
```

## Configuración del Entorno de Desarrollo

### Requisitos del Sistema

#### **Node.js**
- **Versión mínima**: 16.x
- **Recomendada**: 18.x o superior
- **Gestor de paquetes**: npm o yarn

#### **PHP**
- **Versión mínima**: 7.4
- **Recomendada**: 8.1 o superior
- **Extensiones requeridas**:
  - `ext-ctype`
  - `ext-filter`
  - `ext-hash`
  - `ext-openssl` (recomendada)
  - `ext-mbstring` (recomendada)

#### **Composer**
- **Versión**: 2.x
- **Instalación global recomendada**

### Setup del Proyecto

#### **1. Clonar repositorio**
```bash
git clone [repository-url]
cd Proyecto_Final_AHGA
```

#### **2. Instalar dependencias frontend**
```bash
npm install
```

#### **3. Instalar dependencias backend**
```bash
composer install
```

#### **4. Iniciar servidor PHP (terminal separado)**
```bash
php -S localhost:8000 -t backend/
```

#### **5. Iniciar servidor de desarrollo**
```bash
npm run dev
```

#### **6. Acceder a la aplicación**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000

## Configuración de Producción

### Build del Frontend

#### **1. Construcción**
```bash
npm run build
```

#### **2. Archivos generados**
- **Ubicación**: `/dist`
- **Contenido**: HTML, CSS, JS optimizados
- **Assets**: Imágenes, fuentes, WASM

#### **3. Servidor web**
- **Apache**: Configurar DocumentRoot a `/dist`
- **Nginx**: Servir archivos estáticos desde `/dist`
- **Headers**: Configurar COOP/COEP para SQLite WASM

### Configuración del Backend

#### **1. Servidor PHP**
- **Apache**: Módulo PHP habilitado
- **Nginx**: PHP-FPM configurado
- **Permisos**: Lectura/escritura en directorios necesarios

#### **2. Variables de entorno**
```bash
# .env
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_PORT=587
SMTP_SECURE=tls
```

#### **3. Configuración SMTP**
- **Gmail**: Habilitar autenticación de 2 factores
- **App Password**: Generar contraseña específica
- **Firewall**: Permitir conexiones SMTP salientes

## Optimizaciones y Performance

### Frontend

#### **Vite Optimizations**
- **Tree shaking**: Eliminación de código no usado
- **Code splitting**: División automática de bundles
- **Asset optimization**: Compresión de imágenes y assets
- **CSS purging**: Eliminación de CSS no usado

#### **SQLite WASM**
- **Lazy loading**: Carga bajo demanda
- **Worker threads**: Procesamiento en background
- **Memory management**: Gestión eficiente de memoria

### Backend

#### **PHP Optimizations**
- **OPcache**: Cache de bytecode PHP
- **Composer autoloader**: Optimización de autoload
- **Memory limits**: Configuración adecuada de memoria

#### **SMTP Optimizations**
- **Connection pooling**: Reutilización de conexiones
- **Batch sending**: Envío en lotes
- **Error handling**: Manejo robusto de errores

## Monitoreo y Debugging

### Herramientas de Desarrollo

#### **Frontend**
- **Vite DevTools**: Debugging integrado
- **Browser DevTools**: Inspección de red y performance
- **Vue DevTools**: Si se usa Vue.js

#### **Backend**
- **Xdebug**: Debugging de PHP
- **Error logs**: Logs de errores de PHP
- **SMTP debugging**: Logs de PHPMailer

### Logging

#### **Frontend**
```javascript
// Desarrollo
if (import.meta.env.DEV) {
  console.log('Debug info');
}

// Producción
if (import.meta.env.PROD) {
  // Enviar a servicio de logging
}
```

#### **Backend**
```php
// Error logging
error_log('Error message', 3, '/path/to/error.log');

// PHPMailer debugging
$mail->SMTPDebug = SMTP::DEBUG_SERVER;
```

## Seguridad

### Frontend

#### **Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-eval'; 
               worker-src 'self' blob:;">
```

#### **HTTPS**
- **Desarrollo**: No requerido
- **Producción**: Obligatorio para SQLite WASM

### Backend

#### **Validación de entrada**
```php
// Validar email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    throw new InvalidArgumentException('Email inválido');
}

// Sanitizar datos
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
```

#### **Rate limiting**
```php
// Implementar límites de envío
session_start();
if (isset($_SESSION['last_email']) && 
    time() - $_SESSION['last_email'] < 60) {
    http_response_code(429);
    exit('Too many requests');
}
```

## Troubleshooting

### Problemas Comunes

#### **1. Error de CORS**
- **Síntoma**: Requests bloqueados por CORS
- **Solución**: Verificar configuración de proxy en Vite
- **Alternativa**: Configurar headers CORS en backend

#### **2. SQLite WASM no carga**
- **Síntoma**: Error al inicializar SQLite
- **Solución**: Verificar headers COOP/COEP
- **Alternativa**: Servir desde HTTPS

#### **3. PHPMailer falla**
- **Síntoma**: Errores de autenticación SMTP
- **Solución**: Verificar credenciales y configuración
- **Debug**: Habilitar SMTP debugging

#### **4. Assets no cargan**
- **Síntoma**: Imágenes o archivos no se muestran
- **Solución**: Verificar rutas relativas
- **Alternativa**: Usar rutas absolutas

### Comandos de Diagnóstico

```bash
# Verificar versiones
node --version
npm --version
php --version
composer --version

# Verificar dependencias
npm list
composer show

# Limpiar cache
npm cache clean --force
composer clear-cache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

rm -rf vendor composer.lock
composer install
```

## Conclusión

La configuración del proyecto Nexus AG está diseñada para proporcionar un entorno de desarrollo moderno y eficiente, combinando las mejores prácticas de desarrollo frontend con un backend PHP robusto. La configuración de Vite permite un desarrollo rápido con hot reload, mientras que la integración con SQLite WASM y PHPMailer proporciona funcionalidades avanzadas tanto en el cliente como en el servidor.

Esta configuración es escalable y puede adaptarse fácilmente a diferentes entornos de deployment, desde desarrollo local hasta producción en la nube, manteniendo siempre la seguridad y el rendimiento como prioridades principales.