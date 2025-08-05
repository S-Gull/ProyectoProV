# Diagramas de Uso PlantUML - Juego Asalto al Fuerte

## 1. Diagrama General de Casos de Uso del Juego

```plantuml
@startuml
!theme plain
title Casos de Uso Generales - Asalto al Fuerte

left to right direction

actor "Jugador 1" as J1
actor "Jugador 2" as J2
actor "Sistema" as SYS
actor "Interfaz Usuario" as UI

package "Gestión de Partida" {
  usecase "Iniciar Nueva Partida" as UC1
  usecase "Seleccionar Equipo" as UC2
  usecase "Configurar Modo Juego" as UC3
  usecase "Autenticar Jugador 2" as UC4
  usecase "Reiniciar Partida" as UC5
}

package "Jugabilidad" {
  usecase "Seleccionar Pieza" as UC6
  usecase "Mostrar Movimientos Válidos" as UC7
  usecase "Mover Pieza" as UC8
  usecase "Capturar Pieza" as UC9
  usecase "Cambiar Turno" as UC10
  usecase "Verificar Victoria" as UC11
}

package "Interfaz y Ayuda" {
  usecase "Mostrar Reglas" as UC12
  usecase "Actualizar Estado Visual" as UC13
  usecase "Manejar Eventos Canvas" as UC14
  usecase "Mostrar Modal Resultado" as UC15
}

package "Persistencia" {
  usecase "Guardar Partida" as UC16
  usecase "Obtener Estadísticas" as UC17
  usecase "Actualizar Estadísticas" as UC18
}

J1 --> UC1
J1 --> UC2
J1 --> UC6
J1 --> UC8
J1 --> UC12
J1 --> UC5

J2 --> UC3
J2 --> UC4
J2 --> UC6
J2 --> UC8

SYS --> UC7
SYS --> UC9
SYS --> UC10
SYS --> UC11
SYS --> UC16
SYS --> UC17
SYS --> UC18

UI --> UC13
UI --> UC14
UI --> UC15

UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC3 ..> UC4 : <<extend>>
UC6 ..> UC7 : <<include>>
UC7 ..> UC8 : <<include>>
UC8 ..> UC9 : <<extend>>
UC8 ..> UC10 : <<include>>
UC10 ..> UC11 : <<include>>
UC11 ..> UC15 : <<extend>>
UC11 ..> UC16 : <<extend>>

@enduml
```

## 2. Diagrama de Casos de Uso - Configuración de Partida

```plantuml
@startuml
!theme plain
title Configuración de Partida - Asalto al Fuerte

left to right direction

actor "Jugador 1" as J1
actor "Jugador 2" as J2
actor "Sistema Autenticación" as AUTH

package "Configuración Inicial" {
  usecase "Mostrar Modal Selección Equipo" as UC1
  usecase "Seleccionar Atacantes" as UC2
  usecase "Seleccionar Defensores" as UC3
  usecase "Mostrar Modal Modo Juego" as UC4
  usecase "Modo Invitado" as UC5
  usecase "Modo Registrado" as UC6
  usecase "Mostrar Modal Login J2" as UC7
  usecase "Validar Credenciales" as UC8
  usecase "Configurar Equipos" as UC9
  usecase "Inicializar Tablero" as UC10
}

J1 --> UC1
UC1 --> UC2
UC1 --> UC3
UC2 --> UC4
UC3 --> UC4

UC4 --> UC5
UC4 --> UC6
UC6 --> UC7

J2 --> UC7
UC7 --> UC8
AUTH --> UC8

UC5 --> UC9
UC8 --> UC9
UC9 --> UC10

@enduml
```

## 3. Diagrama de Casos de Uso - Mecánicas de Juego

```plantuml
@startuml
!theme plain
title Mecánicas de Juego - Asalto al Fuerte

left to right direction

actor "Jugador Atacante" as JA
actor "Jugador Defensor" as JD
actor "Controlador Juego" as CTRL
actor "Sistema Reglas" as REGLAS

package "Turno Atacantes" {
  usecase "Seleccionar Soldado" as UC1
  usecase "Calcular Movimientos Soldado" as UC2
  usecase "Mover Hacia Adelante" as UC3
  usecase "Mover Lateral" as UC4
  usecase "Mover Diagonal en Fortaleza" as UC5
  usecase "Ocupar Casilla Fortaleza" as UC6
}

package "Turno Defensores" {
  usecase "Seleccionar Oficial" as UC7
  usecase "Calcular Movimientos Oficial" as UC8
  usecase "Movimiento Normal" as UC9
  usecase "Captura por Salto" as UC10
  usecase "Eliminar Soldado" as UC11
  usecase "Captura Múltiple" as UC12
}

package "Validaciones" {
  usecase "Validar Turno" as UC13
  usecase "Validar Movimiento" as UC14
  usecase "Verificar Casilla Válida" as UC15
  usecase "Verificar Casilla Ocupada" as UC16
}

JA --> UC1
UC1 --> UC2
UC2 --> UC3
UC2 --> UC4
UC2 --> UC5
UC3 --> UC6
UC4 --> UC6
UC5 --> UC6

JD --> UC7
UC7 --> UC8
UC8 --> UC9
UC8 --> UC10
UC10 --> UC11
UC10 --> UC12

CTRL --> UC13
CTRL --> UC14
CTRL --> UC15
CTRL --> UC16

REGLAS --> UC14
REGLAS --> UC15
REGLAS --> UC16

@enduml
```

