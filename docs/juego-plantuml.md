# Diagramas de Casos de Uso del Juego Asalto al Fuerte - PlantUML

## 1. Diagrama General de Casos de Uso del Juego

```plantuml
@startuml Game_Use_Cases
!theme plain
title Casos de Uso - Juego Asalto al Fuerte

' Actores
actor "Jugador Atacante" as PA
actor "Jugador Defensor" as PD
actor "Sistema" as System
actor "Administrador Juego" as GameAdmin

' Paquetes de casos de uso
package "Configuración de Partida" {
  usecase "Iniciar Juego" as UC1
  usecase "Seleccionar Bando" as UC2
  usecase "Configurar Modo" as UC3
  usecase "Registrar Jugador 2" as UC4
  usecase "Mostrar Reglas" as UC5
  usecase "Colocar Piezas Iniciales" as UC6
}

package "Jugabilidad Atacantes" {
  usecase "Seleccionar Soldado" as UC7
  usecase "Mover Soldado" as UC8
  usecase "Avanzar hacia Fortaleza" as UC9
  usecase "Ocupar Casilla Fortaleza" as UC10
}

package "Jugabilidad Defensores" {
  usecase "Seleccionar Oficial" as UC11
  usecase "Mover Oficial" as UC12
  usecase "Capturar Soldado" as UC13
  usecase "Saltar sobre Soldados" as UC14
}

package "Validación y Control" {
  usecase "Validar Movimiento" as UC15
  usecase "Verificar Restricciones" as UC16
  usecase "Actualizar Tablero" as UC17
  usecase "Cambiar Turno" as UC18
  usecase "Detectar Victoria" as UC19
}

package "Gestión de Partida" {
  usecase "Finalizar Partida" as UC20
  usecase "Guardar Resultado" as UC21
  usecase "Mostrar Estadísticas" as UC22
  usecase "Reiniciar Juego" as UC23
}

package "Interfaz de Usuario" {
  usecase "Mostrar Tablero" as UC24
  usecase "Mostrar Loader" as UC25
  usecase "Gestionar Modales" as UC26
  usecase "Actualizar UI" as UC27
}

' Relaciones principales
PA --> UC1
PA --> UC2
PA --> UC3
PA --> UC4
PA --> UC5
PA --> UC7
PA --> UC8
PA --> UC9
PA --> UC10
PA --> UC23

PD --> UC2
PD --> UC11
PD --> UC12
PD --> UC13
PD --> UC14

System --> UC6
System --> UC15
System --> UC16
System --> UC17
System --> UC18
System --> UC19
System --> UC20
System --> UC24
System --> UC25
System --> UC26
System --> UC27

GameAdmin --> UC21
GameAdmin --> UC22

' Dependencias
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC3 ..> UC6 : <<include>>
UC6 ..> UC24 : <<include>>
UC4 ..> UC3 : <<extend>>
UC7 ..> UC15 : <<include>>
UC8 ..> UC16 : <<include>>
UC11 ..> UC15 : <<include>>
UC12 ..> UC16 : <<include>>
UC13 ..> UC17 : <<include>>
UC15 ..> UC17 : <<include>>
UC17 ..> UC18 : <<include>>
UC18 ..> UC19 : <<include>>
UC19 ..> UC20 : <<extend>>
UC20 ..> UC21 : <<include>>
UC21 ..> UC22 : <<extend>>

@enduml
```

## 2. Diagrama de Configuración de Partida

