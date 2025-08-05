// tablero.js
import { PiezaFactory_ahga } from "./piezas.js";

/* Clase base abstracta para el tablero */
class TableroBase_ahga {
  constructor(filas_ahga, columnas_ahga) {
    this.filasTotales_ahga = filas_ahga;
    this.columnasTotales_ahga = columnas_ahga;
    this.casillasJuego_ahga = [];
    this.inicializarEstructura_ahga();
  }

  inicializarEstructura_ahga() {
    throw new Error("Método abstracto debe ser implementado por subclases");
  }

  obtenerCasilla_ahga(fila_ahga, columna_ahga) {
    if (!this.esCasillaValida_ahga(fila_ahga, columna_ahga)) {
      return null;
    }
    return this.casillasJuego_ahga[fila_ahga][columna_ahga];
  }

  esCasillaValida_ahga(fila_ahga, columna_ahga) {
    return (
      fila_ahga >= 0 &&
      fila_ahga < this.filasTotales_ahga &&
      columna_ahga >= 0 &&
      columna_ahga < this.columnasTotales_ahga &&
      this.casillasJuego_ahga[fila_ahga]?.[columna_ahga]?.esValida_ahga
    );
  }

  esCasillaFortaleza_ahga(fila_ahga, columna_ahga) {
    const casilla_ahga = this.obtenerCasilla_ahga(fila_ahga, columna_ahga);
    return casilla_ahga ? casilla_ahga.esFortaleza_ahga : false;
  }
}

/* Clase para manejar el renderizado del tablero */
class RenderizadorTablero_ahga {
  constructor(tablero_ahga) {
    this.tablero_ahga = tablero_ahga;
  }

  dibujar_ahga(contexto_ahga, movimientosPosibles_ahga = []) {
    contexto_ahga.clearRect(
      0,
      0,
      this.tablero_ahga.anchoCanvas_ahga,
      this.tablero_ahga.altoCanvas_ahga
    );

    for (
      let fila_ahga = 0;
      fila_ahga < this.tablero_ahga.filasTotales_ahga;
      fila_ahga++
    ) {
      for (
        let col_ahga = 0;
        col_ahga < this.tablero_ahga.columnasTotales_ahga;
        col_ahga++
      ) {
        this.dibujarCasilla_ahga(
          contexto_ahga,
          fila_ahga,
          col_ahga,
          movimientosPosibles_ahga
        );
      }
    }
  }

  dibujarCasilla_ahga(
    contexto_ahga,
    fila_ahga,
    col_ahga,
    movimientosPosibles_ahga
  ) {
    const casilla_ahga = this.tablero_ahga.obtenerCasilla_ahga(
      fila_ahga,
      col_ahga
    );
    if (!casilla_ahga || !casilla_ahga.esValida_ahga) return;

    this.dibujarFondoCasilla_ahga(
      contexto_ahga,
      casilla_ahga,
      fila_ahga,
      col_ahga
    );

    if (
      this.esMovimientoPosible_ahga(
        movimientosPosibles_ahga,
        fila_ahga,
        col_ahga
      )
    ) {
      this.dibujarIndicadorMovimiento_ahga(contexto_ahga, fila_ahga, col_ahga);
    }

    if (casilla_ahga.pieza_ahga) {
      this.dibujarPieza_ahga(
        contexto_ahga,
        casilla_ahga.pieza_ahga,
        fila_ahga,
        col_ahga
      );
    }
  }

  dibujarFondoCasilla_ahga(contexto_ahga, casilla_ahga, fila_ahga, col_ahga) {
    const x_ahga = col_ahga * this.tablero_ahga.tamanoCasilla_ahga;
    const y_ahga = fila_ahga * this.tablero_ahga.tamanoCasilla_ahga;

    contexto_ahga.fillStyle = casilla_ahga.esFortaleza_ahga
      ? "#3F7D20"
      : "#2D2D2D";
    contexto_ahga.fillRect(
      x_ahga,
      y_ahga,
      this.tablero_ahga.tamanoCasilla_ahga,
      this.tablero_ahga.tamanoCasilla_ahga
    );

    contexto_ahga.strokeStyle = "#454955";
    contexto_ahga.strokeRect(
      x_ahga,
      y_ahga,
      this.tablero_ahga.tamanoCasilla_ahga,
      this.tablero_ahga.tamanoCasilla_ahga
    );
  }