## 4. Diagrama de Casos de Uso - Condiciones de Victoria

```plantuml
@startuml
!theme plain
title Condiciones de Victoria - Asalto al Fuerte

left to right direction

actor "Sistema" as SYS
actor "Verificador Reglas" as REGLAS
actor "Contador Piezas" as CONTADOR

package "Victoria Atacantes" {
  usecase "Verificar Ocupación Fortaleza" as UC1
  usecase "Contar Casillas Fortaleza Ocupadas" as UC2
  usecase "Verificar 9 Casillas Ocupadas" as UC3
  usecase "Verificar Oficiales Capturados" as UC4
  usecase "Contar Oficiales Restantes" as UC5
  usecase "Verificar 0 Oficiales" as UC6
}

package "Victoria Defensores" {
  usecase "Verificar Soldados Eliminados" as UC7
  usecase "Contar Soldados Restantes" as UC8
  usecase "Verificar Menos de 9 Soldados" as UC9
  usecase "Evaluar Capacidad Ataque" as UC10
}

package "Finalización" {
  usecase "Determinar Ganador" as UC11
  usecase "Mostrar Modal Victoria" as UC12
  usecase "Guardar Resultado" as UC13
  usecase "Actualizar Estadísticas" as UC14
}

SYS --> UC1
SYS --> UC4
SYS --> UC7

REGLAS --> UC1
REGLAS --> UC4
REGLAS --> UC7

UC1 --> UC2
UC2 --> UC3

UC4 --> UC5
UC5 --> UC6

UC7 --> UC8
UC8 --> UC9
UC9 --> UC10

CONTADOR --> UC2
CONTADOR --> UC5
CONTADOR --> UC8

UC3 --> UC11
UC6 --> UC11
UC9 --> UC11
UC10 --> UC11

UC11 --> UC12
UC12 --> UC13
UC13 --> UC14

@enduml
```

## 5. Diagrama de Casos de Uso - Interfaz de Usuario

```plantuml
@startuml
!theme plain
title Interfaz de Usuario - Asalto al Fuerte

left to right direction

actor "Usuario" as USER
actor "Canvas" as CANVAS
actor "Interfaz Usuario" as UI
actor "Sistema Modal" as MODAL

package "Interacción Canvas" {
  usecase "Manejar Click Canvas" as UC1
  usecase "Calcular Posición Casilla" as UC2
  usecase "Manejar Movimiento Ratón" as UC3
  usecase "Aplicar Hover Pieza" as UC4
  usecase "Resetear Hover" as UC5
}

package "Visualización" {
  usecase "Dibujar Estado Actual" as UC6
  usecase "Mostrar Piezas Seleccionadas" as UC7
  usecase "Mostrar Movimientos Válidos" as UC8
  usecase "Actualizar Turno Actual" as UC9
  usecase "Mostrar Información Jugadores" as UC10
}

package "Modales" {
  usecase "Mostrar Modal Reglas" as UC11
  usecase "Mostrar Modal Resultado" as UC12
  usecase "Mostrar Modal Selección" as UC13
  usecase "Mostrar Modal Login" as UC14
}

package "Controles" {
  usecase "Botón Nueva Partida" as UC15
  usecase "Botón Ayuda" as UC16
  usecase "Botón Regresar" as UC17
  usecase "Manejo Teclas" as UC18
}

USER --> UC1
USER --> UC3
USER --> UC15
USER --> UC16
USER --> UC17
USER --> UC18

CANVAS --> UC1
CANVAS --> UC2
CANVAS --> UC3

UC1 --> UC2
UC3 --> UC4
UC3 --> UC5

UI --> UC6
UI --> UC7
UI --> UC8
UI --> UC9
UI --> UC10

MODAL --> UC11
MODAL --> UC12
MODAL --> UC13
MODAL --> UC14

UC16 --> UC11
UC15 --> UC13

@enduml
```

## 6. Diagrama de Secuencia - Flujo Completo de Partida

