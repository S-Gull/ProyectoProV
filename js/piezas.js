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
  static esCasillaValida_ah_ga(tablero_ah_ga, fila_ah_ga, columna_ah_ga) {
    return tablero_ah_ga.esCasillaValida_ah_ga(fila_ah_ga, columna_ah_ga);
  }

  static esCasillaOcupada_ah_ga(tablero_ah_ga, fila_ah_ga, columna_ah_ga) {
    return !!tablero_ah_ga.obtenerCasilla_ah_ga(fila_ah_ga, columna_ah_ga).pieza_ah_ga;
  }

  static puedeMoverDiagonal_ah_ga(tablero_ah_ga, fila_ah_ga, columna_ah_ga) {
    return tablero_ah_ga.puedeMoverseDiagonal_ah_ga(fila_ah_ga, columna_ah_ga);
  }
}

/* Estrategia de movimiento para soldados */
class EstrategiaMovimientoSoldado_ah_ga {
  constructor(pieza_ah_ga, tablero_ah_ga) {
    this.pieza_ah_ga = pieza_ah_ga;
    this.tablero_ah_ga = tablero_ah_ga;
  }

  obtenerDireccionesBase_ah_ga() {
    return [
      [-1, 0], // Arriba
      [1, 0],  // Abajo
      [0, -1], // Izquierda
      [0, 1]  // Derecha
    ];
  }

  obtenerDireccionesDiagonales_ah_ga() {
    return [
      [-1, -1], // Arriba-Izquierda
      [-1, 1],  // Arriba-Derecha
      [1, -1],  // Abajo-Izquierda
      [1, 1]   // Abajo-Derecha
    ];
  }

  calcularMovimientos_ah_ga() {
    const direcciones_ah_ga = this.obtenerDireccionesBase_ah_ga();
    if (ValidadorMovimiento_ah_ga.puedeMoverDiagonal_ah_ga(
      this.tablero_ah_ga,
      this.pieza_ah_ga.filaPosicion_ah_ga,
      this.pieza_ah_ga.columnaPosicion_ah_ga
    )) {
      direcciones_ah_ga.push(...this.obtenerDireccionesDiagonales_ah_ga());
    }

    return direcciones_ah_ga
      .map(([df_ah_ga, dc_ah_ga]) => ({
        fila_ah_ga: this.pieza_ah_ga.filaPosicion_ah_ga + df_ah_ga,
        columna_ah_ga: this.pieza_ah_ga.columnaPosicion_ah_ga + dc_ah_ga,
        deltaFila_ah_ga: df_ah_ga
      }))
      .filter(({ fila_ah_ga, columna_ah_ga, deltaFila_ah_ga }) =>
        this.esMovimientoValido_ah_ga(fila_ah_ga, columna_ah_ga, deltaFila_ah_ga))
      .map(({ fila_ah_ga, columna_ah_ga }) => ({
        fila_ah_ga: fila_ah_ga,
        columna_ah_ga: columna_ah_ga,
        esCaptura_ah_ga: false
      }));
  }

  esMovimientoValido_ah_ga(fila_ah_ga, columna_ah_ga, deltaFila_ah_ga) {
    if (!ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero_ah_ga, fila_ah_ga, columna_ah_ga) ||
      ValidadorMovimiento_ah_ga.esCasillaOcupada_ah_ga(this.tablero_ah_ga, fila_ah_ga, columna_ah_ga)) {
      return false;
    }

    const enFortaleza_ah_ga = this.tablero_ah_ga.esCasillaFortaleza_ah_ga(
      this.pieza_ah_ga.filaPosicion_ah_ga,
      this.pieza_ah_ga.columnaPosicion_ah_ga
    );

    if (!enFortaleza_ah_ga) {
      return deltaFila_ah_ga <= 0 ||
        (deltaFila_ah_ga === 0 && fila_ah_ga <= this.pieza_ah_ga.filaPosicion_ah_ga);
    }
    return this.tablero_ah_ga.esCasillaFortaleza_ah_ga(fila_ah_ga, columna_ah_ga);
  }
}

