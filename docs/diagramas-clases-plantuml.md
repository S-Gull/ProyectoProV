# Diagramas de Clases PlantUML - Juego Asalto al Fuerte

## 1. Diagrama de Clases Principal del Juego

```plantuml
@startuml
!theme plain
title Diagrama de Clases Principal - Asalto al Fuerte

package "Controlador Principal" {
  class ControladorJuego_ahga {
    - canvasJuego_ahga: HTMLCanvasElement
    - contextoJuego_ahga: CanvasRenderingContext2D
    - tableroPartida_ahga: TableroJuego_ahga
    - estadoJuego_ahga: EstadoJuego_ahga
    - interfazUsuario_ahga: InterfazUsuario_ahga
    - callbackResultado_ahga: Function
    
    + constructor(canvas_ahga: HTMLCanvasElement)
    + establecerCallbackResultado(callback: Function): void
    + configurarEventos_ahga(): void
    + inicializarJuego_ahga(): void
    + manejarClicCanvas_ahga(evento_ahga: MouseEvent): void
    + obtenerPosicionCasilla_ahga(evento_ahga: MouseEvent): Object
    + intentarMoverPieza_ahga(fila_ahga: number, columna_ahga: number): void
    + realizarMovimiento_ahga(fila_ahga: number, columna_ahga: number): void
    + intentarSeleccionarPieza_ahga(casilla_ahga: Object): void
    + esTurnoValido_ahga(pieza_ahga: PiezaBase_ahga): boolean
    + seleccionarPieza_ahga(pieza_ahga: PiezaBase_ahga): void
    + deseleccionarPieza_ahga(): void
    + manejarMovimientoRaton_ahga(evento_ahga: MouseEvent): void
    + verificarEstadoJuego_ahga(): void
    + mostrarResultado_ahga(mensaje_ahga: string): void
    + dibujarEstadoActual_ahga(): void
    + reiniciarPartida_ahga(): void
  }
}

package "Estado del Juego" {
  class EstadoJuego_ahga {
    - turnoActual_ahga: string
    - juegoActivo_ahga: boolean
    - piezaSeleccionada_ahga: PiezaBase_ahga
    - movimientosPermitidos_ahga: Array
    
    + constructor()
    + cambiarTurno_ahga(): void
    + reiniciar_ahga(): void
  }
}

package "Interfaz de Usuario" {
  class InterfazUsuario_ahga {
    - elementoTurno_ahga: HTMLElement
    
    + constructor()
    + actualizarTurno_ahga(turno_ahga: string): void
    + mostrarModalResultado_ahga(mensaje_ahga: string): HTMLElement
  }
}

package "Reglas del Juego" {
  class ReglasJuego_ahga <<static>> {
    + {static} verificarVictoria_ahga(tablero_ahga: TableroBase_ahga): string
    + {static} verificarVictoriaAtacantes_ahga(tablero_ahga: TableroBase_ahga): boolean
    + {static} verificarVictoriaDefensores_ahga(tablero_ahga: TableroBase_ahga): boolean
    + {static} verificarOficialesCapturados_ahga(tablero_ahga: TableroBase_ahga): boolean
  }
}

ControladorJuego_ahga *-- EstadoJuego_ahga
ControladorJuego_ahga *-- InterfazUsuario_ahga
ControladorJuego_ahga ..> ReglasJuego_ahga : uses
ControladorJuego_ahga *-- TableroJuego_ahga

@enduml
```

## 2. Diagrama de Clases - Jerarquía de Piezas

