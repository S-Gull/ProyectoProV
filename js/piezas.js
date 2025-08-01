// piezas.js

/* Clase base abstracta para todas las piezas */
class PiezaBase_ah_ga {
  constructor(tipoPieza_ah_ga, filaPosicion_ah_ga, columnaPosicion_ah_ga) {
    if (new.target === PiezaBase_ah_ga) {
      throw new Error("No se puede instanciar PiezaBase_ah_ga directamente");
    }
    this.tipoPieza_ah_ga = tipoPieza_ah_ga;
    this.filaPosicion_ah_ga = filaPosicion_ah_ga;
    this.columnaPosicion_ah_ga = columnaPosicion_ah_ga;
    this.estaSeleccionada_ah_ga = false;
    this.estaSobre_ah_ga = false;
  }

  moverA_ah_ga(nuevaFila_ah_ga, nuevaColumna_ah_ga) {
    this.filaPosicion_ah_ga = nuevaFila_ah_ga;
    this.columnaPosicion_ah_ga = nuevaColumna_ah_ga;
  }

  calcularMovimientosValidos_ah_ga(tableroJuego_ah_ga) {
    throw new Error("Método abstracto debe ser implementado por subclases");
  }
}

/* Helper para validaciones de movimiento */
class ValidadorMovimiento_ah_ga {
  static esCasillaValida_ah_ga(tablero, fila, columna) {
    return tablero.esCasillaValida_ah_ga(fila, columna);
  }

  static esCasillaOcupada_ah_ga(tablero, fila, columna) {
    return !!tablero.obtenerCasilla_ah_ga(fila, columna).pieza_ah_ga;
  }

  static puedeMoverDiagonal_ah_ga(tablero, fila, columna) {
    return tablero.puedeMoverseDiagonal_ah_ga(fila, columna);
  }
}

/* Estrategia de movimiento para soldados */
class EstrategiaMovimientoSoldado_ah_ga {
  constructor(pieza_ah_ga, tablero_ah_ga) {
    this.pieza = pieza_ah_ga;
    this.tablero = tablero_ah_ga;
  }

  obtenerDireccionesBase_ah_ga() {
    return [
      [-1, 0], // Arriba
      [1, 0],  // Abajo
      [0, -1], // Izquierda
      [0, 1]   // Derecha
    ];
  }

  obtenerDireccionesDiagonales_ah_ga() {
    return [
      [-1, -1], // Arriba-Izquierda
      [-1, 1],  // Arriba-Derecha
      [1, -1],  // Abajo-Izquierda
      [1, 1]    // Abajo-Derecha
    ];
  }

  calcularMovimientos_ah_ga() {
    const direcciones = this.obtenerDireccionesBase_ah_ga();
    if (ValidadorMovimiento_ah_ga.puedeMoverDiagonal_ah_ga(
      this.tablero, 
      this.pieza.filaPosicion_ah_ga, 
      this.pieza.columnaPosicion_ah_ga
    )) {
      direcciones.push(...this.obtenerDireccionesDiagonales_ah_ga());
    }

    return direcciones
      .map(([df, dc]) => ({
        fila: this.pieza.filaPosicion_ah_ga + df,
        columna: this.pieza.columnaPosicion_ah_ga + dc,
        deltaFila: df
      }))
      .filter(({fila, columna, deltaFila}) => 
        this.esMovimientoValido_ah_ga(fila, columna, deltaFila))
      .map(({fila, columna}) => ({
        fila_ah_ga: fila,
        columna_ah_ga: columna,
        esCaptura_ah_ga: false
      }));
  }

  esMovimientoValido_ah_ga(fila, columna, deltaFila) {
    if (!ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero, fila, columna) ||
        ValidadorMovimiento_ah_ga.esCasillaOcupada_ah_ga(this.tablero, fila, columna)) {
      return false;
    }

    const enFortaleza = this.tablero.esCasillaFortaleza_ah_ga(
      this.pieza.filaPosicion_ah_ga, 
      this.pieza.columnaPosicion_ah_ga
    );

    if (!enFortaleza) {
      return deltaFila <= 0 || 
             (deltaFila === 0 && fila <= this.pieza.filaPosicion_ah_ga);
    }
    return this.tablero.esCasillaFortaleza_ah_ga(fila, columna);
  }
}

/* Estrategia de movimiento para oficiales */
class EstrategiaMovimientoOficial_ah_ga {
  constructor(pieza_ah_ga, tablero_ah_ga) {
    this.pieza = pieza_ah_ga;
    this.tablero = tablero_ah_ga;
  }

  calcularMovimientos_ah_ga() {
    const capturas = this.calcularCapturas_ah_ga();
    return capturas.length > 0 ? capturas : this.calcularMovimientosNormales_ah_ga();
  }

