# Diagramas de Uso - Juego Asalto al Fuerte

## 1. Diagrama General de Casos de Uso del Juego

```mermaid
graph TB
    %% Actores
    J1[Jugador 1]
    J2[Jugador 2]
    SYS[Sistema]
    UI[Interfaz Usuario]
    
    %% Casos de uso principales
    subgraph "Gestión de Partida"
        UC1[Iniciar Nueva Partida]
        UC2[Seleccionar Equipo]
        UC3[Configurar Modo Juego]
        UC4[Autenticar Jugador 2]
        UC5[Reiniciar Partida]
    end
    
    subgraph "Jugabilidad"
        UC6[Seleccionar Pieza]
        UC7[Mostrar Movimientos Válidos]
        UC8[Mover Pieza]
        UC9[Capturar Pieza]
        UC10[Cambiar Turno]
        UC11[Verificar Victoria]
    end
    
    subgraph "Interfaz y Ayuda"
        UC12[Mostrar Reglas]
        UC13[Actualizar Estado Visual]
        UC14[Manejar Eventos Canvas]
        UC15[Mostrar Modal Resultado]
    end
    
    subgraph "Persistencia"
        UC16[Guardar Partida]
        UC17[Obtener Estadísticas]
        UC18[Actualizar Estadísticas]
    end
    
    %% Relaciones
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
    
    UC1 --> UC2
    UC2 --> UC3
    UC3 --> UC4
    UC6 --> UC7
    UC7 --> UC8
    UC8 --> UC9
    UC8 --> UC10
    UC10 --> UC11
    UC11 --> UC15
    UC11 --> UC16
```

## 2. Diagrama de Casos de Uso - Configuración de Partida

```mermaid
graph TB
    %% Actores
    J1[Jugador 1]
    J2[Jugador 2]
    AUTH[Sistema Autenticación]
    
    subgraph "Configuración Inicial"
        UC1[Mostrar Modal Selección Equipo]
        UC2[Seleccionar Atacantes]
        UC3[Seleccionar Defensores]
        UC4[Mostrar Modal Modo Juego]
        UC5[Modo Invitado]
        UC6[Modo Registrado]
        UC7[Mostrar Modal Login J2]
        UC8[Validar Credenciales]
        UC9[Configurar Equipos]
        UC10[Inicializar Tablero]
    end
    
    %% Relaciones
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
```

## 3. Diagrama de Casos de Uso - Mecánicas de Juego

```mermaid
graph TB
    %% Actores
    JA[Jugador Atacante]
    JD[Jugador Defensor]
    CTRL[Controlador Juego]
    REGLAS[Sistema Reglas]
    
    subgraph "Turno Atacantes"
        UC1[Seleccionar Soldado]
        UC2[Calcular Movimientos Soldado]
        UC3[Mover Hacia Adelante]
        UC4[Mover Lateral]
        UC5[Mover Diagonal en Fortaleza]
        UC6[Ocupar Casilla Fortaleza]
    end
    
    subgraph "Turno Defensores"
        UC7[Seleccionar Oficial]
        UC8[Calcular Movimientos Oficial]
        UC9[Movimiento Normal]
        UC10[Captura por Salto]
        UC11[Eliminar Soldado]
        UC12[Captura Múltiple]
    end
    
    subgraph "Validaciones"
        UC13[Validar Turno]
        UC14[Validar Movimiento]
        UC15[Verificar Casilla Válida]
        UC16[Verificar Casilla Ocupada]
    end
    
    %% Relaciones
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
```

## 4. Diagrama de Casos de Uso - Condiciones de Victoria

```mermaid
graph TB
    %% Actores
    SYS[Sistema]
    REGLAS[Verificador Reglas]
    CONTADOR[Contador Piezas]
    
    subgraph "Victoria Atacantes"
        UC1[Verificar Ocupación Fortaleza]
        UC2[Contar Casillas Fortaleza Ocupadas]
        UC3[Verificar 9 Casillas Ocupadas]
        UC4[Verificar Oficiales Capturados]
        UC5[Contar Oficiales Restantes]
        UC6[Verificar 0 Oficiales]
    end
    
    subgraph "Victoria Defensores"
        UC7[Verificar Soldados Eliminados]
        UC8[Contar Soldados Restantes]
        UC9[Verificar Menos de 9 Soldados]
        UC10[Evaluar Capacidad Ataque]
    end
    
    subgraph "Finalización"
        UC11[Determinar Ganador]
        UC12[Mostrar Modal Victoria]
        UC13[Guardar Resultado]
        UC14[Actualizar Estadísticas]
    end
    
    %% Relaciones
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
```