  dibujarIndicadorMovimiento_ahga(contexto_ahga, fila_ahga, col_ahga) {
    const centroX_ahga =
      (col_ahga + 0.5) * this.tablero_ahga.tamanoCasilla_ahga;
    const centroY_ahga =
      (fila_ahga + 0.5) * this.tablero_ahga.tamanoCasilla_ahga;
    const radio_ahga = this.tablero_ahga.tamanoCasilla_ahga * 0.15;

    contexto_ahga.beginPath();
    contexto_ahga.arc(centroX_ahga, centroY_ahga, radio_ahga, 0, Math.PI * 2);
    contexto_ahga.fillStyle = "rgba(255, 255, 254, 0.4)";
    contexto_ahga.fill();
  }

  dibujarPieza_ahga(contexto_ahga, pieza_ahga, fila_ahga, col_ahga) {
    const centroX_ahga =
      (col_ahga + 0.5) * this.tablero_ahga.tamanoCasilla_ahga;
    const centroY_ahga =
      (fila_ahga + 0.5) * this.tablero_ahga.tamanoCasilla_ahga;
    const radio_ahga = this.tablero_ahga.tamanoCasilla_ahga * 0.37;

    this.dibujarSeleccion_ahga(
      contexto_ahga,
      pieza_ahga,
      centroX_ahga,
      centroY_ahga,
      radio_ahga
    );
    this.dibujarCuerpo_ahga(
      contexto_ahga,
      pieza_ahga,
      centroX_ahga,
      centroY_ahga,
      radio_ahga
    );
  }

  dibujarSeleccion_ahga(contexto_ahga, pieza_ahga, x_ahga, y_ahga, radio_ahga) {
    if (pieza_ahga.estaSeleccionada_ahga) {
      contexto_ahga.beginPath();
      contexto_ahga.arc(x_ahga, y_ahga, radio_ahga + 5, 0, Math.PI * 2);
      contexto_ahga.fillStyle = "#FFFFFF";
      contexto_ahga.fill();
    } else if (pieza_ahga.estaSobre_ahga) {
      contexto_ahga.beginPath();
      contexto_ahga.arc(x_ahga, y_ahga, radio_ahga + 3, 0, Math.PI * 2);
      contexto_ahga.fillStyle = "#4d6bfe";
      contexto_ahga.fill();
    }
  }

  dibujarCuerpo_ahga(contexto_ahga, pieza_ahga, x_ahga, y_ahga, radio_ahga) {
    contexto_ahga.beginPath();
    contexto_ahga.arc(x_ahga, y_ahga, radio_ahga, 0, Math.PI * 2);
    contexto_ahga.fillStyle =
      pieza_ahga.tipoPieza_ahga === "oficial" ? "#FF3A3A" : "#72B01D";
    contexto_ahga.fill();
    contexto_ahga.strokeStyle = "black";
    contexto_ahga.lineWidth = 1;
    contexto_ahga.stroke();
  }

  esMovimientoPosible_ahga(movimientosPosibles_ahga, fila_ahga, col_ahga) {
    return (
      movimientosPosibles_ahga.some(
        (pos) => pos.fila_ahga === fila_ahga && pos.columna_ahga === col_ahga
      ) &&
      !this.tablero_ahga.obtenerCasilla_ahga(fila_ahga, col_ahga).pieza_ahga
    );
  }
}