```plantuml
@startuml
!theme plain
title Jerarquía de Piezas - Asalto al Fuerte

package "Piezas Base" {
  abstract class PiezaBase_ahga {
    # tipoPieza_ahga: string
    # filaPosicion_ahga: number
    # columnaPosicion_ahga: number
    # estaSeleccionada_ahga: boolean
    # estaSobre_ahga: boolean
    
    + constructor(tipoPieza_ahga: string, filaPosicion_ahga: number, columnaPosicion_ahga: number)
    + moverA_ahga(nuevaFila_ahga: number, nuevaColumna_ahga: number): void
    + {abstract} calcularMovimientosValidos_ahga(tableroJuego_ahga: TableroBase_ahga): Array
  }
}

package "Piezas Concretas" {
  class Soldado_ahga {
    - estrategiaMovimiento_ahga: EstrategiaMovimientoSoldado_ahga
    
    + constructor(filaPosicion_ahga: number, columnaPosicion_ahga: number)
    + calcularMovimientosValidos_ahga(tableroJuego_ahga: TableroBase_ahga): Array
  }
  
  class Oficial_ahga {
    - estrategiaMovimiento_ahga: EstrategiaMovimientoOficial_ahga
    
    + constructor(filaPosicion_ahga: number, columnaPosicion_ahga: number)
    + calcularMovimientosValidos_ahga(tableroJuego_ahga: TableroBase_ahga): Array
  }
}

package "Estrategias de Movimiento" {
  class EstrategiaMovimientoSoldado_ahga {
    - pieza_ahga: PiezaBase_ahga
    - tablero_ahga: TableroBase_ahga
    
    + constructor(pieza_ahga: PiezaBase_ahga, tablero_ahga: TableroBase_ahga)
    + obtenerDireccionesBase_ahga(): Array
    + obtenerDireccionesDiagonales_ahga(): Array
    + calcularMovimientos_ahga(): Array
    + esMovimientoValido_ahga(fila_ahga: number, columna_ahga: number, deltaFila_ahga: number): boolean
  }
  
  class EstrategiaMovimientoOficial_ahga {
    - pieza_ahga: PiezaBase_ahga
    - tablero_ahga: TableroBase_ahga
    
    + constructor(pieza_ahga: PiezaBase_ahga, tablero_ahga: TableroBase_ahga)
    + calcularMovimientos_ahga(): Array
    + calcularMovimientosNormales_ahga(): Array
    + calcularCapturas_ahga(): Array
    + obtenerDirecciones_ahga(): Array
    + buscarSaltosCaptura_ahga(filaActual_ahga: number, columnaActual_ahga: number, visitadas_ahga: Set, capturadas_ahga: Array, resultado_ahga: Array): void
    + esSaltoValido_ahga(filaIntermedia_ahga: number, columnaIntermedia_ahga: number, filaDestino_ahga: number, columnaDestino_ahga: number, visitadas_ahga: Set, capturadas_ahga: Array): boolean
  }
}

package "Validador" {
  class ValidadorMovimiento_ahga <<static>> {
    + {static} esCasillaValida_ahga(tablero_ahga: TableroBase_ahga, fila_ahga: number, columna_ahga: number): boolean
    + {static} esCasillaOcupada_ahga(tablero_ahga: TableroBase_ahga, fila_ahga: number, columna_ahga: number): boolean
    + {static} puedeMoverDiagonal_ahga(tablero_ahga: TableroBase_ahga, fila_ahga: number, columna_ahga: number): boolean
  }
}

package "Factory" {
  class PiezaFactory_ahga <<static>> {
    + {static} crearPieza_ahga(tipo_ahga: string, fila_ahga: number, columna_ahga: number): PiezaBase_ahga
  }
}

PiezaBase_ahga <|-- Soldado_ahga
PiezaBase_ahga <|-- Oficial_ahga

Soldado_ahga *-- EstrategiaMovimientoSoldado_ahga
Oficial_ahga *-- EstrategiaMovimientoOficial_ahga

EstrategiaMovimientoSoldado_ahga ..> ValidadorMovimiento_ahga : uses
EstrategiaMovimientoOficial_ahga ..> ValidadorMovimiento_ahga : uses

PiezaFactory_ahga ..> Soldado_ahga : creates
PiezaFactory_ahga ..> Oficial_ahga : creates

@enduml
```

## 3. Diagrama de Clases - Sistema de Tablero