## 5. Diagrama de Casos de Uso - Interfaz de Usuario

```mermaid
graph TB
    %% Actores
    USER[Usuario]
    CANVAS[Canvas]
    UI[Interfaz Usuario]
    MODAL[Sistema Modal]
    
    subgraph "Interacción Canvas"
        UC1[Manejar Click Canvas]
        UC2[Calcular Posición Casilla]
        UC3[Manejar Movimiento Ratón]
        UC4[Aplicar Hover Pieza]
        UC5[Resetear Hover]
    end
    
    subgraph "Visualización"
        UC6[Dibujar Estado Actual]
        UC7[Mostrar Piezas Seleccionadas]
        UC8[Mostrar Movimientos Válidos]
        UC9[Actualizar Turno Actual]
        UC10[Mostrar Información Jugadores]
    end
    
    subgraph "Modales"
        UC11[Mostrar Modal Reglas]
        UC12[Mostrar Modal Resultado]
        UC13[Mostrar Modal Selección]
        UC14[Mostrar Modal Login]
    end
    
    subgraph "Controles"
        UC15[Botón Nueva Partida]
        UC16[Botón Ayuda]
        UC17[Botón Regresar]
        UC18[Manejo Teclas]
    end
    
    %% Relaciones
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
```

## 6. Diagrama de Secuencia - Flujo Completo de Partida

```mermaid
sequenceDiagram
    participant J1 as Jugador 1
    participant J2 as Jugador 2
    participant APP as App
    participant CTRL as ControladorJuego
    participant UI as InterfazUsuario
    participant REGLAS as ReglasJuego
    participant FB as Firebase
    
    J1->>APP: Click "Nueva Partida"
    APP->>UI: Mostrar Modal Selección Equipo
    J1->>UI: Seleccionar Equipo (Atacantes/Defensores)
    UI->>APP: Equipo Seleccionado
    
    APP->>UI: Mostrar Modal Modo Juego
    J1->>UI: Seleccionar Modo (Invitado/Registrado)
    
    alt Modo Registrado
        UI->>J2: Mostrar Modal Login
        J2->>FB: Credenciales
        FB->>APP: Usuario Autenticado
    end
    
    APP->>CTRL: Inicializar Juego
    CTRL->>UI: Dibujar Tablero Inicial
    
    loop Mientras Juego Activo
        alt Turno Atacantes
            J1->>CTRL: Click en Soldado
            CTRL->>CTRL: Seleccionar Pieza
            CTRL->>UI: Mostrar Movimientos Válidos
            J1->>CTRL: Click en Destino
            CTRL->>CTRL: Validar Movimiento
            CTRL->>CTRL: Mover Soldado
            CTRL->>UI: Actualizar Tablero
        else Turno Defensores
            J2->>CTRL: Click en Oficial
            CTRL->>CTRL: Seleccionar Pieza
            CTRL->>CTRL: Calcular Capturas
            CTRL->>UI: Mostrar Movimientos/Capturas
            J2->>CTRL: Click en Destino
            CTRL->>CTRL: Ejecutar Movimiento/Captura
            CTRL->>UI: Actualizar Tablero
        end
        
        CTRL->>REGLAS: Verificar Victoria
        REGLAS->>CTRL: Estado Juego
        
        alt Victoria Detectada
            CTRL->>UI: Mostrar Modal Resultado
            CTRL->>FB: Guardar Partida
            CTRL->>FB: Actualizar Estadísticas
        else Continuar Juego
            CTRL->>CTRL: Cambiar Turno
            CTRL->>UI: Actualizar Turno
        end
    end
```

## 7. Diagrama de Estados del Juego

```mermaid
stateDiagram-v2
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
```

## 8. Diagrama de Casos de Uso - Gestión de Datos

```mermaid
graph TB
    %% Actores
    SYS[Sistema]
    FB[Firebase]
    AUTH[Autenticación]
    FS[Firestore]
    
    subgraph "Autenticación"
        UC1[Iniciar Sesión]
        UC2[Registrar Usuario]
        UC3[Cerrar Sesión]
        UC4[Validar Credenciales]
        UC5[Obtener Usuario Actual]
    end
    
    subgraph "Gestión Partidas"
        UC6[Guardar Partida]
        UC7[Obtener Estadísticas]
        UC8[Actualizar Estadísticas]
        UC9[Calcular Resultado]
        UC10[Determinar Tipo Victoria]
    end
    
    subgraph "Persistencia"
        UC11[Guardar en Firestore]
        UC12[Leer de Firestore]
        UC13[Actualizar Documento]
        UC14[Crear Documento]
    end
    
    %% Relaciones
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
```