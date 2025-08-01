// tablero.js
import { PiezaFactory_ah_ga } from './piezas.js';

/* Clase base abstracta para el tablero */
class TableroBase_ah_ga {
  constructor(filas, columnas) {
    this.filasTotales_ah_ga = filas;
    this.columnasTotales_ah_ga = columnas;
    this.casillasJuego_ah_ga = [];
    this.inicializarEstructura();
  }

  inicializarEstructura() {
    throw new Error("Método abstracto debe ser implementado por subclases");
  }

  obtenerCasilla_ah_ga(fila, columna) {
    if (!this.esCasillaValida_ah_ga(fila, columna)) {
      return null;
    }
    return this.casillasJuego_ah_ga[fila][columna];
  }

  esCasillaValida_ah_ga(fila, columna) {
    return (
      fila >= 0 &&
      fila < this.filasTotales_ah_ga &&
      columna >= 0 &&
      columna < this.columnasTotales_ah_ga &&
      this.casillasJuego_ah_ga[fila]?.[columna]?.esValida_ah_ga
    );
  }

  esCasillaFortaleza_ah_ga(fila, columna) {
    const casilla = this.obtenerCasilla_ah_ga(fila, columna);
    return casilla ? casilla.esFortaleza_ah_ga : false;
  }
}

/* Clase para manejar el renderizado del tablero */
class RenderizadorTablero_ah_ga {
  constructor(tablero) {
    this.tablero = tablero;
  }

  dibujar(contexto, movimientosPosibles = []) {
    contexto.clearRect(0, 0, 
      this.tablero.anchoCanvas_ah_ga, 
      this.tablero.altoCanvas_ah_ga);

    for (let fila = 0; fila < this.tablero.filasTotales_ah_ga; fila++) {
      for (let col = 0; col < this.tablero.columnasTotales_ah_ga; col++) {
        this.dibujarCasilla(contexto, fila, col, movimientosPosibles);
      }
    }
  }

  dibujarCasilla(contexto, fila, col, movimientosPosibles) {
    const casilla = this.tablero.obtenerCasilla_ah_ga(fila, col);
    if (!casilla || !casilla.esValida_ah_ga) return;

    this.dibujarFondoCasilla(contexto, casilla, fila, col);
    
    if (this.esMovimientoPosible(movimientosPosibles, fila, col)) {
      this.dibujarIndicadorMovimiento(contexto, fila, col);
    }

    if (casilla.pieza_ah_ga) {
      this.dibujarPieza(contexto, casilla.pieza_ah_ga, fila, col);
    }
  }

  dibujarFondoCasilla(contexto, casilla, fila, col) {
    const x = col * this.tablero.tamanoCasilla_ah_ga;
    const y = fila * this.tablero.tamanoCasilla_ah_ga;
    
    contexto.fillStyle = casilla.esFortaleza_ah_ga ? '#3F7D20' : '#2D2D2D';
    contexto.fillRect(x, y, this.tablero.tamanoCasilla_ah_ga, this.tablero.tamanoCasilla_ah_ga);
    
    contexto.strokeStyle = '#454955';
    contexto.strokeRect(x, y, this.tablero.tamanoCasilla_ah_ga, this.tablero.tamanoCasilla_ah_ga);
  }

  dibujarIndicadorMovimiento(contexto, fila, col) {
    const centroX = (col + 0.5) * this.tablero.tamanoCasilla_ah_ga;
    const centroY = (fila + 0.5) * this.tablero.tamanoCasilla_ah_ga;
    const radio = this.tablero.tamanoCasilla_ah_ga * 0.15;

    contexto.beginPath();
    contexto.arc(centroX, centroY, radio, 0, Math.PI * 2);
    contexto.fillStyle = 'rgba(255, 255, 254, 0.4)';
    contexto.fill();
  }

  dibujarPieza(contexto, pieza, fila, col) {
    const centroX = (col + 0.5) * this.tablero.tamanoCasilla_ah_ga;
    const centroY = (fila + 0.5) * this.tablero.tamanoCasilla_ah_ga;
    const radio = this.tablero.tamanoCasilla_ah_ga * 0.37;

    this.dibujarSeleccion(contexto, pieza, centroX, centroY, radio);
    this.dibujarCuerpo(contexto, pieza, centroX, centroY, radio);
  }

  dibujarSeleccion(contexto, pieza, x, y, radio) {
    if (pieza.estaSeleccionada_ah_ga) {
      contexto.beginPath();
      contexto.arc(x, y, radio + 5, 0, Math.PI * 2);
      contexto.fillStyle = '#FFFFFF';
      contexto.fill();
    } else if (pieza.estaSobre_ah_ga) {
      contexto.beginPath();
      contexto.arc(x, y, radio + 3, 0, Math.PI * 2);
      contexto.fillStyle = '#4d6bfe';
      contexto.fill();
    }
  }