  calcularMovimientosNormales_ah_ga() {
    const direcciones = this.obtenerDirecciones_ah_ga();
    const movimientos = [];

    for (const [df, dc] of direcciones) {
      const fila = this.pieza.filaPosicion_ah_ga + df;
      const columna = this.pieza.columnaPosicion_ah_ga + dc;

      if (ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero, fila, columna) &&
          !ValidadorMovimiento_ah_ga.esCasillaOcupada_ah_ga(this.tablero, fila, columna)) {
        movimientos.push({
          fila_ah_ga: fila,
          columna_ah_ga: columna,
          esCaptura_ah_ga: false
        });
      }
    }
    return movimientos;
  }

  calcularCapturas_ah_ga() {
    const capturas = [];
    this.buscarSaltosCaptura_ah_ga(
      this.pieza.filaPosicion_ah_ga,
      this.pieza.columnaPosicion_ah_ga,
      new Set(),
      [],
      capturas
    );
    return capturas;
  }

  obtenerDirecciones_ah_ga() {
    let direcciones = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    if (ValidadorMovimiento_ah_ga.puedeMoverDiagonal_ah_ga(
      this.tablero,
      this.pieza.filaPosicion_ah_ga,
      this.pieza.columnaPosicion_ah_ga
    )) {
      direcciones.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }
    return direcciones;
  }

  buscarSaltosCaptura_ah_ga(filaActual, columnaActual, visitadas, capturadas, resultado) {
    for (const [df, dc] of this.obtenerDirecciones_ah_ga()) {
      const filaIntermedia = filaActual + df;
      const columnaIntermedia = columnaActual + dc;
      const filaDestino = filaActual + 2 * df;
      const columnaDestino = columnaActual + 2 * dc;

      if (this.esSaltoValido_ah_ga(
        filaIntermedia, columnaIntermedia,
        filaDestino, columnaDestino,
        visitadas, capturadas
      )) {
        const nuevasCapturas = [...capturadas, 
          { fila: filaIntermedia, columna: columnaIntermedia }];
        visitadas.add(`${filaDestino},${columnaDestino}`);

        resultado.push({
          fila_ah_ga: filaDestino,
          columna_ah_ga: columnaDestino,
          esCaptura_ah_ga: true,
          capturada_ah_ga: { fila: filaIntermedia, columna: columnaIntermedia }
        });

        this.buscarSaltosCaptura_ah_ga(
          filaDestino, columnaDestino,
          visitadas, nuevasCapturas, resultado
        );
      }
    }
  }

  esSaltoValido_ah_ga(filaIntermedia, columnaIntermedia, filaDestino, columnaDestino, visitadas, capturadas) {
    // Validación completa del salto
    if (!ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero, filaIntermedia, columnaIntermedia) ||
        !ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero, filaDestino, columnaDestino) ||
        visitadas.has(`${filaDestino},${columnaDestino}`)) {
      return false;
    }

    const casillaIntermedia = this.tablero.obtenerCasilla_ah_ga(filaIntermedia, columnaIntermedia);
    const casillaDestino = this.tablero.obtenerCasilla_ah_ga(filaDestino, columnaDestino);

    const piezaIntermedia = casillaIntermedia.pieza_ah_ga;
    const piezaYaCapturada = capturadas.some(p => 
      p.fila === filaIntermedia && p.columna === columnaIntermedia);

    return piezaIntermedia &&
           piezaIntermedia.tipoPieza_ah_ga === 'soldado' &&
           !casillaDestino.pieza_ah_ga &&
           !piezaYaCapturada;
  }
}

/* Clases concretas para cada tipo de pieza */
export class Soldado_ah_ga extends PiezaBase_ah_ga {
  constructor(filaPosicion_ah_ga, columnaPosicion_ah_ga) {
    super('soldado', filaPosicion_ah_ga, columnaPosicion_ah_ga);
    this.estrategiaMovimiento = new EstrategiaMovimientoSoldado_ah_ga(this);
  }

  calcularMovimientosValidos_ah_ga(tableroJuego_ah_ga) {
    this.estrategiaMovimiento.tablero = tableroJuego_ah_ga;
    return this.estrategiaMovimiento.calcularMovimientos_ah_ga();
  }
}

export class Oficial_ah_ga extends PiezaBase_ah_ga {
  constructor(filaPosicion_ah_ga, columnaPosicion_ah_ga) {
    super('oficial', filaPosicion_ah_ga, columnaPosicion_ah_ga);
    this.estrategiaMovimiento = new EstrategiaMovimientoOficial_ah_ga(this);
  }

  calcularMovimientosValidos_ah_ga(tableroJuego_ah_ga) {
    this.estrategiaMovimiento.tablero = tableroJuego_ah_ga;
    return this.estrategiaMovimiento.calcularMovimientos_ah_ga();
  }
}

/* Factory para creación de piezas */
export class PiezaFactory_ah_ga {
  static crearPieza_ah_ga(tipo, fila, columna) {
    switch (tipo) {
      case 'soldado':
        return new Soldado_ah_ga(fila, columna);
      case 'oficial':
        return new Oficial_ah_ga(fila, columna);
      default:
        throw new Error(`Tipo de pieza no válido: ${tipo}`);
    }
  }
}