/* Clase concreta del tablero del juego */
export class TableroJuego_ahga extends TableroBase_ahga {
  constructor(anchoCanvas_ahga, altoCanvas_ahga) {
    super(7, 7);
    this.anchoCanvas_ahga = anchoCanvas_ahga;
    this.altoCanvas_ahga = altoCanvas_ahga;
    this.tamanoCasilla_ahga = this.calcularTamanoCasilla_ahga();
    this.renderizador_ahga = new RenderizadorTablero_ahga(this);
    this.puntosDiagonales_ahga = new Set([
      "0,2",
      "0,4",
      "1,3",
      "2,0",
      "2,2",
      "2,4",
      "2,6",
      "3,1",
      "3,3",
      "3,5",
      "4,0",
      "4,2",
      "4,4",
      "4,6",
      "5,3",
      "6,2",
      "6,4",
    ]);
  }

  calcularTamanoCasilla_ahga() {
    return Math.min(
      Math.floor(this.anchoCanvas_ahga / this.columnasTotales_ahga),
      Math.floor(this.altoCanvas_ahga / this.filasTotales_ahga)
    );
  }

  inicializarEstructura_ahga() {
    const estructura_ahga = [
      ["b", "b", "F", "F", "F", "b", "b"],
      ["b", "b", "F", "F", "F", "b", "b"],
      ["S", "S", "F", "F", "F", "S", "S"],
      ["S", "S", "S", "S", "S", "S", "S"],
      ["S", "S", "S", "S", "S", "S", "S"],
      ["b", "b", "S", "S", "S", "b", "b"],
      ["b", "b", "S", "S", "S", "b", "b"],
    ];

    for (let fila_ahga = 0; fila_ahga < this.filasTotales_ahga; fila_ahga++) {
      this.casillasJuego_ahga[fila_ahga] = [];
      for (let col_ahga = 0; col_ahga < this.columnasTotales_ahga; col_ahga++) {
        const tipo_ahga = estructura_ahga[fila_ahga][col_ahga];
        this.casillasJuego_ahga[fila_ahga][col_ahga] = {
          fila_ahga: fila_ahga,
          columna_ahga: col_ahga,
          esFortaleza_ahga: tipo_ahga === "F",
          esValida_ahga: tipo_ahga !== "b",
          pieza_ahga: null,
        };
      }
    }

    this.colocarPiezasIniciales_ahga();
  }

  colocarPiezasIniciales_ahga() {
    this.colocarOficiales_ahga();
    this.colocarSoldados_ahga();
  }

  colocarOficiales_ahga() {
    const posiciones_ahga = [
      [1, 2],
      [1, 4],
    ];
    posiciones_ahga.forEach(([fila_ahga, col_ahga]) => {
      this.casillasJuego_ahga[fila_ahga][col_ahga].pieza_ahga =
        PiezaFactory_ahga.crearPieza_ahga("oficial", fila_ahga, col_ahga);
    });
  }

  colocarSoldados_ahga() {
    const posiciones_ahga = [
      [2, 0],
      [2, 1],
      [2, 5],
      [2, 6],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 4],
      [4, 5],
      [4, 6],
      [5, 2],
      [5, 3],
      [5, 4],
      [6, 2],
      [6, 3],
      [6, 4],
    ];

    posiciones_ahga.forEach(([fila_ahga, col_ahga]) => {
      if (!(fila_ahga === 1 && (col_ahga === 2 || col_ahga === 4))) {
        this.casillasJuego_ahga[fila_ahga][col_ahga].pieza_ahga =
          PiezaFactory_ahga.crearPieza_ahga("soldado", fila_ahga, col_ahga);
      }
    });
  }

  puedeMoverseDiagonal_ahga(fila_ahga, columna_ahga) {
    return this.puntosDiagonales_ahga.has(`${fila_ahga},${columna_ahga}`);
  }

  dibujarTablero_ahga(contexto_ahga, movimientosPosibles_ahga = []) {
    this.renderizador_ahga.dibujar_ahga(
      contexto_ahga,
      movimientosPosibles_ahga
    );
  }

  reiniciar_ahga() {
    this.casillasJuego_ahga = [];
    this.inicializarEstructura_ahga();
  }
}