  dibujarCuerpo(contexto, pieza, x, y, radio) {
    contexto.beginPath();
    contexto.arc(x, y, radio, 0, Math.PI * 2);
    contexto.fillStyle = pieza.tipoPieza_ah_ga === 'oficial' ? '#FF3A3A' : '#72B01D';
    contexto.fill();
    contexto.strokeStyle = 'black';
    contexto.lineWidth = 1;
    contexto.stroke();
  }

  esMovimientoPosible(movimientosPosibles, fila, col) {
    return movimientosPosibles.some(
      pos => pos.fila_ah_ga === fila && pos.columna_ah_ga === col
    ) && !this.tablero.obtenerCasilla_ah_ga(fila, col).pieza_ah_ga;
  }
}

/* Clase concreta del tablero del juego */
export class TableroJuego_ah_ga extends TableroBase_ah_ga {
  constructor(anchoCanvas, altoCanvas) {
    super(7, 7);
    this.anchoCanvas_ah_ga = anchoCanvas;
    this.altoCanvas_ah_ga = altoCanvas;
    this.tamanoCasilla_ah_ga = this.calcularTamanoCasilla();
    this.renderizador = new RenderizadorTablero_ah_ga(this);
    this.puntosDiagonales_ah_ga = new Set([
      '0,2', '0,4',
      '1,3',      
      '2,0', '2,2', '2,4', '2,6',
      '3,1', '3,3', '3,5',
      '4,0', '4,2', '4,4', '4,6',
      '5,3',
      '6,2', '6,4'
    ]);
  }

  calcularTamanoCasilla() {
    return Math.min(
      Math.floor(this.anchoCanvas_ah_ga / this.columnasTotales_ah_ga),
      Math.floor(this.altoCanvas_ah_ga / this.filasTotales_ah_ga)
    );
  }

  inicializarEstructura() {
    const estructura = [
      ['b', 'b', 'F', 'F', 'F', 'b', 'b'],
      ['b', 'b', 'F', 'F', 'F', 'b', 'b'],
      ['S', 'S', 'F', 'F', 'F', 'S', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
      ['S', 'S', 'S', 'S', 'S', 'S', 'S'],
      ['b', 'b', 'S', 'S', 'S', 'b', 'b'],
      ['b', 'b', 'S', 'S', 'S', 'b', 'b']
    ];

    for (let fila = 0; fila < this.filasTotales_ah_ga; fila++) {
      this.casillasJuego_ah_ga[fila] = [];
      for (let col = 0; col < this.columnasTotales_ah_ga; col++) {
        const tipo = estructura[fila][col];
        this.casillasJuego_ah_ga[fila][col] = {
          fila_ah_ga: fila,
          columna_ah_ga: col,
          esFortaleza_ah_ga: tipo === 'F',
          esValida_ah_ga: tipo !== 'b',
          pieza_ah_ga: null
        };
      }
    }

    this.colocarPiezasIniciales();
  }

  colocarPiezasIniciales() {
    this.colocarOficiales();
    this.colocarSoldados();
  }

  colocarOficiales() {
    const posiciones = [[1, 2], [1, 4]];
    posiciones.forEach(([fila, col]) => {
      this.casillasJuego_ah_ga[fila][col].pieza_ah_ga = 
        PiezaFactory_ah_ga.crearPieza_ah_ga('oficial', fila, col);
    });
  }

  colocarSoldados() {
    const posiciones = [
      [2, 0], [2, 1], [2, 5], [2, 6],
      [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
      [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6],
      [5, 2], [5, 3], [5, 4],
      [6, 2], [6, 3], [6, 4]    
    ];

    posiciones.forEach(([fila, col]) => {
      if (!(fila === 1 && (col === 2 || col === 4))) {
        this.casillasJuego_ah_ga[fila][col].pieza_ah_ga = 
          PiezaFactory_ah_ga.crearPieza_ah_ga('soldado', fila, col);
      }
    });
  }

  puedeMoverseDiagonal_ah_ga(fila, columna) {
    return this.puntosDiagonales_ah_ga.has(`${fila},${columna}`);
  }

  dibujarTablero_ah_ga(contexto, movimientosPosibles = []) {
    this.renderizador.dibujar(contexto, movimientosPosibles);
  }

  reiniciar() {
    this.casillasJuego_ah_ga = [];
    this.inicializarEstructura();
  }
}