```plantuml
@startuml Game_Setup
!theme plain
title Configuración de Partida - Asalto al Fuerte

' Actores
actor "Jugador Atacante" as JA
actor "Jugador Defensor" as JD
actor "Sistema" as System
actor "Firebase" as FB

' Casos de uso de configuración
package "Inicialización" {
  usecase "Cargar Aplicación" as UC1
  usecase "Inicializar Tablero 7x7" as UC2
  usecase "Mostrar Pantalla Inicio" as UC3
  usecase "Configurar Eventos" as UC4
}

package "Selección de Bando" {
  usecase "Mostrar Opciones Bando" as UC5
  usecase "Seleccionar Atacantes" as UC6
  usecase "Seleccionar Defensores" as UC7
  usecase "Confirmar Selección" as UC8
}

package "Configuración Inicial" {
  usecase "Colocar 16 Soldados" as UC9
  usecase "Colocar 2 Oficiales" as UC10
  usecase "Definir Casillas Fortaleza" as UC11
  usecase "Establecer Restricciones" as UC12
}

package "Modo de Juego" {
  usecase "Mostrar Modos" as UC13
  usecase "Seleccionar 1 Jugador" as UC14
  usecase "Seleccionar 2 Jugadores" as UC15
  usecase "Configurar IA Defensiva" as UC16
  usecase "Configurar Jugador 2" as UC17
}

package "Configuración Jugador 2" {
  usecase "Solicitar Datos" as UC18
  usecase "Validar Email" as UC19
  usecase "Registrar Usuario" as UC20
  usecase "Autenticar Usuario" as UC21
}

' Relaciones
JA --> UC1
JA --> UC5
JA --> UC6
JA --> UC13
JA --> UC14
JA --> UC15
JA --> UC18

JD --> UC7

System --> UC2
System --> UC3
System --> UC4
System --> UC8
System --> UC9
System --> UC10
System --> UC11
System --> UC12
System --> UC16
System --> UC17
System --> UC19

FB --> UC20
FB --> UC21

' Flujos
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<include>>
UC6 ..> UC8 : <<include>>
UC7 ..> UC8 : <<include>>
UC8 ..> UC9 : <<include>>
UC9 ..> UC10 : <<include>>
UC10 ..> UC11 : <<include>>
UC11 ..> UC12 : <<include>>
UC12 ..> UC13 : <<include>>
UC14 ..> UC16 : <<include>>
UC15 ..> UC17 : <<include>>
UC17 ..> UC18 : <<include>>
UC18 ..> UC19 : <<include>>
UC19 ..> UC20 : <<extend>>
UC19 ..> UC21 : <<extend>>

@enduml
```

## 3. Diagrama de Jugabilidad Principal

```plantuml
@startuml Game_Play
!theme plain
title Jugabilidad Principal - Asalto al Fuerte

' Actores
actor "Jugador Atacante" as JA
actor "Jugador Defensor" as JD
actor "Sistema" as SYS

' Casos de uso de jugabilidad
package "Turno Atacantes" {
  usecase "Seleccionar Soldado" as UC1
  usecase "Mostrar Movimientos Válidos" as UC2
  usecase "Mover hacia Fortaleza" as UC3
  usecase "Ocupar Casilla" as UC4
  usecase "Verificar Restricción Avance" as UC5
}

package "Turno Defensores" {
  usecase "Seleccionar Oficial" as UC6
  usecase "Calcular Movimientos" as UC7
  usecase "Realizar Movimiento Normal" as UC8
  usecase "Capturar Soldado" as UC9
  usecase "Saltar sobre Soldados" as UC10
}

package "Validación de Movimientos" {
  usecase "Verificar Casilla Válida" as UC11
  usecase "Comprobar Ocupación" as UC12
  usecase "Validar Restricciones" as UC13
  usecase "Aplicar Reglas Especiales" as UC14
  usecase "Confirmar Movimiento" as UC15
}

package "Actualización de Estado" {
  usecase "Actualizar Posición Pieza" as UC16
  usecase "Eliminar Pieza Capturada" as UC17
  usecase "Renderizar Tablero" as UC18
  usecase "Actualizar Contadores" as UC19
  usecase "Verificar Condiciones Victoria" as UC20
}

package "Control de Flujo" {
  usecase "Cambiar Turno" as UC21
  usecase "Verificar Victoria Atacantes" as UC22
  usecase "Verificar Victoria Defensores" as UC23
  usecase "Continuar Partida" as UC24
}

' Relaciones
JA --> UC1
JA --> UC3
JA --> UC4

JD --> UC6
JD --> UC8
JD --> UC9
JD --> UC10

SYS --> UC2
SYS --> UC5
SYS --> UC7
SYS --> UC11
SYS --> UC12
SYS --> UC13
SYS --> UC14
SYS --> UC15
SYS --> UC16
SYS --> UC17
SYS --> UC18
SYS --> UC19
SYS --> UC20
SYS --> UC21
SYS --> UC22
SYS --> UC23
SYS --> UC24

' Flujos de validación
UC1 ..> UC11 : <<include>>
UC1 ..> UC2 : <<include>>
UC3 ..> UC13 : <<include>>
UC3 ..> UC5 : <<include>>
UC4 ..> UC15 : <<include>>
UC6 ..> UC11 : <<include>>
UC6 ..> UC7 : <<include>>
UC8 ..> UC13 : <<include>>
UC9 ..> UC14 : <<include>>
UC10 ..> UC14 : <<include>>
UC11 ..> UC12 : <<include>>
UC13 ..> UC15 : <<include>>
UC15 ..> UC16 : <<include>>
UC9 ..> UC17 : <<include>>
UC16 ..> UC18 : <<include>>
UC17 ..> UC18 : <<include>>
UC18 ..> UC19 : <<include>>
UC19 ..> UC20 : <<include>>
UC20 ..> UC22 : <<include>>
UC20 ..> UC23 : <<include>>
UC22 ..> UC21 : <<extend>>
UC23 ..> UC21 : <<extend>>
UC21 ..> UC24 : <<include>>

@enduml
```

