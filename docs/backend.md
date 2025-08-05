# Documentación - Carpeta Backend

## Descripción General
La carpeta `backend` contiene los servicios del lado del servidor para el proyecto AHGA. Actualmente incluye funcionalidades de envío de correos electrónicos para el sistema de contacto.

## Estructura de Archivos

```
backend/
└── mailer.php
```

## Archivos Detallados

### mailer.php

**Propósito**: Servicio de envío de correos electrónicos para el formulario de contacto.

**Funcionalidades principales**:

1. **Configuración CORS**:
   - Permite solicitudes desde `http://localhost:5173` (servidor de desarrollo)
   - Acepta métodos POST y OPTIONS
   - Permite headers de tipo Content-Type

2. **Validación de datos**:
   - Limpia y valida los datos de entrada usando `htmlspecialchars()`
   - Valida que el email sea un Gmail válido
   - Requiere campos: nombre, remitente, asunto, contenido

3. **Configuración SMTP**:
   - Utiliza PHPMailer para envío de correos
   - Configurado para Gmail SMTP (smtp.gmail.com:465)
   - Usa autenticación SMTP con credenciales específicas
   - Encriptación SMTPS para seguridad

4. **Procesamiento de correos**:
   - Destinatario fijo: `alanghidalgo@gmail.com`
   - Remitente: correo de la empresa con Reply-To del usuario
   - Formato HTML con información estructurada
   - Codificación UTF-8 para caracteres especiales

**Parámetros de entrada** (JSON):
```json
{
  "nombre_ah": "string",
  "remitente_ah": "string (Gmail válido)",
  "asunto_ah": "string",
  "contenido_ah": "string"
}
```

**Respuesta** (JSON):
```json
{
  "success_ah": boolean,
  "message_ah": "string"
}
```

**Dependencias**:
- PHPMailer/PHPMailer (instalado vía Composer)
- Configuración SMTP de Gmail
- Credenciales de aplicación específica

**Seguridad**:
- Validación de entrada con `htmlspecialchars()`
- Restricción a emails de Gmail únicamente
- CORS configurado para dominio específico
- Manejo de errores sin exposición de información sensible

**Uso desde el frontend**:
```javascript
fetch('backend/mailer.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nombre_ah: 'Nombre Usuario',
    remitente_ah: 'usuario@gmail.com',
    asunto_ah: 'Asunto del mensaje',
    contenido_ah: 'Contenido del mensaje'
  })
})
```

## Configuración Requerida

1. **Composer**: Instalar dependencias con `composer install`
2. **Gmail**: Configurar contraseña de aplicación específica
3. **SMTP**: Verificar que el servidor permita conexiones SMTP salientes

## Notas de Desarrollo

- El archivo usa sufijos `_ah` en variables para evitar conflictos
- Configurado específicamente para Gmail como proveedor SMTP
- Maneja tanto errores de validación como errores de envío
- Responde siempre en formato JSON para facilitar integración frontend

## Posibles Mejoras

1. Configuración de múltiples proveedores de email
2. Sistema de plantillas para diferentes tipos de correo
3. Rate limiting para prevenir spam
4. Logging de intentos de envío
5. Configuración de variables de entorno para credenciales