```plantuml
@startuml
!theme plain
title Sistema de Tablero - Asalto al Fuerte

package "Tablero Base" {
  abstract class TableroBase_ahga {
    # filasTotales_ahga: number
    # columnasTotales_ahga: number
    # casillasJuego_ahga: Array
    
    + constructor(filas_ahga: number, columnas_ahga: number)
    + {abstract} inicializarEstructura_ahga(): void
    + obtenerCasilla_ahga(fila_ahga: number, columna_ahga: number): Object
    + esCasillaValida_ahga(fila_ahga: number, columna_ahga: number): boolean
    + esCasillaFortaleza_ahga(fila_ahga: number, columna_ahga: number): boolean
  }
}

package "Tablero Concreto" {
  class TableroJuego_ahga {
    - anchoCanvas_ahga: number
    - altoCanvas_ahga: number
    - tamanoCasilla_ahga: number
    - renderizador_ahga: RenderizadorTablero_ahga
    - puntosDiagonales_ahga: Set
    
    + constructor(anchoCanvas_ahga: number, altoCanvas_ahga: number)
    + calcularTamanoCasilla_ahga(): number
    + inicializarEstructura_ahga(): void
    + colocarPiezasIniciales_ahga(): void
    + colocarOficiales_ahga(): void
    + colocarSoldados_ahga(): void
    + puedeMoverseDiagonal_ahga(fila_ahga: number, columna_ahga: number): boolean
    + dibujarTablero_ahga(contexto_ahga: CanvasRenderingContext2D, movimientosPosibles_ahga: Array): void
    + reiniciar_ahga(): void
  }
}

package "Renderizado" {
  class RenderizadorTablero_ahga {
    - tablero_ahga: TableroBase_ahga
    
    + constructor(tablero_ahga: TableroBase_ahga)
    + dibujar_ahga(contexto_ahga: CanvasRenderingContext2D, movimientosPosibles_ahga: Array): void
    + dibujarCasilla_ahga(contexto_ahga: CanvasRenderingContext2D, fila_ahga: number, col_ahga: number, movimientosPosibles_ahga: Array): void
    + dibujarFondoCasilla_ahga(contexto_ahga: CanvasRenderingContext2D, casilla_ahga: Object, fila_ahga: number, col_ahga: number): void
    + dibujarIndicadorMovimiento_ahga(contexto_ahga: CanvasRenderingContext2D, fila_ahga: number, col_ahga: number): void
    + dibujarPieza_ahga(contexto_ahga: CanvasRenderingContext2D, pieza_ahga: PiezaBase_ahga, fila_ahga: number, col_ahga: number): void
    + dibujarSeleccion_ahga(contexto_ahga: CanvasRenderingContext2D, pieza_ahga: PiezaBase_ahga, x_ahga: number, y_ahga: number, radio_ahga: number): void
    + dibujarCuerpo_ahga(contexto_ahga: CanvasRenderingContext2D, pieza_ahga: PiezaBase_ahga, x_ahga: number, y_ahga: number, radio_ahga: number): void
    + esMovimientoPosible_ahga(movimientosPosibles_ahga: Array, fila_ahga: number, col_ahga: number): boolean
  }
}

TableroBase_ahga <|-- TableroJuego_ahga
TableroJuego_ahga *-- RenderizadorTablero_ahga
TableroJuego_ahga ..> PiezaFactory_ahga : uses

@enduml
```

## 4. Diagrama de Clases - Aplicación Principal

```plantuml
@startuml
!theme plain
title Aplicación Principal - Asalto al Fuerte

package "Aplicación Principal" {
  class App_ahga {
    - canvas_ahga: HTMLCanvasElement
    - btnAyuda_ahga: HTMLElement
    - ui_ahga: UIHandler_ahga
    - juego_ahga: ControladorJuego_ahga
    - usuarioActual: Object
    - jugador2: Object
    - equipoJugador1: string
    - equipoJugador2: string
    - modoJuego: string
    - tiempoInicioPartida_ahga: Date
    - modal: ModalDialog_ahga
    
    + constructor()
    + inicializar_ahga(): void
    + configurarEventos_ahga(): void
    + mostrarModalSeleccionEquipo_ahga(): void
    + mostrarModalModoJuego_ahga(): void
    + mostrarModalLoginJugador2_ahga(): void
    + iniciarJuego_ahga(): void
    + manejarResultadoPartida_ahga(ganador: string, equipoGanador: string, tipoVictoria: string): void
    + calcularDuracionPartida_ahga(): number
    + reiniciarJuego_ahga(): void
  }
}

package "Interfaz de Usuario" {
  class UIHandler_ahga {
    - contadorSoldados_ahga: HTMLElement
    - contadorOficiales_ahga: HTMLElement
    
    + constructor()
    + actualizarEstadisticas_ahga(cantSoldados: number, cantOficiales: number): void
    + mostrarReglas_ahga(): void
  }
}

package "Modal" {
  class ModalDialog_ahga {
    + mostrar(titulo: string, contenido: string, opciones: Object): Promise
    + cerrar(): void
    + crearModal(config: Object): HTMLElement
  }
}

App_ahga *-- UIHandler_ahga
App_ahga *-- ControladorJuego_ahga
App_ahga *-- ModalDialog_ahga

@enduml
```