## 4. Diagrama de Detección de Victoria

```plantuml
@startuml Win_Detection
!theme plain
title Detección de Victoria - Asalto al Fuerte

actor "Sistema" as SYS
actor "Verificador Reglas" as VR
actor "Contador Piezas" as CP

package "Victoria Atacantes" {
  usecase "Verificar Ocupación Fortaleza" as UC1
  usecase "Contar Casillas Fortaleza" as UC2
  usecase "Verificar 9 Casillas Ocupadas" as UC3
  usecase "Verificar Oficiales Capturados" as UC4
  usecase "Contar Oficiales Restantes" as UC5
}

package "Victoria Defensores" {
  usecase "Contar Soldados Restantes" as UC6
  usecase "Verificar Menos de 9 Soldados" as UC7
  usecase "Evaluar Capacidad Ataque" as UC8
  usecase "Verificar Imposibilidad Victoria" as UC9
}

package "Análisis de Estado" {
  usecase "Escanear Tablero" as UC10
  usecase "Identificar Piezas" as UC11
  usecase "Calcular Posiciones" as UC12
  usecase "Evaluar Condiciones" as UC13
}

package "Condiciones Específicas" {
  usecase "Fortaleza Completamente Ocupada" as UC14
  usecase "Ambos Oficiales Eliminados" as UC15
  usecase "Soldados Insuficientes" as UC16
  usecase "Imposibilidad de Avance" as UC17
}

package "Finalización" {
  usecase "Declarar Victoria Atacantes" as UC18
  usecase "Declarar Victoria Defensores" as UC19
  usecase "Mostrar Modal Resultado" as UC20
  usecase "Registrar Estadísticas" as UC21
  usecase "Bloquear Interacción" as UC22
}

SYS --> UC1
SYS --> UC4
SYS --> UC6
SYS --> UC10
SYS --> UC18
SYS --> UC19
SYS --> UC20
SYS --> UC21
SYS --> UC22

VR --> UC3
VR --> UC7
VR --> UC8
VR --> UC9
VR --> UC13
VR --> UC14
VR --> UC15
VR --> UC16
VR --> UC17

CP --> UC2
CP --> UC5
CP --> UC11
CP --> UC12

' Flujo de detección victoria atacantes
UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC3 ..> UC14 : <<extend>>
UC4 ..> UC5 : <<include>>
UC5 ..> UC15 : <<extend>>
UC14 ..> UC18 : <<include>>
UC15 ..> UC18 : <<include>>

' Flujo de detección victoria defensores
UC6 ..> UC7 : <<include>>
UC7 ..> UC16 : <<extend>>
UC8 ..> UC9 : <<include>>
UC9 ..> UC17 : <<extend>>
UC16 ..> UC19 : <<include>>
UC17 ..> UC19 : <<include>>

' Flujos comunes
UC10 ..> UC11 : <<include>>
UC11 ..> UC12 : <<include>>
UC12 ..> UC13 : <<include>>
UC18 ..> UC20 : <<include>>
UC19 ..> UC20 : <<include>>
UC20 ..> UC21 : <<include>>
UC21 ..> UC22 : <<include>>

@enduml
```

## 5. Diagrama de Gestión de Interfaz

