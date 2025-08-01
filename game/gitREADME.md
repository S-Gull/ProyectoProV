
# ⚔️ Asalto: Un Juego de Estrategia al Estilo Alquerque

**Asalto** es una adaptación digital del antiguo juego de mesa Alquerque, reimaginado con roles y objetivos asimétricos. Prepárate para liderar a tus **Soldados** en un audaz asalto a la fortaleza o defenderla ferozmente con tus **Oficiales**.

## 🎮 Cómo Jugar

El juego se desarrolla en un tablero de cuadrícula de 7x7. Los jugadores se turnan para mover sus piezas con el objetivo de cumplir las condiciones de victoria de su bando.

### Tipos de Casillas

El tablero se compone de tres tipos de casillas, visibles en el diagrama `mapaTablero_ah_ga`:

* `b` = **Espacios en blanco:** Zonas inactivas del tablero. Las piezas no pueden moverse a ni a través de estas casillas.
* `S` = **Soldados:** Casillas de inicio para los soldados y áreas válidas para su movimiento.
* `F` = **Fortaleza:** El área central de 3x3 (las nueve casillas `F`) que los soldados intentan capturar y los oficiales defienden.

### Piezas del Juego

Hay dos tipos de piezas, cada una con habilidades y objetivos únicos:

1.  **Soldados (Atacantes):** Representados por fichas verdes.
2.  **Oficiales (Defensores):** Representados por fichas rojas. (Inicialmente en `[1,2]` y `[1,4]`)

### Conexiones y Movimiento Básico

Las casillas del tablero están conectadas por "líneas invisibles". Una pieza solo puede moverse a una casilla **adyacente y vacía** que esté conectada.

* **Movimiento Ortogonal:** Todas las casillas permiten movimientos **horizontales** (izquierda, derecha) y **verticales** (arriba, abajo) a una casilla adyacente.
* **Movimiento Diagonal Especial:** A diferencia del Alquerque tradicional, en "Asalto", ciertos **puntos de intersección específicos** en el tablero también permiten movimientos **diagonales** (arriba-izquierda, arriba-derecha, abajo-izquierda, abajo-derecha) a una casilla adyacente. Estos puntos son:
    * `[0,2]`, `[0,4]`
    * `[2,0]`, `[2,2]`, `[2,4]`, `[2,6]`
    * `[3,1]`, `[3,3]`, `[3,5]`
    * `[4,0]`, `[4,2]`, `[4,4]`, `[4,6]`
    * `[5,3]`
    * `[6,2]`, `[6,4]`

## 🚶‍♂️ Mecánica de Movimiento por Pieza

### Soldados (Atacantes)

* **Un paso por turno:** Mueven una casilla a la vez.
* **Solo hacia la fortaleza:** Fuera de la fortaleza, los soldados deben moverse hacia una fila con un índice numérico menor (avanzar) o lateralmente si esto los acerca a una ruta hacia la fortaleza. No pueden retroceder (moverse a una fila con un índice mayor).
* **Dentro de la fortaleza:** Una vez que un soldado entra en una casilla `F` (la fortaleza), puede moverse a cualquier otra casilla `F` adyacente (incluyendo diagonales si la casilla lo permite) dentro de la fortaleza. **No pueden salir de la fortaleza.**
* **No capturan:** Los soldados no pueden capturar piezas.
* **No pueden mover a casillas ocupadas.**

### Oficiales (Defensores)

* **Movimiento flexible:** Pueden moverse una casilla en cualquier dirección (ortogonal o diagonal, si la casilla lo permite) a una casilla adyacente vacía.
* **Saltos y Capturas:** Los oficiales pueden **capturar soldados** saltando sobre ellos.
    1.  Debe haber un **soldado** en una casilla adyacente (conectada por una línea, incluyendo diagonales si el punto lo permite).
    2.  La casilla **inmediatamente detrás** de ese soldado, en la misma línea de movimiento (recta), debe estar **vacía**.
    3.  El oficial salta sobre el soldado y aterriza en la casilla vacía. El soldado capturado es **eliminado** del tablero.
* **Saltos Múltiples:** Un oficial puede encadenar varios saltos en un solo turno, siempre que cada salto cumpla las condiciones. Pueden cambiar de dirección entre saltos.
* **Capturas Obligatorias:** Si un oficial tiene la posibilidad de realizar un salto que resulte en una captura, está **obligado a hacerlo**. Si hay múltiples opciones de captura, el jugador defensor elige cuál realizar. No se puede "pasar" un turno si hay una captura disponible.

## 🏆 Condiciones de Victoria

El juego termina cuando se cumple una de las siguientes condiciones:

### Victoria de los Atacantes (Soldados)

* **Ocupación de la Fortaleza:** Los soldados logran ocupar las **nueve casillas de la fortaleza** (`F`).
* **Captura de Oficiales:** Los soldados logran capturar (eliminar del tablero) a **ambos oficiales**.

### Victoria de los Defensores (Oficiales)

* **Eliminación de Soldados:** Los oficiales logran reducir el número de soldados a **menos de 9**. (Esto hace imposible que los soldados ocupen la fortaleza en su totalidad).

## ✨ Interfaz de Usuario

* **Indicador de Turno:** Un texto en la parte superior te informará qué bando tiene el turno actual (Atacantes - Soldados o Defensores - Oficiales).
* **Hover sobre Piezas:** Al pasar el ratón sobre una pieza, esta se resaltará con un contorno azul, **pero solo si pertenece al bando del turno actual**.
* **Pieza Seleccionada:** Al hacer clic en una pieza de tu turno, se rodeará con un contorno blanco y se mostrarán círculos en las casillas a las que puede moverse.
* **Fin de Juego:** Cuando se cumpla una condición de victoria, un **modal de pantalla completa** aparecerá mostrando el resultado y un botón para "Jugar de nuevo", deshabilitando la interacción con el tablero. 

## 🚀 Cómo Ejecutar el Juego

1.  Abre el archivo `index.html` en tu navegador web.
2.  Desde la página principal, haz clic en el enlace o botón para iniciar el juego.

---

¡Disfruta del desafío estratégico de Asalto!