```plantuml
@startuml
!theme plain
title Secuencia Completa de Partida - Asalto al Fuerte

participant "Jugador 1" as J1
participant "Jugador 2" as J2
participant "App" as APP
participant "ControladorJuego" as CTRL
participant "InterfazUsuario" as UI
participant "ReglasJuego" as REGLAS
participant "Firebase" as FB

J1 -> APP: Click "Nueva Partida"
APP -> UI: Mostrar Modal Selección Equipo
J1 -> UI: Seleccionar Equipo (Atacantes/Defensores)
UI -> APP: Equipo Seleccionado

APP -> UI: Mostrar Modal Modo Juego
J1 -> UI: Seleccionar Modo (Invitado/Registrado)

alt Modo Registrado
    UI -> J2: Mostrar Modal Login
    J2 -> FB: Credenciales
    FB -> APP: Usuario Autenticado
end

APP -> CTRL: Inicializar Juego
CTRL -> UI: Dibujar Tablero Inicial

loop Mientras Juego Activo
    alt Turno Atacantes
        J1 -> CTRL: Click en Soldado
        CTRL -> CTRL: Seleccionar Pieza
        CTRL -> UI: Mostrar Movimientos Válidos
        J1 -> CTRL: Click en Destino
        CTRL -> CTRL: Validar Movimiento
        CTRL -> CTRL: Mover Soldado
        CTRL -> UI: Actualizar Tablero
    else Turno Defensores
        J2 -> CTRL: Click en Oficial
        CTRL -> CTRL: Seleccionar Pieza
        CTRL -> CTRL: Calcular Capturas
        CTRL -> UI: Mostrar Movimientos/Capturas
        J2 -> CTRL: Click en Destino
        CTRL -> CTRL: Ejecutar Movimiento/Captura
        CTRL -> UI: Actualizar Tablero
    end
    
    CTRL -> REGLAS: Verificar Victoria
    REGLAS -> CTRL: Estado Juego
    
    alt Victoria Detectada
        CTRL -> UI: Mostrar Modal Resultado
        CTRL -> FB: Guardar Partida
        CTRL -> FB: Actualizar Estadísticas
    else Continuar Juego
        CTRL -> CTRL: Cambiar Turno
        CTRL -> UI: Actualizar Turno
    end
end

@enduml
```

## 7. Diagrama de Estados del Juego

```plantuml
@startuml
!theme plain
title Estados del Juego - Asalto al Fuerte

[*] --> Inicializando

Inicializando --> ConfigurandoEquipo : App cargada
ConfigurandoEquipo --> ConfigurandoModo : Equipo seleccionado
ConfigurandoModo --> ConfigurandoJugador2 : Modo registrado
ConfigurandoModo --> JuegoActivo : Modo invitado
ConfigurandoJugador2 --> JuegoActivo : Login exitoso

state JuegoActivo {
  [*] --> TurnoAtacantes
  
  state TurnoAtacantes {
    [*] --> EsperandoSeleccionSoldado
    EsperandoSeleccionSoldado --> SoldadoSeleccionado : Click soldado
    SoldadoSeleccionado --> MostrandoMovimientos : Soldado válido
    MostrandoMovimientos --> EsperandoMovimiento : Movimientos calculados
    EsperandoMovimiento --> ValidandoMovimiento : Click destino
    ValidandoMovimiento --> EsperandoSeleccionSoldado : Movimiento inválido
    ValidandoMovimiento --> EjecutandoMovimiento : Movimiento válido
    EjecutandoMovimiento --> VerificandoVictoria : Soldado movido
  }
  
  state TurnoDefensores {
    [*] --> EsperandoSeleccionOficial
    EsperandoSeleccionOficial --> OficialSeleccionado : Click oficial
    OficialSeleccionado --> CalculandoMovimientos : Oficial válido
    CalculandoMovimientos --> MostrandoCapturas : Capturas disponibles
    CalculandoMovimientos --> MostrandoMovimientosNormales : Sin capturas
    MostrandoCapturas --> EsperandoCaptura : Capturas mostradas
    MostrandoMovimientosNormales --> EsperandoMovimientoNormal : Movimientos mostrados
    EsperandoCaptura --> ValidandoCaptura : Click destino
    EsperandoMovimientoNormal --> ValidandoMovimientoNormal : Click destino
    ValidandoCaptura --> EjecutandoCaptura : Captura válida
    ValidandoMovimientoNormal --> EjecutandoMovimientoNormal : Movimiento válido
    EjecutandoCaptura --> EliminandoSoldado : Captura ejecutada
    EliminandoSoldado --> VerificandoVictoria : Soldado eliminado
    EjecutandoMovimientoNormal --> VerificandoVictoria : Oficial movido
  }
  
  TurnoAtacantes --> VerificandoVictoria : Movimiento completado
  VerificandoVictoria --> TurnoDefensores : Continuar juego
  VerificandoVictoria --> VictoriaAtacantes : Victoria detectada
  
  TurnoDefensores --> VerificandoVictoria : Movimiento completado
  VerificandoVictoria --> TurnoAtacantes : Continuar juego
  VerificandoVictoria --> VictoriaDefensores : Victoria detectada
}

JuegoActivo --> VictoriaAtacantes : Fortaleza ocupada/Oficiales capturados
JuegoActivo --> VictoriaDefensores : Soldados insuficientes

VictoriaAtacantes --> MostrandoResultado : Resultado calculado
VictoriaDefensores --> MostrandoResultado : Resultado calculado
MostrandoResultado --> GuardandoEstadisticas : Modal mostrado
GuardandoEstadisticas --> Finalizado : Datos guardados

Finalizado --> ConfigurandoEquipo : Reiniciar juego
Finalizado --> [*] : Salir

@enduml
```