```plantuml
@startuml UI_Management
!theme plain
title Gestión de Interfaz de Usuario - Asalto al Fuerte

' Actores
actor "Usuario" as User
actor "Sistema UI" as UISystem
actor "Modal Manager" as ModalMgr
actor "Loader" as Loader

' Casos de uso de interfaz
package "Gestión de Modales" {
  usecase "Mostrar Modal Reglas" as UC1
  usecase "Mostrar Modal Bandos" as UC2
  usecase "Mostrar Modal Modo" as UC3
  usecase "Mostrar Modal Jugador 2" as UC4
  usecase "Mostrar Modal Victoria" as UC5
  usecase "Cerrar Modal" as UC6
  usecase "Gestionar Overlay" as UC7
}

package "Gestión de Loader" {
  usecase "Mostrar Loader" as UC8
  usecase "Ocultar Loader" as UC9
  usecase "Actualizar Progreso" as UC10
}

package "Actualización Visual Tablero" {
  usecase "Renderizar Tablero 7x7" as UC11
  usecase "Dibujar Piezas" as UC12
  usecase "Resaltar Selección" as UC13
  usecase "Mostrar Movimientos Válidos" as UC14
  usecase "Actualizar Contadores" as UC15
}

package "Control de Turnos" {
  usecase "Indicar Turno Actual" as UC16
  usecase "Cambiar Indicador" as UC17
  usecase "Bloquear Piezas Oponente" as UC18
  usecase "Habilitar Piezas Propias" as UC19
}

package "Interacción Canvas" {
  usecase "Manejar Click Canvas" as UC20
  usecase "Calcular Posición Casilla" as UC21
  usecase "Procesar Selección Pieza" as UC22
  usecase "Procesar Movimiento" as UC23
  usecase "Proporcionar Feedback" as UC24
  usecase "Manejar Errores" as UC25
}

' Relaciones
User --> UC1
User --> UC20

UISystem --> UC2
UISystem --> UC3
UISystem --> UC4
UISystem --> UC5
UISystem --> UC11
UISystem --> UC12
UISystem --> UC13
UISystem --> UC14
UISystem --> UC15
UISystem --> UC16
UISystem --> UC17
UISystem --> UC18
UISystem --> UC19
UISystem --> UC21
UISystem --> UC22
UISystem --> UC23
UISystem --> UC24
UISystem --> UC25

ModalMgr --> UC6
ModalMgr --> UC7

Loader --> UC8
Loader --> UC9
Loader --> UC10

' Dependencias
UC2 ..> UC7 : <<include>>
UC3 ..> UC7 : <<include>>
UC4 ..> UC7 : <<include>>
UC5 ..> UC7 : <<include>>
UC6 ..> UC7 : <<include>>
UC8 ..> UC10 : <<extend>>
UC20 ..> UC21 : <<include>>
UC21 ..> UC22 : <<include>>
UC22 ..> UC23 : <<extend>>
UC22 ..> UC13 : <<include>>
UC23 ..> UC14 : <<include>>
UC23 ..> UC24 : <<extend>>
UC23 ..> UC25 : <<extend>>
UC11 ..> UC12 : <<include>>
UC17 ..> UC18 : <<include>>
UC17 ..> UC19 : <<include>>

@enduml
```

## 6. Diagrama de Secuencia - Flujo Completo de Partida

