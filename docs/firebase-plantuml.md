# Diagramas de Casos de Uso Firebase - PlantUML

## 1. Diagrama General de Casos de Uso Firebase

```plantuml
@startuml Firebase_Use_Cases
!theme plain
title Casos de Uso - Firebase Services

' Actores
actor "Usuario" as User
actor "Administrador" as Admin
actor "Sistema" as System
actor "Firebase" as Firebase

' Paquetes de casos de uso
package "Autenticación" {
  usecase "Registrar Usuario" as UC1
  usecase "Iniciar Sesión" as UC2
  usecase "Cerrar Sesión" as UC3
  usecase "Recuperar Contraseña" as UC4
  usecase "Validar Token" as UC5
  usecase "Renovar Sesión" as UC6
}

package "Gestión de Datos" {
  usecase "Crear Documento" as UC7
  usecase "Leer Documento" as UC8
  usecase "Actualizar Documento" as UC9
  usecase "Eliminar Documento" as UC10
  usecase "Consultar Colección" as UC11
  usecase "Escuchar Cambios" as UC12
}

package "Gestión de Archivos" {
  usecase "Subir Archivo" as UC13
  usecase "Descargar Archivo" as UC14
  usecase "Eliminar Archivo" as UC15
  usecase "Obtener URL" as UC16
}

package "Seguridad" {
  usecase "Aplicar Reglas" as UC17
  usecase "Validar Permisos" as UC18
  usecase "Auditar Accesos" as UC19
  usecase "Manejar Errores" as UC20
}

' Relaciones Usuario
User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC13
User --> UC14

' Relaciones Administrador
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11
Admin --> UC15
Admin --> UC19

' Relaciones Sistema
System --> UC5
System --> UC6
System --> UC12
System --> UC16
System --> UC17
System --> UC18
System --> UC20

' Relaciones Firebase
Firebase --> UC5
Firebase --> UC17
Firebase --> UC18
Firebase --> UC20

' Dependencias
UC1 ..> UC5 : <<include>>
UC2 ..> UC5 : <<include>>
UC7 ..> UC18 : <<include>>
UC8 ..> UC18 : <<include>>
UC9 ..> UC18 : <<include>>
UC10 ..> UC18 : <<include>>
UC13 ..> UC18 : <<include>>
UC14 ..> UC18 : <<include>>
UC15 ..> UC18 : <<include>>

@enduml
```

## 2. Diagrama de Autenticación Firebase

```plantuml
@startuml Firebase_Authentication
!theme plain
title Firebase Authentication - Casos de Uso

' Actores
actor "Usuario" as User
actor "Sistema" as System
actor "Firebase Auth" as FBAuth

' Casos de uso principales
package "Registro" {
  usecase "Validar Email" as UC1
  usecase "Validar Contraseña" as UC2
  usecase "Crear Cuenta" as UC3
  usecase "Enviar Verificación" as UC4
}

package "Login" {
  usecase "Autenticar Credenciales" as UC5
  usecase "Generar Token" as UC6
  usecase "Establecer Sesión" as UC7
}

package "Gestión de Sesión" {
  usecase "Verificar Token" as UC8
  usecase "Renovar Token" as UC9
  usecase "Cerrar Sesión" as UC10
  usecase "Limpiar Datos" as UC11
}

package "Recuperación" {
  usecase "Solicitar Reset" as UC12
  usecase "Enviar Email Reset" as UC13
  usecase "Validar Código" as UC14
  usecase "Cambiar Contraseña" as UC15
}

' Relaciones
User --> UC1
User --> UC2
User --> UC3
User --> UC5
User --> UC10
User --> UC12
User --> UC15

System --> UC6
System --> UC7
System --> UC8
System --> UC9
System --> UC11
System --> UC14

FBAuth --> UC4
FBAuth --> UC6
FBAuth --> UC8
FBAuth --> UC13

' Flujos
UC1 ..> UC2 : <<extend>>
UC2 ..> UC3 : <<extend>>
UC3 ..> UC4 : <<include>>
UC5 ..> UC6 : <<include>>
UC6 ..> UC7 : <<include>>
UC8 ..> UC9 : <<extend>>
UC10 ..> UC11 : <<include>>
UC12 ..> UC13 : <<include>>
UC14 ..> UC15 : <<extend>>

@enduml
```

## 3. Diagrama de Firestore Database