/* Estrategia de movimiento para oficiales */
class EstrategiaMovimientoOficial_ah_ga {
  constructor(pieza_ah_ga, tablero_ah_ga) {
    this.pieza_ah_ga = pieza_ah_ga;
    this.tablero_ah_ga = tablero_ah_ga;
  }

  calcularMovimientos_ah_ga() {
    const capturas_ah_ga = this.calcularCapturas_ah_ga();
    return capturas_ah_ga.length > 0 ? capturas_ah_ga : this.calcularMovimientosNormales_ah_ga();
  }

  calcularMovimientosNormales_ah_ga() {
    const direcciones_ah_ga = this.obtenerDirecciones_ah_ga();
    const movimientos_ah_ga = [];

    for (const [df_ah_ga, dc_ah_ga] of direcciones_ah_ga) {
      const fila_ah_ga = this.pieza_ah_ga.filaPosicion_ah_ga + df_ah_ga;
      const columna_ah_ga = this.pieza_ah_ga.columnaPosicion_ah_ga + dc_ah_ga;

      if (ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero_ah_ga, fila_ah_ga, columna_ah_ga) &&
        !ValidadorMovimiento_ah_ga.esCasillaOcupada_ah_ga(this.tablero_ah_ga, fila_ah_ga, columna_ah_ga)) {
        movimientos_ah_ga.push({
          fila_ah_ga: fila_ah_ga,
          columna_ah_ga: columna_ah_ga,
          esCaptura_ah_ga: false
        });
      }
    }
    return movimientos_ah_ga;
  }

  calcularCapturas_ah_ga() {
    const capturas_ah_ga = [];
    this.buscarSaltosCaptura_ah_ga(
      this.pieza_ah_ga.filaPosicion_ah_ga,
      this.pieza_ah_ga.columnaPosicion_ah_ga,
      new Set(),
      [],
      capturas_ah_ga
    );
    return capturas_ah_ga;
  }

  obtenerDirecciones_ah_ga() {
    let direcciones_ah_ga = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    if (ValidadorMovimiento_ah_ga.puedeMoverDiagonal_ah_ga(
      this.tablero_ah_ga,
      this.pieza_ah_ga.filaPosicion_ah_ga,
      this.pieza_ah_ga.columnaPosicion_ah_ga
    )) {
      direcciones_ah_ga.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }
    return direcciones_ah_ga;
  }

  buscarSaltosCaptura_ah_ga(filaActual_ah_ga, columnaActual_ah_ga, visitadas_ah_ga, capturadas_ah_ga, resultado_ah_ga) {
    for (const [df_ah_ga, dc_ah_ga] of this.obtenerDirecciones_ah_ga()) {
      const filaIntermedia_ah_ga = filaActual_ah_ga + df_ah_ga;
      const columnaIntermedia_ah_ga = columnaActual_ah_ga + dc_ah_ga;
      const filaDestino_ah_ga = filaActual_ah_ga + 2 * df_ah_ga;
      const columnaDestino_ah_ga = columnaActual_ah_ga + 2 * dc_ah_ga;

      if (this.esSaltoValido_ah_ga(
        filaIntermedia_ah_ga, columnaIntermedia_ah_ga,
        filaDestino_ah_ga, columnaDestino_ah_ga,
        visitadas_ah_ga, capturadas_ah_ga
      )) {
        const nuevasCapturas_ah_ga = [...capturadas_ah_ga,
        { fila: filaIntermedia_ah_ga, columna: columnaIntermedia_ah_ga }];
        visitadas_ah_ga.add(`${filaDestino_ah_ga},${columnaDestino_ah_ga}`);

        resultado_ah_ga.push({
          fila_ah_ga: filaDestino_ah_ga,
          columna_ah_ga: columnaDestino_ah_ga,
          esCaptura_ah_ga: true,
          capturada_ah_ga: { fila: filaIntermedia_ah_ga, columna: columnaIntermedia_ah_ga }
        });

        this.buscarSaltosCaptura_ah_ga(
          filaDestino_ah_ga, columnaDestino_ah_ga,
          visitadas_ah_ga, nuevasCapturas_ah_ga, resultado_ah_ga
        );
      }
    }
  }

  esSaltoValido_ah_ga(filaIntermedia_ah_ga, columnaIntermedia_ah_ga, filaDestino_ah_ga, columnaDestino_ah_ga, visitadas_ah_ga, capturadas_ah_ga) {
    // Validación completa del salto
    if (!ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero_ah_ga, filaIntermedia_ah_ga, columnaIntermedia_ah_ga) ||
      !ValidadorMovimiento_ah_ga.esCasillaValida_ah_ga(this.tablero_ah_ga, filaDestino_ah_ga, columnaDestino_ah_ga) ||
      visitadas_ah_ga.has(`${filaDestino_ah_ga},${columnaDestino_ah_ga}`)) {
      return false;
    }

    const casillaIntermedia_ah_ga = this.tablero_ah_ga.obtenerCasilla_ah_ga(filaIntermedia_ah_ga, columnaIntermedia_ah_ga);
    const casillaDestino_ah_ga = this.tablero_ah_ga.obtenerCasilla_ah_ga(filaDestino_ah_ga, columnaDestino_ah_ga);

    const piezaIntermedia_ah_ga = casillaIntermedia_ah_ga.pieza_ah_ga;
    const piezaYaCapturada_ah_ga = capturadas_ah_ga.some(p_ah_ga =>
      p_ah_ga.fila === filaIntermedia_ah_ga && p_ah_ga.columna === columnaIntermedia_ah_ga);

    return piezaIntermedia_ah_ga &&
      piezaIntermedia_ah_ga.tipoPieza_ah_ga === 'soldado' &&
      !casillaDestino_ah_ga.pieza_ah_ga &&
      !piezaYaCapturada_ah_ga;
  }
}