```plantuml
@startuml Complete_Game_Flow
!theme plain
title Flujo Completo de Partida - Asalto al Fuerte

participant "Jugador Atacante" as JA
participant "Jugador Defensor" as JD
participant "Interfaz" as UI
participant "Controlador" as CTRL
participant "Tablero" as BOARD
participant "Validador" as VAL
participant "Reglas" as RULES
participant "Firebase" as FB

JA -> UI: Iniciar juego
UI -> CTRL: Cargar aplicación
CTRL -> BOARD: Inicializar tablero 7x7
CTRL -> BOARD: Colocar 16 soldados
CTRL -> BOARD: Colocar 2 oficiales
CTRL -> BOARD: Definir casillas fortaleza
CTRL -> UI: Mostrar loader
UI -> JA: Mostrar modal bandos
JA -> UI: Seleccionar atacantes
UI -> CTRL: Confirmar selección
CTRL -> UI: Mostrar modal modo
JA -> UI: Seleccionar modo (1/2 jugadores)

alt Modo 2 jugadores
    UI -> JD: Mostrar login
    JD -> FB: Autenticar
    FB -> UI: Confirmar autenticación
    UI -> JD: Asignar defensores
else Modo 1 jugador
    CTRL -> CTRL: Configurar IA defensiva
end

CTRL -> UI: Ocultar loader
UI -> JA: Mostrar tablero con piezas
UI -> JA: Indicar turno atacantes

loop Mientras juego activo
    alt Turno Atacantes
        JA -> UI: Click en soldado
        UI -> CTRL: Seleccionar soldado
        CTRL -> VAL: Validar selección
        VAL -> CTRL: Soldado válido
        CTRL -> UI: Resaltar soldado
        CTRL -> VAL: Calcular movimientos válidos
        VAL -> RULES: Aplicar restricciones avance
        RULES -> VAL: Movimientos permitidos
        VAL -> UI: Mostrar indicadores
        
        JA -> UI: Click en casilla destino
        UI -> CTRL: Procesar movimiento
        CTRL -> VAL: Validar movimiento
        VAL -> BOARD: Verificar casilla libre
        VAL -> RULES: Verificar restricciones
        RULES -> VAL: Movimiento válido
        VAL -> CTRL: Confirmar movimiento
        CTRL -> BOARD: Mover soldado
        BOARD -> UI: Actualizar renderizado
        CTRL -> RULES: Verificar victoria atacantes
        
        alt Victoria atacantes (fortaleza ocupada)
            RULES -> CTRL: Victoria por ocupación
            CTRL -> UI: Mostrar modal victoria
            CTRL -> FB: Guardar estadísticas
            break
        else Victoria atacantes (oficiales capturados)
            RULES -> CTRL: Victoria por captura
            CTRL -> UI: Mostrar modal victoria
            CTRL -> FB: Guardar estadísticas
            break
        else Continuar
            CTRL -> CTRL: Cambiar turno a defensores
            UI -> JD: Indicar turno defensores
        end
        
    else Turno Defensores
        alt Jugador Defensor
            JD -> UI: Click en oficial
        else IA Defensiva
            CTRL -> CTRL: Calcular movimiento IA
        end
        
        UI -> CTRL: Seleccionar oficial
        CTRL -> VAL: Validar selección
        VAL -> CTRL: Oficial válido
        CTRL -> UI: Resaltar oficial
        CTRL -> VAL: Calcular movimientos/capturas
        VAL -> RULES: Verificar capturas disponibles
        
        alt Capturas disponibles
            RULES -> VAL: Movimientos de captura
            VAL -> UI: Mostrar capturas obligatorias
        else Sin capturas
            RULES -> VAL: Movimientos normales
            VAL -> UI: Mostrar movimientos
        end
        
        alt Jugador Defensor
            JD -> UI: Click en casilla destino
        else IA
            CTRL -> UI: Ejecutar movimiento IA
        end
        
        UI -> CTRL: Procesar movimiento
        CTRL -> VAL: Validar movimiento
        VAL -> RULES: Aplicar reglas captura
        
        alt Movimiento con captura
            RULES -> BOARD: Eliminar soldado capturado
            BOARD -> CTRL: Soldado eliminado
            CTRL -> UI: Actualizar contadores
        end
        
        RULES -> BOARD: Mover oficial
        BOARD -> UI: Actualizar renderizado
        CTRL -> RULES: Verificar victoria defensores
        
        alt Victoria defensores (soldados insuficientes)
            RULES -> CTRL: Victoria por eliminación
            CTRL -> UI: Mostrar modal victoria
            CTRL -> FB: Guardar estadísticas
            break
        else Continuar
            CTRL -> CTRL: Cambiar turno a atacantes
            UI -> JA: Indicar turno atacantes
        end
    end
end

JA -> UI: Reiniciar juego (opcional)
UI -> CTRL: Nueva partida
CTRL -> BOARD: Reinicializar tablero
CTRL -> BOARD: Recolocar piezas iniciales
CTRL -> CTRL: Reiniciar estado

@enduml
```

## 7. Diagrama de Estados del Juego