## 8. Diagrama de Casos de Uso - Gestión de Datos

```plantuml
@startuml
!theme plain
title Gestión de Datos - Asalto al Fuerte

left to right direction

actor "Sistema" as SYS
actor "Firebase" as FB
actor "Autenticación" as AUTH
actor "Firestore" as FS

package "Autenticación" {
  usecase "Iniciar Sesión" as UC1
  usecase "Registrar Usuario" as UC2
  usecase "Cerrar Sesión" as UC3
  usecase "Validar Credenciales" as UC4
  usecase "Obtener Usuario Actual" as UC5
}

package "Gestión Partidas" {
  usecase "Guardar Partida" as UC6
  usecase "Obtener Estadísticas" as UC7
  usecase "Actualizar Estadísticas" as UC8
  usecase "Calcular Resultado" as UC9
  usecase "Determinar Tipo Victoria" as UC10
}

package "Persistencia" {
  usecase "Guardar en Firestore" as UC11
  usecase "Leer de Firestore" as UC12
  usecase "Actualizar Documento" as UC13
  usecase "Crear Documento" as UC14
}

SYS --> UC1
SYS --> UC2
SYS --> UC3
SYS --> UC6
SYS --> UC7
SYS --> UC8

AUTH --> UC1
AUTH --> UC2
AUTH --> UC3
AUTH --> UC4
AUTH --> UC5

UC6 --> UC9
UC6 --> UC10
UC7 --> UC12
UC8 --> UC13

FS --> UC11
FS --> UC12
FS --> UC13
FS --> UC14

FB --> AUTH
FB --> FS

@enduml
```

## 9. Diagrama de Casos de Uso - Estrategias de Movimiento

```plantuml
@startuml
!theme plain
title Estrategias de Movimiento - Asalto al Fuerte

left to right direction

actor "Soldado" as SOLDADO
actor "Oficial" as OFICIAL
actor "Validador" as VALIDADOR
actor "Tablero" as TABLERO

package "Movimiento Soldados" {
  usecase "Obtener Direcciones Base" as UC1
  usecase "Obtener Direcciones Diagonales" as UC2
  usecase "Calcular Movimientos" as UC3
  usecase "Validar Movimiento Soldado" as UC4
  usecase "Verificar Restricción Avance" as UC5
  usecase "Verificar Casilla Fortaleza" as UC6
}

package "Movimiento Oficiales" {
  usecase "Calcular Movimientos Normales" as UC7
  usecase "Calcular Capturas" as UC8
  usecase "Buscar Saltos Captura" as UC9
  usecase "Validar Salto" as UC10
  usecase "Captura Múltiple" as UC11
  usecase "Eliminar Pieza Capturada" as UC12
}

package "Validaciones Comunes" {
  usecase "Verificar Casilla Válida" as UC13
  usecase "Verificar Casilla Ocupada" as UC14
  usecase "Verificar Movimiento Diagonal" as UC15
  usecase "Obtener Direcciones" as UC16
}

SOLDADO --> UC1
SOLDADO --> UC2
SOLDADO --> UC3
SOLDADO --> UC4
SOLDADO --> UC5
SOLDADO --> UC6

OFICIAL --> UC7
OFICIAL --> UC8
OFICIAL --> UC9
OFICIAL --> UC10
OFICIAL --> UC11
OFICIAL --> UC12

VALIDADOR --> UC13
VALIDADOR --> UC14
VALIDADOR --> UC15
VALIDADOR --> UC16

TABLERO --> UC13
TABLERO --> UC14
TABLERO --> UC15
TABLERO --> UC6

UC3 ..> UC4 : <<include>>
UC4 ..> UC5 : <<include>>
UC4 ..> UC6 : <<include>>
UC8 ..> UC9 : <<include>>
UC9 ..> UC10 : <<include>>
UC10 ..> UC11 : <<extend>>
UC11 ..> UC12 : <<include>>

@enduml
```