## 5. Diagrama de Clases - Servicios Firebase

```plantuml
@startuml
!theme plain
title Servicios Firebase - Asalto al Fuerte

package "Servicios de Autenticación" {
  class AuthService_ahga <<static>> {
    + {static} registrarUsuario_ahga(email_ahga: string, password_ahga: string, additionalData_ahga: Object): Promise
    + {static} verificarUsuarioActual_ahga(): Object
    + {static} validarCredenciales_ahga(email_ahga: string, password_ahga: string): Promise
    + {static} iniciarSesion_ahga(email_ahga: string, password_ahga: string): Promise
    + {static} cerrarSesion_ahga(): Promise
    + {static} cambiarPassword_ahga(passwordActual_ahga: string, passwordNuevo_ahga: string): Promise
    - {static} generarCodigoCupon_ahga(longitud_ahga: number): string
    - {static} crearCuponBienvenida_ahga(userId_ahga: string): Promise
  }
}

package "Servicios de Partidas" {
  class PartidasService_ahga <<static>> {
    + {static} guardarPartida_ahga(datosPartida_ahga: Object): Promise
    + {static} obtenerHistorialPartidas_ahga(jugadorId_ahga: string, limite_ahga: number): Promise
    + {static} obtenerEstadisticasJugador_ahga(jugadorId_ahga: string): Promise
    + {static} obtenerRankingJugadores_ahga(limite_ahga: number): Promise
    - {static} actualizarEstadisticasJugador_ahga(jugadorId_ahga: string, datosPartida_ahga: Object): Promise
  }
}

package "Servicios de Firestore" {
  class FirestoreService_ahga <<static>> {
    + {static} obtenerUsuario_ahga(userId_ahga: string): Promise
    + {static} actualizarUsuario_ahga(userId_ahga: string, datos_ahga: Object): Promise
    + {static} validarCredencialesFirestore_ahga(email_ahga: string, password_ahga: string): Promise
    + {static} obtenerDocumento_ahga(coleccion_ahga: string, documentoId_ahga: string): Promise
    + {static} guardarDocumento_ahga(coleccion_ahga: string, documentoId_ahga: string, datos_ahga: Object): Promise
  }
}

package "Utilidades" {
  class ErrorHandler_ahga <<static>> {
    + {static} createFriendlyError_ahga(error_ahga: Error, mensaje_ahga: string): Error
    + {static} manejarErrorFirebase_ahga(error_ahga: Error): string
  }
  
  class Validators_ahga <<static>> {
    + {static} validarEmail_ahga(email_ahga: string): boolean
    + {static} validarPassword_ahga(password_ahga: string): Object
    + {static} validarNombre_ahga(nombre_ahga: string): boolean
  }
}

AuthService_ahga ..> ErrorHandler_ahga : uses
PartidasService_ahga ..> ErrorHandler_ahga : uses
FirestoreService_ahga ..> ErrorHandler_ahga : uses

AuthService_ahga ..> Validators_ahga : uses

@enduml
```

## 6. Diagrama de Clases Completo - Vista General