```plantuml
@startuml Game_States
!theme plain
title Estados del Juego - Asalto al Fuerte

[*] --> Inicializando

Inicializando --> ConfigurandoBando : Carga completa
ConfigurandoBando --> ConfigurandoModo : Bando seleccionado
ConfigurandoModo --> ConfigurandoJugador2 : Modo 2 jugadores
ConfigurandoModo --> JuegoActivo : Modo 1 jugador
ConfigurandoJugador2 --> JuegoActivo : Autenticación exitosa

state JuegoActivo {
  [*] --> TurnoAtacantes
  
  state TurnoAtacantes {
    [*] --> EsperandoSeleccionSoldado
    EsperandoSeleccionSoldado --> SoldadoSeleccionado : Click en soldado
    SoldadoSeleccionado --> MostrandoMovimientos : Soldado válido
    MostrandoMovimientos --> EsperandoMovimiento : Movimientos calculados
    EsperandoMovimiento --> ValidandoMovimientoAtacante : Click en destino
    ValidandoMovimientoAtacante --> EsperandoSeleccionSoldado : Movimiento inválido
    ValidandoMovimientoAtacante --> EjecutandoMovimientoAtacante : Movimiento válido
    EjecutandoMovimientoAtacante --> VerificandoVictoriaAtacantes : Soldado movido
  }
  
  state TurnoDefensores {
    [*] --> EsperandoSeleccionOficial
    EsperandoSeleccionOficial --> OficialSeleccionado : Click en oficial
    OficialSeleccionado --> CalculandoMovimientos : Oficial válido
    CalculandoMovimientos --> VerificandoCapturas : Movimientos calculados
    VerificandoCapturas --> MostrandoCapturas : Capturas disponibles
    VerificandoCapturas --> MostrandoMovimientosNormales : Sin capturas
    MostrandoCapturas --> EsperandoCaptura : Capturas mostradas
    MostrandoMovimientosNormales --> EsperandoMovimientoNormal : Movimientos mostrados
    EsperandoCaptura --> ValidandoCaptura : Click en destino
    EsperandoMovimientoNormal --> ValidandoMovimientoDefensor : Click en destino
    ValidandoCaptura --> EsperandoSeleccionOficial : Captura inválida
    ValidandoMovimientoDefensor --> EsperandoSeleccionOficial : Movimiento inválido
    ValidandoCaptura --> EjecutandoCaptura : Captura válida
    ValidandoMovimientoDefensor --> EjecutandoMovimientoDefensor : Movimiento válido
    EjecutandoCaptura --> EliminandoSoldado : Captura ejecutada
    EliminandoSoldado --> VerificandoVictoriaDefensores : Soldado eliminado
    EjecutandoMovimientoDefensor --> VerificandoVictoriaDefensores : Oficial movido
  }
  
  TurnoAtacantes --> VerificandoVictoriaAtacantes : Movimiento completado
  VerificandoVictoriaAtacantes --> TurnoDefensores : Continuar juego
  VerificandoVictoriaAtacantes --> VictoriaAtacantes : Victoria detectada
  
  TurnoDefensores --> VerificandoVictoriaDefensores : Movimiento completado
  VerificandoVictoriaDefensores --> TurnoAtacantes : Continuar juego
  VerificandoVictoriaDefensores --> VictoriaDefensores : Victoria detectada
}

JuegoActivo --> VictoriaAtacantes : Fortaleza ocupada / Oficiales capturados
JuegoActivo --> VictoriaDefensores : Soldados insuficientes

VictoriaAtacantes --> MostrandoResultado : Resultado calculado
VictoriaDefensores --> MostrandoResultado : Resultado calculado
MostrandoResultado --> GuardandoEstadisticas : Modal mostrado
GuardandoEstadisticas --> Finalizado : Datos guardados

Finalizado --> Inicializando : Reiniciar juego
Finalizado --> [*] : Salir

state VerificandoVictoriaAtacantes {
  [*] --> ContandoCasillasFortaleza
  ContandoCasillasFortaleza --> VerificandoOcupacionCompleta
  VerificandoOcupacionCompleta --> ContandoOficiales
  ContandoOficiales --> VerificandoOficialesEliminados
  VerificandoOficialesEliminados --> [*]
}

state VerificandoVictoriaDefensores {
  [*] --> ContandoSoldados
  ContandoSoldados --> VerificandoSoldadosInsuficientes
  VerificandoSoldadosInsuficientes --> EvaluandoCapacidadAtaque
  EvaluandoCapacidadAtaque --> [*]
}

@enduml
```

Estos diagramas PlantUML proporcionan una documentación completa y profesional de todos los aspectos del juego, desde la configuración inicial hasta la finalización de la partida, incluyendo la gestión de la interfaz de usuario y los diferentes estados del sistema.