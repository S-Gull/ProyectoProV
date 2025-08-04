# 🕹️ Detalle de `juego.html` — Interfaz de Juego de Asalto

El archivo [`dist/juego.html`](dist/juego.html) es la interfaz principal donde los jugadores interactúan con el juego de estrategia **Asalto**. Aquí se despliega el tablero, las piezas, los controles y el sistema de turnos, todo integrado con la lógica JavaScript del proyecto.

---

## 🎨 Estructura Visual

- **Encabezado:** Título del juego y subtítulo descriptivo.
- **Área de juego:** Un `<canvas>` central (`canvasJuego_ah_ga`) donde se dibuja el tablero y las piezas usando la API Canvas y las clases de [`js/tablero.js`](js/tablero.js).
- **Panel de control:** A la derecha, muestra el turno actual, controles básicos, estadísticas de piezas y botones de acción.
- **Pie de página:** Créditos y año.

---

## 🧩 Componentes y Funcionalidades

### 1. Canvas de Juego

- El canvas tiene tamaño fijo (560x560px) y es el área donde se renderiza el tablero y las piezas.
- El renderizado se realiza mediante la clase [`RenderizadorTablero_ah_ga`](js/tablero.js), que dibuja casillas, piezas, indicadores de movimiento y efectos visuales (selección, hover).

### 2. Panel de Control

- **Turno Actual:** Indica si juegan los atacantes (soldados) o defensores (oficiales), usando el elemento `turnoActual_ah_ga`.
- **Controles:** Explica cómo seleccionar piezas, moverlas y usar el hover para resaltar piezas interactivas.
- **Estadísticas:** Muestra el número de soldados y oficiales restantes (`contadorSoldados_ah_ga`, `contadorOficiales_ah_ga`).
- **Botones:**
  - **Nueva Partida:** Reinicia el tablero y las piezas.
  - **Ayuda:** Muestra las reglas básicas en un modal emergente.

### 3. Modal de Victoria

- Cuando se cumple una condición de victoria (ver [`ReglasJuego_ah_ga`](js/administradorJuego.js)), aparece un modal superpuesto con el resultado y un botón para reiniciar la partida.

---

## ⚙️ Lógica de Interacción

- El archivo importa [`app.js`](js/app.js), que inicializa el [`ControladorJuego_ah_ga`](js/administradorJuego.js) y conecta los eventos del canvas y los botones.
- **Eventos principales:**
  - `click` en el canvas: Selecciona piezas y realiza movimientos.
  - `mousemove` en el canvas: Aplica efecto hover a piezas del turno actual.
  - Botón "Nueva Partida": Llama a `reiniciarPartida()` en el controlador.
  - Botón "Ayuda": Muestra reglas rápidas en un alert.

---

## 🏆 Condiciones de Victoria

- **Atacantes ganan:** Si ocupan las 9 casillas de la fortaleza o capturan ambos oficiales.
- **Defensores ganan:** Si eliminan suficientes soldados (menos de 9 quedan en el tablero).

Las condiciones se verifican tras cada movimiento y se muestran en el modal de victoria.

---

## 📚 Referencias de Código

- Renderizado y lógica del tablero: [`RenderizadorTablero_ah_ga`](js/tablero.js)
- Lógica de piezas y movimientos: [`Soldado_ah_ga`](js/piezas.js), [`Oficial_ah_ga`](js/piezas.js)
- Control de juego y reglas: [`ControladorJuego_ah_ga`](js/administradorJuego.js), [`ReglasJuego_ah_ga`](js/administradorJuego.js)
- Modal de victoria: [`InterfazUsuario_ah_ga`](js/administradorJuego.js)

---

## 💡 Experiencia de Usuario

- Interfaz responsiva y clara, con indicadores visuales para selección y movimientos posibles.
- Modal de victoria bloquea la interacción hasta reiniciar la partida.
- Estadísticas y controles siempre visibles para facilitar el seguimiento del juego.

---

**Para jugar:**  
Abre [`dist/juego.html`](dist/juego.html) en tu navegador y disfruta de la experiencia