```plantuml
@startuml
!theme plain
title Diagrama de Clases Completo - Asalto al Fuerte

package "Capa de Presentación" {
  class App_ahga {
    - canvas_ahga: HTMLCanvasElement
    - ui_ahga: UIHandler_ahga
    - juego_ahga: ControladorJuego_ahga
    - modal: ModalDialog_ahga
  }
  
  class UIHandler_ahga {
    + actualizarEstadisticas_ahga(): void
    + mostrarReglas_ahga(): void
  }
  
  class ModalDialog_ahga {
    + mostrar(): Promise
    + cerrar(): void
  }
}

package "Capa de Lógica de Juego" {
  class ControladorJuego_ahga {
    - tableroPartida_ahga: TableroJuego_ahga
    - estadoJuego_ahga: EstadoJuego_ahga
    - interfazUsuario_ahga: InterfazUsuario_ahga
  }
  
  class EstadoJuego_ahga {
    - turnoActual_ahga: string
    - juegoActivo_ahga: boolean
    - piezaSeleccionada_ahga: PiezaBase_ahga
  }
  
  class ReglasJuego_ahga <<static>> {
    + {static} verificarVictoria_ahga(): string
  }
}

package "Capa de Modelo" {
  abstract class PiezaBase_ahga {
    # tipoPieza_ahga: string
    # filaPosicion_ahga: number
    # columnaPosicion_ahga: number
  }
  
  class Soldado_ahga {
    - estrategiaMovimiento_ahga: EstrategiaMovimientoSoldado_ahga
  }
  
  class Oficial_ahga {
    - estrategiaMovimiento_ahga: EstrategiaMovimientoOficial_ahga
  }
  
  abstract class TableroBase_ahga {
    # casillasJuego_ahga: Array
  }
  
  class TableroJuego_ahga {
    - renderizador_ahga: RenderizadorTablero_ahga
  }
}

package "Capa de Servicios" {
  class AuthService_ahga <<static>> {
    + {static} iniciarSesion_ahga(): Promise
    + {static} registrarUsuario_ahga(): Promise
  }
  
  class PartidasService_ahga <<static>> {
    + {static} guardarPartida_ahga(): Promise
    + {static} obtenerEstadisticas_ahga(): Promise
  }
  
  class FirestoreService_ahga <<static>> {
    + {static} obtenerUsuario_ahga(): Promise
    + {static} actualizarUsuario_ahga(): Promise
  }
}

package "Capa de Estrategias" {
  class EstrategiaMovimientoSoldado_ahga {
    + calcularMovimientos_ahga(): Array
  }
  
  class EstrategiaMovimientoOficial_ahga {
    + calcularMovimientos_ahga(): Array
    + calcularCapturas_ahga(): Array
  }
}

package "Capa de Renderizado" {
  class RenderizadorTablero_ahga {
    + dibujar_ahga(): void
    + dibujarPieza_ahga(): void
  }
}

' Relaciones principales
App_ahga *-- UIHandler_ahga
App_ahga *-- ControladorJuego_ahga
App_ahga *-- ModalDialog_ahga

ControladorJuego_ahga *-- EstadoJuego_ahga
ControladorJuego_ahga *-- TableroJuego_ahga
ControladorJuego_ahga ..> ReglasJuego_ahga

PiezaBase_ahga <|-- Soldado_ahga
PiezaBase_ahga <|-- Oficial_ahga
TableroBase_ahga <|-- TableroJuego_ahga

Soldado_ahga *-- EstrategiaMovimientoSoldado_ahga
Oficial_ahga *-- EstrategiaMovimientoOficial_ahga
TableroJuego_ahga *-- RenderizadorTablero_ahga

App_ahga ..> AuthService_ahga
App_ahga ..> PartidasService_ahga
App_ahga ..> FirestoreService_ahga

@enduml
```

## 7. Diagrama de Clases - Patrones de Diseño

```plantuml
@startuml
!theme plain
title Patrones de Diseño - Asalto al Fuerte

package "Patrón Strategy" {
  interface EstrategiaMovimiento {
    + calcularMovimientos(): Array
  }
  
  class EstrategiaMovimientoSoldado_ahga {
    + calcularMovimientos(): Array
  }
  
  class EstrategiaMovimientoOficial_ahga {
    + calcularMovimientos(): Array
  }
  
  class ContextoPieza {
    - estrategia: EstrategiaMovimiento
    + setEstrategia(estrategia: EstrategiaMovimiento): void
    + ejecutarMovimiento(): Array
  }
}

package "Patrón Factory" {
  class PiezaFactory_ahga <<Factory>> {
    + {static} crearPieza_ahga(tipo: string, fila: number, columna: number): PiezaBase_ahga
  }
}

package "Patrón Template Method" {
  abstract class TableroBase_ahga {
    + constructor(filas: number, columnas: number)
    + {abstract} inicializarEstructura_ahga(): void
    + obtenerCasilla_ahga(fila: number, columna: number): Object
  }
  
  class TableroJuego_ahga {
    + inicializarEstructura_ahga(): void
  }
}

package "Patrón Observer" {
  interface Observer {
    + actualizar(evento: string, datos: Object): void
  }
  
  class EstadoJuego_ahga {
    - observadores: Array<Observer>
    + agregarObservador(observer: Observer): void
    + notificarObservadores(evento: string, datos: Object): void
  }
  
  class InterfazUsuario_ahga {
    + actualizar(evento: string, datos: Object): void
  }
}

package "Patrón Singleton" {
  class ConfiguracionJuego_ahga <<Singleton>> {
    - {static} instancia: ConfiguracionJuego_ahga
    - configuracion: Object
    
    - constructor()
    + {static} obtenerInstancia(): ConfiguracionJuego_ahga
    + obtenerConfiguracion(clave: string): any
    + establecerConfiguracion(clave: string, valor: any): void
  }
}

' Relaciones de patrones
EstrategiaMovimiento <|.. EstrategiaMovimientoSoldado_ahga
EstrategiaMovimiento <|.. EstrategiaMovimientoOficial_ahga
ContextoPieza o-- EstrategiaMovimiento

PiezaFactory_ahga ..> PiezaBase_ahga : creates

TableroBase_ahga <|-- TableroJuego_ahga

Observer <|.. InterfazUsuario_ahga
EstadoJuego_ahga o-- Observer

@enduml
```

