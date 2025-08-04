# 🚀 Guía de Instalación y Ejecución - Nexus AG

## 📋 Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** (incluido con Node.js)
- **PHP** (versión 7.4 o superior)
- **Composer** (para dependencias de PHP)
- **Navegador web moderno**

## 🛠️ Instalación

### 1. Clonar o Descargar el Proyecto

```bash
# Si tienes el proyecto en Git
git clone [URL_DEL_REPOSITORIO]
cd Proyecto_Final_AHGA

# O simplemente navega a la carpeta del proyecto
cd ruta/al/Proyecto_Final_AHGA
```

### 2. Instalar Dependencias de Node.js

```bash
npm install
```

### 3. Instalar Dependencias de PHP

```bash
composer install
```

## 🚀 Ejecución de la Aplicación

### Opción 1: Desarrollo Frontend (Recomendado)

**Ejecutar el servidor de desarrollo con Vite:**

```bash
npm run dev
```

- La aplicación estará disponible en: `http://localhost:5173/`
- Si el puerto 5173 está ocupado, Vite automáticamente usará el siguiente disponible (ej: 5174, 5175, etc.)
- El servidor incluye hot-reload automático para cambios en tiempo real

### Opción 2: Servidor PHP Local

**Para funcionalidades que requieren PHP (como el envío de emails):**

```bash
# Navegar al directorio del proyecto
cd ruta/al/Proyecto_Final_AHGA

# Iniciar servidor PHP
php -S localhost:8000
```

- La aplicación estará disponible en: `http://localhost:8000/`
- Necesario para el formulario de contacto y funciones de backend

### Opción 3: Ejecución Completa (Frontend + Backend)

**Para desarrollo completo con todas las funcionalidades:**

1. **Terminal 1 - Frontend:**
   ```bash
   npm run dev
   ```

2. **Terminal 2 - Backend PHP:**
   ```bash
   php -S localhost:8000
   ```

## 🎮 Acceso a las Diferentes Secciones

### Páginas Principales:

- **Página Principal:** `http://localhost:5173/` o `http://localhost:8000/`
- **Landing del Juego:** `http://localhost:5173/dist/landing.html`
- **Juego Asalto:** `http://localhost:5173/dist/juego.html`
- **Tienda/Carrito:** `http://localhost:5173/dist/carrito.html`
- **Login:** `http://localhost:5173/dist/login.html`
- **Perfil de Usuario:** `http://localhost:5173/dist/ver-perfil.html`
- **Editar Perfil:** `http://localhost:5173/dist/editar-perfil.html`

## ⚙️ Configuración Adicional

### Firebase (Opcional)

Si quieres usar las funcionalidades de autenticación y base de datos:

1. Configura tu proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Actualiza las credenciales en `firebase/config/firebase.config.js`
3. Habilita Authentication y Firestore en tu proyecto Firebase

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto para configuraciones sensibles:

```env
# Configuración de email (para mailer.php)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=tu-email@gmail.com
SMTP_PASSWORD=tu-contraseña-de-aplicacion
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Construir para producción
npm run build

# Vista previa de la build de producción
npm run preview
```

## 🎯 Funcionalidades Principales

### 🕹️ Juego "Asalto"
- Juego de mesa estratégico implementado en Canvas
- Sistema de turnos entre atacantes y defensores
- Lógica completa de victoria y movimientos

### 🛒 Sistema de E-commerce
- Carrito de compras con persistencia local
- Sistema de cupones y descuentos
- Gestión de productos y stock

### 👤 Gestión de Usuarios
- Registro y autenticación con Firebase
- Perfiles de usuario editables
- Subida de imágenes de perfil

### 📧 Contacto
- Formulario de contacto con envío por email
- Validación de campos y captcha

## 🐛 Solución de Problemas

### Puerto Ocupado
```bash
# Si el puerto está ocupado, puedes especificar uno diferente
npm run dev -- --port 3000
```

### Problemas con PHP
```bash
# Verificar versión de PHP
php --version

# Verificar si Composer está instalado
composer --version
```

### Problemas con Node.js
```bash
# Verificar versión de Node.js
node --version

# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 📱 Compatibilidad

- **Navegadores:** Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos:** Desktop, tablet y móvil (responsive design)
- **Sistemas:** Windows, macOS, Linux

## 🤝 Desarrollo

### Estructura del Proyecto
```
├── dist/           # Páginas HTML principales
├── js/             # Lógica JavaScript del juego
├── components/     # Componentes web reutilizables
├── firebase/       # Configuración y servicios de Firebase
├── carrito/        # Lógica del sistema de compras
├── css/            # Estilos personalizados
├── img/            # Recursos de imágenes
├── backend/        # Scripts PHP del servidor
└── json/           # Datos de productos
```

### Tecnologías Utilizadas
- **Frontend:** Vite, Tailwind CSS, Vanilla JavaScript
- **Backend:** PHP, PHPMailer
- **Base de Datos:** Firebase Firestore, SQLite (local)
- **Autenticación:** Firebase Auth
- **Almacenamiento:** Firebase Storage

---

**¡Listo para jugar! 🎮**

Si encuentras algún problema, revisa la consola del navegador y la terminal para mensajes de error específicos.