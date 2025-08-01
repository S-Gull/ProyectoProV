
## 🎨 Renderizado del Tablero y las Piezas

Todo lo visual en el juego se maneja a través del **Canvas API** de HTML5, que es como un lienzo en el que dibujamos con JavaScript.

### `Tablero_ah_ga` (clase en `js/tablero.js`)

Esta clase es la responsable de la estructura y el dibujo del tablero.

1.  **Inicialización (`inicializarTablero_ah_ga`)**:
    * Define las dimensiones del tablero (`7x7`) y el tamaño de cada **casilla** basándose en el tamaño del canvas.
    * Usa el array `mapaTablero_ah_ga` para crear un array bidimensional de objetos `casilla_ah_ga`. Cada objeto casilla guarda su posición (`fila`, `columna`), si es parte de la `fortaleza` (`F`), o si es una casilla `válida` para el juego (`S` o `F`). Las casillas `b` se marcan como no válidas.
    * Se posicionan las instancias de `Pieza_ah_ga` (soldados y oficiales) en sus casillas iniciales.
    * Se define un `Set` llamado `puntosDiagonales` que almacena las coordenadas de las casillas que permiten movimientos diagonales. Esto es clave para las reglas de movimiento avanzadas.

2.  **Dibujado (`dibujarTablero_ah_ga`)**:
    * Se llama en cada actualización del juego. Limpia el canvas y luego itera sobre cada casilla en el array `casillas_ah_ga`.
    * Para cada casilla válida, dibuja un **rectángulo** que representa la casilla. El color cambia si es parte de la fortaleza (`F`) o una casilla de soldado (`S`).
    * Dibuja los **bordes** de las casillas.
    * Si una casilla es un posible destino para la `piezaSeleccionada_ah_ga`, se dibuja un **círculo indicador** en el centro de esa casilla para guiar al jugador.
    * Finalmente, si la casilla contiene una `pieza_ah_ga`, llama a `dibujarPieza_ah_ga` para renderizarla.

3.  **Dibujado de Piezas (`dibujarPieza_ah_ga`)**:
    * Esta función toma una instancia de `Pieza_ah_ga` y sus coordenadas en el canvas.
    * Dibuja un **círculo principal** para la pieza. El color del círculo depende del `tipo_ah_ga` de la pieza (rojo para oficiales, verde para soldados).
    * Aplica **efectos visuales**:
        * Si la pieza está **seleccionada** (`pieza.seleccionada_ah_ga` es `true`), dibuja un contorno blanco alrededor.
        * Si la pieza está en **hover** (`pieza.hover_ah_ga` es `true`), dibuja un contorno azul (solo si es el turno del jugador y la pieza no está ya seleccionada).

---

## ♟️ Lógica de las Piezas

### `Pieza_ah_ga` (clase en `js/piezas.js`)

Esta clase representa una pieza individual en el tablero, ya sea un soldado o un oficial.

1.  **Propiedades**:
    * `tipo_ah_ga`: `'soldado'` u `'oficial'`.
    * `fila_ah_ga`, `columna_ah_ga`: Su posición actual en el tablero.
    * `seleccionada_ah_ga`: `true` si el jugador la ha seleccionado para mover.
    * `hover_ah_ga`: `true` si el ratón está sobre ella y es el turno correspondiente.

2.  **Movimiento (`mover_ah_ga`)**:
    * Simplemente actualiza las propiedades `fila_ah_ga` y `columna_ah_ga` de la pieza a la nueva posición. La lógica de eliminación de piezas capturadas y actualización del tablero la maneja el `AdministradorJuego_ah_ga`.

3.  **Obtener Movimientos Posibles (`obtenerMovimientosPosibles_ah_ga`)**:
    * Es el método central para la lógica de movimiento. Decide si llamar a `obtenerMovimientosSoldado_ah_ga` o `obtenerMovimientosOficial_ah_ga` basándose en el tipo de pieza.

4.  **Movimientos de Soldado (`obtenerMovimientosSoldado_ah_ga`)**:
    * Calcula todas las direcciones posibles (ortogonales y diagonales si la casilla actual lo permite, usando `tablero.puedeMoverDiagonal_ah_ga`).
    * Itera por cada dirección y verifica la validez del movimiento:
        * La casilla de destino debe estar dentro del tablero y ser válida (`esCasillaValida_ah_ga`).
        * La casilla de destino debe estar **vacía**.
        * Si el soldado **no está en la fortaleza**, solo puede moverse hacia adelante (fila menor) o lateralmente sin retroceder.
        * Si el soldado **está en la fortaleza**, puede moverse a cualquier casilla `F` adyacente (incluyendo diagonales), pero **no puede salir** de ella.

5.  **Movimientos de Oficial (`obtenerMovimientosOficial_ah_ga`)**:
    * Similar a los soldados, calcula las direcciones ortogonales y diagonales posibles para movimientos de una casilla.
    * **Capturas:** Aquí entra en juego la complejidad de los saltos. Llama a la función recursiva `_buscarSaltosDeCapturaOficial_ah_ga`.
    * **Obligatoriedad de Capturas:** Si la función de búsqueda de saltos encuentra al menos una captura posible, **solo se devuelven los movimientos de captura**. De lo contrario, se devuelven los movimientos normales de una casilla.