```plantuml
@startuml Firestore_Database
!theme plain
title Firestore Database - Casos de Uso

' Actores
actor "Aplicación" as App
actor "Usuario" as User
actor "Firestore" as FS
actor "Security Rules" as Rules

' Casos de uso CRUD
package "Operaciones CRUD" {
  usecase "Crear Documento" as UC1
  usecase "Leer Documento" as UC2
  usecase "Actualizar Documento" as UC3
  usecase "Eliminar Documento" as UC4
}

package "Consultas" {
  usecase "Consulta Simple" as UC5
  usecase "Consulta Compuesta" as UC6
  usecase "Ordenar Resultados" as UC7
  usecase "Limitar Resultados" as UC8
  usecase "Paginar Resultados" as UC9
}

package "Tiempo Real" {
  usecase "Escuchar Documento" as UC10
  usecase "Escuchar Colección" as UC11
  usecase "Detectar Cambios" as UC12
  usecase "Notificar Cambios" as UC13
}

package "Transacciones" {
  usecase "Iniciar Transacción" as UC14
  usecase "Ejecutar Operaciones" as UC15
  usecase "Confirmar Transacción" as UC16
  usecase "Revertir Transacción" as UC17
}

package "Seguridad" {
  usecase "Validar Permisos" as UC18
  usecase "Aplicar Reglas" as UC19
  usecase "Verificar Autenticación" as UC20
}

' Relaciones principales
App --> UC1
App --> UC2
App --> UC3
App --> UC4
App --> UC5
App --> UC6
App --> UC10
App --> UC11
App --> UC14

User --> UC2
User --> UC5

FS --> UC7
FS --> UC8
FS --> UC9
FS --> UC12
FS --> UC13
FS --> UC15
FS --> UC16
FS --> UC17

Rules --> UC18
Rules --> UC19
Rules --> UC20

' Dependencias
UC1 ..> UC18 : <<include>>
UC2 ..> UC18 : <<include>>
UC3 ..> UC18 : <<include>>
UC4 ..> UC18 : <<include>>
UC5 ..> UC18 : <<include>>
UC6 ..> UC18 : <<include>>
UC10 ..> UC18 : <<include>>
UC11 ..> UC18 : <<include>>

UC18 ..> UC19 : <<include>>
UC18 ..> UC20 : <<include>>

UC6 ..> UC7 : <<extend>>
UC6 ..> UC8 : <<extend>>
UC6 ..> UC9 : <<extend>>

UC14 ..> UC15 : <<include>>
UC15 ..> UC16 : <<extend>>
UC15 ..> UC17 : <<extend>>

@enduml
```

## 4. Diagrama de Firebase Storage

```plantuml
@startuml Firebase_Storage
!theme plain
title Firebase Storage - Casos de Uso

' Actores
actor "Usuario" as User
actor "Aplicación" as App
actor "Storage" as Storage
actor "Security Rules" as Rules

' Casos de uso principales
package "Gestión de Archivos" {
  usecase "Subir Archivo" as UC1
  usecase "Descargar Archivo" as UC2
  usecase "Eliminar Archivo" as UC3
  usecase "Listar Archivos" as UC4
  usecase "Obtener Metadatos" as UC5
  usecase "Actualizar Metadatos" as UC6
}

package "URLs y Referencias" {
  usecase "Generar URL Descarga" as UC7
  usecase "Crear Referencia" as UC8
  usecase "Validar Referencia" as UC9
}

package "Validación" {
  usecase "Validar Tipo Archivo" as UC10
  usecase "Validar Tamaño" as UC11
  usecase "Validar Permisos" as UC12
  usecase "Escanear Contenido" as UC13
}

package "Monitoreo" {
  usecase "Rastrear Progreso" as UC14
  usecase "Manejar Errores" as UC15
  usecase "Registrar Actividad" as UC16
}

' Relaciones
User --> UC1
User --> UC2

App --> UC1
App --> UC2
App --> UC3
App --> UC4
App --> UC7
App --> UC8
App --> UC14

Storage --> UC5
Storage --> UC6
Storage --> UC9
Storage --> UC13
Storage --> UC15
Storage --> UC16

Rules --> UC10
Rules --> UC11
Rules --> UC12

' Dependencias
UC1 ..> UC10 : <<include>>
UC1 ..> UC11 : <<include>>
UC1 ..> UC12 : <<include>>
UC1 ..> UC14 : <<include>>

UC2 ..> UC12 : <<include>>
UC2 ..> UC9 : <<include>>

UC3 ..> UC12 : <<include>>
UC4 ..> UC12 : <<include>>

UC7 ..> UC8 : <<include>>
UC8 ..> UC9 : <<include>>

UC1 ..> UC13 : <<extend>>
UC1 ..> UC15 : <<extend>>

@enduml
```

## 5. Diagrama de Casos de Uso Específicos del Proyecto