## 8. Diagrama de Clases - Manejo de Errores y Validaciones

```plantuml
@startuml
!theme plain
title Manejo de Errores y Validaciones - Asalto al Fuerte

package "Manejo de Errores" {
  class ErrorHandler_ahga <<static>> {
    + {static} createFriendlyError_ahga(error: Error, mensaje: string): Error
    + {static} manejarErrorFirebase_ahga(error: Error): string
    + {static} manejarErrorValidacion_ahga(error: Error): string
    + {static} manejarErrorRed_ahga(error: Error): string
    + {static} logError_ahga(error: Error, contexto: string): void
  }
  
  class CustomError_ahga {
    - codigo: string
    - mensaje: string
    - detalles: Object
    
    + constructor(codigo: string, mensaje: string, detalles: Object)
    + toString(): string
    + toJSON(): Object
  }
}

package "Validaciones" {
  class Validators_ahga <<static>> {
    + {static} validarEmail_ahga(email: string): boolean
    + {static} validarPassword_ahga(password: string): Object
    + {static} validarNombre_ahga(nombre: string): boolean
    + {static} validarMovimiento_ahga(origen: Object, destino: Object): boolean
    + {static} validarTurno_ahga(jugador: string, turnoActual: string): boolean
  }
  
  class ValidadorMovimiento_ahga <<static>> {
    + {static} esCasillaValida_ahga(tablero: TableroBase_ahga, fila: number, columna: number): boolean
    + {static} esCasillaOcupada_ahga(tablero: TableroBase_ahga, fila: number, columna: number): boolean
    + {static} puedeMoverDiagonal_ahga(tablero: TableroBase_ahga, fila: number, columna: number): boolean
    + {static} validarDistanciaMovimiento_ahga(origen: Object, destino: Object): boolean
  }
}

package "Utilidades de Sesión" {
  class SessionTimer_ahga {
    - tiempoInicio: Date
    - tiempoLimite: number
    - callback: Function
    - intervalId: number
    
    + constructor(tiempoLimite: number, callback: Function)
    + iniciar(): void
    + detener(): void
    + reiniciar(): void
    + obtenerTiempoRestante(): number
  }
  
  class CaptchaValidator_ahga {
    - intentos: number
    - maxIntentos: number
    
    + constructor(maxIntentos: number)
    + validarCaptcha(respuesta: string): boolean
    + generarCaptcha(): string
    + reiniciarIntentos(): void
  }
}

package "Políticas de Seguridad" {
  class PasswordPolicy_ahga <<static>> {
    + {static} validarFortaleza_ahga(password: string): Object
    + {static} generarPassword_ahga(longitud: number): string
    + {static} verificarComplejidad_ahga(password: string): boolean
    + {static} verificarPatronesComunes_ahga(password: string): boolean
  }
}

ErrorHandler_ahga ..> CustomError_ahga : creates
Validators_ahga ..> ErrorHandler_ahga : uses
ValidadorMovimiento_ahga ..> ErrorHandler_ahga : uses
PasswordPolicy_ahga ..> Validators_ahga : uses

@enduml
```