6.  **Búsqueda de Saltos (`_buscarSaltosDeCapturaOficial_ah_ga`)**:
    * Es una función **recursiva** que permite encadenar múltiples saltos en un solo turno.
    * Define las direcciones posibles para un salto (doble paso en ortogonal o diagonal).
    * Para cada dirección, verifica:
        * Si la casilla intermedia contiene un **soldado**.
        * Si la casilla de destino (después del salto) está **vacía**.
        * Utiliza un `Set` (`visitadas_ah_ga`) para evitar que un oficial salte indefinidamente entre dos casillas y genere un bucle infinito.
        * Si se encuentra un salto válido, se añade a la lista de `movimientosConCapturas` y se llama a sí misma (`_buscarSaltosDeCapturaOficial_ah_ga`) desde la nueva posición para buscar saltos adicionales.

---

## 🕹️ Control del Juego

### `AdministradorJuego_ah_ga` (clase en `js/administradorJuego.js`)

Esta es la clase principal que orquesta todo el juego, manejando la interacción del usuario, el flujo del turno y las condiciones de victoria.

1.  **Constructor**:
    * Crea una instancia de `Tablero_ah_ga`.
    * Inicializa el `turnoActual_ah_ga` (comienza `soldado`).
    * Establece el `estadoJuego` a `'en_progreso'`.
    * Configura los **event listeners** para `click` y `mousemove` en el canvas.

2.  **Manejo de Eventos (`handleClick_ah_ga`, `handleMouseMove_ah_ga`)**:

    * **`handleClick_ah_ga`**:
        * Determina la fila y columna de la casilla clicada.
        * **Si hay una pieza seleccionada (`piezaSeleccionada_ah_ga`)**:
            * Verifica si la casilla clicada es uno de los `movimientosPosibles_ah_ga` (los círculos indicadores).
            * Si es así, llama a `ejecutarMovimiento_ah_ga` para mover la pieza, luego cambia el turno (`cambiarTurno_ah_ga`).
            * Finalmente, deselecciona la pieza (`deseleccionarPieza_ah_ga`).
        * **Si no hay pieza seleccionada**:
            * Verifica si la casilla clicada contiene una pieza y si esa pieza pertenece al `turnoActual_ah_ga` (usando `validarTurno_ah_ga`).
            * Si es así, llama a `seleccionarPieza_ah_ga` para marcarla y calcular sus movimientos posibles.

    * **`handleMouseMove_ah_ga` (Control del Hover)**:
        * Determina la casilla bajo el ratón.
        * **Lo más importante**: Antes de aplicar cualquier hover, **resetea el estado `hover_ah_ga` de todas las piezas** y luego, específicamente, establece `hover_ah_ga` a `true` solo para la pieza bajo el ratón **si esa pieza pertenece al `turnoActual_ah_ga` y no está ya seleccionada**. Esto garantiza que el hover solo sea visible para las piezas interactivas en el turno correspondiente.

3.  **Selección y Deselección (`seleccionarPieza_ah_ga`, `deseleccionarPieza_ah_ga`)**:
    * Actualizan la propiedad `seleccionada_ah_ga` de la pieza y limpian/establecen los `movimientosPosibles_ah_ga`.
    * La selección de la pieza del oficial activa la lógica de **capturas obligatorias**, filtrando los movimientos posibles para mostrar solo los saltos si están disponibles.

4.  **Ejecución de Movimiento (`ejecutarMovimiento_ah_ga`)**:
    * Mueve la `pieza_ah_ga` a su `filaDestino_ah_ga` y `columnaDestino_ah_ga`.
    * Actualiza la representación de las piezas en el array `tablero_ah_ga.casillas_ah_ga`.
    * Si el movimiento fue una **captura** (indicado por `movimiento_ah_ga.esCaptura_ah_ga` y `movimiento_ah_ga.capturada_ah_ga`), elimina la pieza capturada del tablero.
    * Después de cada movimiento, llama a `comprobarCondicionesVictoria_ah_ga`.

5.  **Cambio de Turno (`cambiarTurno_ah_ga`, `actualizarTurnoDisplay_ah_ga`)**:
    * Simplemente alterna el valor de `turnoActual_ah_ga` entre `'soldado'` y `'oficial'`.
    * Actualiza el texto en la interfaz de usuario para reflejar el turno actual.

6.  **Comprobación de Victoria (`comprobarCondicionesVictoria_ah_ga`)**:
    * Verifica las tres condiciones de victoria:
        * **Victoria de Soldados (Atacantes)**:
            1.  Si las 9 casillas de la fortaleza están ocupadas por soldados.
            2.  Si ambos oficiales han sido capturados.
        * **Victoria de Oficiales (Defensores)**:
            1.  Si el número de soldados restantes es menor a 9 (no pueden ocupar la fortaleza completa).
    * Si alguna condición se cumple, llama a `finalizarJuego_ah_ga` con el mensaje de victoria.

7.  **Finalizar Juego (`finalizarJuego_ah_ga`)**:
    * Establece `estadoJuego` a `'terminado'` para bloquear futuras interacciones.
    * **Elimina los event listeners** (`click` y `mousemove`) del canvas, impidiendo que el usuario siga interactuando con el tablero.
    * **Muestra un modal de victoria**: Crea dinámicamente un `div` con el mensaje de victoria y un botón "Jugar de nuevo". Este modal se superpone al juego y usa estilos de Tailwind CSS para una apariencia atractiva.
    * Al hacer clic en el botón "Jugar de nuevo", recarga la página (`window.location.reload()`) para iniciar una nueva partida.
    