/* Clases concretas para cada tipo de pieza */
export class Soldado_ah_ga extends PiezaBase_ah_ga {
  constructor(filaPosicion_ah_ga, columnaPosicion_ah_ga) {
    super('soldado', filaPosicion_ah_ga, columnaPosicion_ah_ga);
    this.estrategiaMovimiento_ah_ga = new EstrategiaMovimientoSoldado_ah_ga(this);
  }

  calcularMovimientosValidos_ah_ga(tableroJuego_ah_ga) {
    this.estrategiaMovimiento_ah_ga.tablero_ah_ga = tableroJuego_ah_ga;
    return this.estrategiaMovimiento_ah_ga.calcularMovimientos_ah_ga();
  }
}

export class Oficial_ah_ga extends PiezaBase_ah_ga {
  constructor(filaPosicion_ah_ga, columnaPosicion_ah_ga) {
    super('oficial', filaPosicion_ah_ga, columnaPosicion_ah_ga);
    this.estrategiaMovimiento_ah_ga = new EstrategiaMovimientoOficial_ah_ga(this);
  }

  calcularMovimientosValidos_ah_ga(tableroJuego_ah_ga) {
    this.estrategiaMovimiento_ah_ga.tablero_ah_ga = tableroJuego_ah_ga;
    return this.estrategiaMovimiento_ah_ga.calcularMovimientos_ah_ga();
  }
}

/* Factory para creación de piezas */
export class PiezaFactory_ah_ga {
  static crearPieza_ah_ga(tipo_ah_ga, fila_ah_ga, columna_ah_ga) {
    switch (tipo_ah_ga) {
      case 'soldado':
        return new Soldado_ah_ga(fila_ah_ga, columna_ah_ga);
      case 'oficial':
        return new Oficial_ah_ga(fila_ah_ga, columna_ah_ga);
      default:
        throw new Error(`Tipo de pieza no válido: ${tipo_ah_ga}`);
    }
  }
}