```plantuml
@startuml Project_Specific_Firebase
!theme plain
title Casos de Uso Firebase - Proyecto Específico

' Actores
actor "Jugador" as Player
actor "Sistema Juego" as GameSystem
actor "Administrador" as Admin

' Casos de uso específicos
package "Gestión de Usuarios" {
  usecase "Registrar Jugador" as UC1
  usecase "Autenticar Jugador" as UC2
  usecase "Actualizar Perfil" as UC3
  usecase "Subir Avatar" as UC4
  usecase "Ver Perfil" as UC5
}

package "Gestión de Partidas" {
  usecase "Guardar Partida" as UC6
  usecase "Cargar Historial" as UC7
  usecase "Calcular Estadísticas" as UC8
  usecase "Generar Ranking" as UC9
}

package "Gestión de Productos" {
  usecase "Cargar Catálogo" as UC10
  usecase "Gestionar Carrito" as UC11
  usecase "Procesar Compra" as UC12
  usecase "Aplicar Cupones" as UC13
}

package "Configuración" {
  usecase "Configurar Firebase" as UC14
  usecase "Inicializar Servicios" as UC15
  usecase "Manejar Conexión" as UC16
  usecase "Gestionar Errores" as UC17
}

' Relaciones
Player --> UC1
Player --> UC2
Player --> UC3
Player --> UC4
Player --> UC5
Player --> UC7
Player --> UC10
Player --> UC11
Player --> UC12

GameSystem --> UC6
GameSystem --> UC8
GameSystem --> UC9
GameSystem --> UC14
GameSystem --> UC15
GameSystem --> UC16
GameSystem --> UC17

Admin --> UC10
Admin --> UC13
Admin --> UC17

' Dependencias y extensiones
UC1 ..> UC14 : <<include>>
UC2 ..> UC15 : <<include>>
UC3 ..> UC2 : <<include>>
UC4 ..> UC2 : <<include>>
UC5 ..> UC2 : <<include>>
UC6 ..> UC2 : <<include>>
UC7 ..> UC2 : <<include>>
UC11 ..> UC2 : <<include>>
UC12 ..> UC2 : <<include>>

UC6 ..> UC8 : <<extend>>
UC8 ..> UC9 : <<extend>>
UC12 ..> UC13 : <<extend>>

UC15 ..> UC16 : <<include>>
UC16 ..> UC17 : <<extend>>

@enduml
```

## 6. Diagrama de Secuencia - Autenticación

```plantuml
@startuml Firebase_Auth_Sequence
!theme plain
title Secuencia de Autenticación Firebase

participant "Usuario" as User
participant "App" as App
participant "Auth Service" as AuthService
participant "Firebase Auth" as FBAuth
participant "Firestore" as FS

User -> App: Ingresar credenciales
App -> AuthService: signIn(email, password)
AuthService -> FBAuth: signInWithEmailAndPassword()
FBAuth -> FBAuth: Validar credenciales

alt Credenciales válidas
    FBAuth -> AuthService: Usuario autenticado
    AuthService -> FBAuth: Obtener token
    FBAuth -> AuthService: Token JWT
    AuthService -> FS: Obtener datos usuario
    FS -> AuthService: Datos usuario
    AuthService -> App: Usuario + datos
    App -> User: Mostrar dashboard
else Credenciales inválidas
    FBAuth -> AuthService: Error autenticación
    AuthService -> App: Error
    App -> User: Mostrar error
end

@enduml
```

## 7. Diagrama de Secuencia - Guardar Partida

```plantuml
@startuml Save_Game_Sequence
!theme plain
title Secuencia de Guardado de Partida

participant "Juego" as Game
participant "Partidas Service" as PartidasService
participant "Auth Service" as AuthService
participant "Firestore" as FS

Game -> Game: Detectar fin de partida
Game -> PartidasService: guardarPartida(resultado)
PartidasService -> AuthService: obtenerUsuarioActual()
AuthService -> PartidasService: Usuario autenticado

PartidasService -> PartidasService: Preparar datos partida
PartidasService -> FS: Crear documento partida
FS -> FS: Validar permisos
FS -> FS: Guardar documento

alt Guardado exitoso
    FS -> PartidasService: Documento creado
    PartidasService -> FS: Actualizar estadísticas usuario
    FS -> PartidasService: Estadísticas actualizadas
    PartidasService -> Game: Partida guardada
    Game -> Game: Mostrar confirmación
else Error al guardar
    FS -> PartidasService: Error
    PartidasService -> Game: Error guardado
    Game -> Game: Mostrar error
end

@enduml
```

Estos diagramas PlantUML proporcionan una documentación técnica completa y profesional de todos los casos de uso relacionados con Firebase en el proyecto, incluyendo autenticación, base de datos, almacenamiento y funcionalidades específicas del juego.