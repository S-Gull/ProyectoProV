// piezas.js

/* Clase base abstracta para todas las piezas */
class PiezaBase_ahga {
  constructor(tipoPieza_ahga, filaPosicion_ahga, columnaPosicion_ahga) {
    if (new.target === PiezaBase_ahga) {
      throw new Error("No se puede instanciar PiezaBase_ahga directamente");
    }
    this.tipoPieza_ahga = tipoPieza_ahga;
    this.filaPosicion_ahga = filaPosicion_ahga;
    this.columnaPosicion_ahga = columnaPosicion_ahga;
    this.estaSeleccionada_ahga = false;
    this.estaSobre_ahga = false;
  }

  moverA_ahga(nuevaFila_ahga, nuevaColumna_ahga) {
    this.filaPosicion_ahga = nuevaFila_ahga;
    this.columnaPosicion_ahga = nuevaColumna_ahga;
  }

  calcularMovimientosValidos_ahga(tableroJuego_ahga) {
    throw new Error("Método abstracto debe ser implementado por subclases");
  }
}

/* Helper para validaciones de movimiento */
class ValidadorMovimiento_ahga {
  static esCasillaValida_ahga(tablero_ahga, fila_ahga, columna_ahga) {
    return tablero_ahga.esCasillaValida_ahga(fila_ahga, columna_ahga);
  }

  static esCasillaOcupada_ahga(tablero_ahga, fila_ahga, columna_ahga) {
    return !!tablero_ahga.obtenerCasilla_ahga(fila_ahga, columna_ahga)
      .pieza_ahga;
  }

  static puedeMoverDiagonal_ahga(tablero_ahga, fila_ahga, columna_ahga) {
    return tablero_ahga.puedeMoverseDiagonal_ahga(fila_ahga, columna_ahga);
  }
}

/* Estrategia de movimiento para soldados */
class EstrategiaMovimientoSoldado_ahga {
  constructor(pieza_ahga, tablero_ahga) {
    this.pieza_ahga = pieza_ahga;
    this.tablero_ahga = tablero_ahga;
  }

  obtenerDireccionesBase_ahga() {
    return [
      [-1, 0], // Arriba
      [1, 0], // Abajo
      [0, -1], // Izquierda
      [0, 1], // Derecha
    ];
  }

  obtenerDireccionesDiagonales_ahga() {
    return [
      [-1, -1], // Arriba-Izquierda
      [-1, 1], // Arriba-Derecha
      [1, -1], // Abajo-Izquierda
      [1, 1], // Abajo-Derecha
    ];
  }

  calcularMovimientos_ahga() {
    const direcciones_ahga = this.obtenerDireccionesBase_ahga();
    if (
      ValidadorMovimiento_ahga.puedeMoverDiagonal_ahga(
        this.tablero_ahga,
        this.pieza_ahga.filaPosicion_ahga,
        this.pieza_ahga.columnaPosicion_ahga
      )
    ) {
      direcciones_ahga.push(...this.obtenerDireccionesDiagonales_ahga());
    }

    return direcciones_ahga
      .map(([df_ahga, dc_ahga]) => ({
        fila_ahga: this.pieza_ahga.filaPosicion_ahga + df_ahga,
        columna_ahga: this.pieza_ahga.columnaPosicion_ahga + dc_ahga,
        deltaFila_ahga: df_ahga,
      }))
      .filter(({ fila_ahga, columna_ahga, deltaFila_ahga }) =>
        this.esMovimientoValido_ahga(fila_ahga, columna_ahga, deltaFila_ahga)
      )
      .map(({ fila_ahga, columna_ahga }) => ({
        fila_ahga: fila_ahga,
        columna_ahga: columna_ahga,
        esCaptura_ahga: false,
      }));
  }

  esMovimientoValido_ahga(fila_ahga, columna_ahga, deltaFila_ahga) {
    if (
      !ValidadorMovimiento_ahga.esCasillaValida_ahga(
        this.tablero_ahga,
        fila_ahga,
        columna_ahga
      ) ||
      ValidadorMovimiento_ahga.esCasillaOcupada_ahga(
        this.tablero_ahga,
        fila_ahga,
        columna_ahga
      )
    ) {
      return false;
    }

    const enFortaleza_ahga = this.tablero_ahga.esCasillaFortaleza_ahga(
      this.pieza_ahga.filaPosicion_ahga,
      this.pieza_ahga.columnaPosicion_ahga
    );

    if (!enFortaleza_ahga) {
      return (
        deltaFila_ahga <= 0 ||
        (deltaFila_ahga === 0 && fila_ahga <= this.pieza_ahga.filaPosicion_ahga)
      );
    }
    return this.tablero_ahga.esCasillaFortaleza_ahga(fila_ahga, columna_ahga);
  }
}

/* Estrategia de movimiento para oficiales */
class EstrategiaMovimientoOficial_ahga {
  constructor(pieza_ahga, tablero_ahga) {
    this.pieza_ahga = pieza_ahga;
    this.tablero_ahga = tablero_ahga;
  }

  calcularMovimientos_ahga() {
    const capturas_ahga = this.calcularCapturas_ahga();
    return capturas_ahga.length > 0
      ? capturas_ahga
      : this.calcularMovimientosNormales_ahga();
  }

  calcularMovimientosNormales_ahga() {
    const direcciones_ahga = this.obtenerDirecciones_ahga();
    const movimientos_ahga = [];

    for (const [df_ahga, dc_ahga] of direcciones_ahga) {
      const fila_ahga = this.pieza_ahga.filaPosicion_ahga + df_ahga;
      const columna_ahga = this.pieza_ahga.columnaPosicion_ahga + dc_ahga;

      if (
        ValidadorMovimiento_ahga.esCasillaValida_ahga(
          this.tablero_ahga,
          fila_ahga,
          columna_ahga
        ) &&
        !ValidadorMovimiento_ahga.esCasillaOcupada_ahga(
          this.tablero_ahga,
          fila_ahga,
          columna_ahga
        )
      ) {
        movimientos_ahga.push({
          fila_ahga: fila_ahga,
          columna_ahga: columna_ahga,
          esCaptura_ahga: false,
        });
      }
    }
    return movimientos_ahga;
  }

  calcularCapturas_ahga() {
    const capturas_ahga = [];
    this.buscarSaltosCaptura_ahga(
      this.pieza_ahga.filaPosicion_ahga,
      this.pieza_ahga.columnaPosicion_ahga,
      new Set(),
      [],
      capturas_ahga
    );
    return capturas_ahga;
  }

  obtenerDirecciones_ahga() {
    let direcciones_ahga = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    if (
      ValidadorMovimiento_ahga.puedeMoverDiagonal_ahga(
        this.tablero_ahga,
        this.pieza_ahga.filaPosicion_ahga,
        this.pieza_ahga.columnaPosicion_ahga
      )
    ) {
      direcciones_ahga.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }
    return direcciones_ahga;
  }

  buscarSaltosCaptura_ahga(
    filaActual_ahga,
    columnaActual_ahga,
    visitadas_ahga,
    capturadas_ahga,
    resultado_ahga
  ) {
    for (const [df_ahga, dc_ahga] of this.obtenerDirecciones_ahga()) {
      const filaIntermedia_ahga = filaActual_ahga + df_ahga;
      const columnaIntermedia_ahga = columnaActual_ahga + dc_ahga;
      const filaDestino_ahga = filaActual_ahga + 2 * df_ahga;
      const columnaDestino_ahga = columnaActual_ahga + 2 * dc_ahga;

      if (
        this.esSaltoValido_ahga(
          filaIntermedia_ahga,
          columnaIntermedia_ahga,
          filaDestino_ahga,
          columnaDestino_ahga,
          visitadas_ahga,
          capturadas_ahga
        )
      ) {
        const nuevasCapturas_ahga = [
          ...capturadas_ahga,
          { fila: filaIntermedia_ahga, columna: columnaIntermedia_ahga },
        ];
        visitadas_ahga.add(`${filaDestino_ahga},${columnaDestino_ahga}`);

        resultado_ahga.push({
          fila_ahga: filaDestino_ahga,
          columna_ahga: columnaDestino_ahga,
          esCaptura_ahga: true,
          capturada_ahga: {
            fila: filaIntermedia_ahga,
            columna: columnaIntermedia_ahga,
          },
        });

        this.buscarSaltosCaptura_ahga(
          filaDestino_ahga,
          columnaDestino_ahga,
          visitadas_ahga,
          nuevasCapturas_ahga,
          resultado_ahga
        );
      }
    }
  }

  esSaltoValido_ahga(
    filaIntermedia_ahga,
    columnaIntermedia_ahga,
    filaDestino_ahga,
    columnaDestino_ahga,
    visitadas_ahga,
    capturadas_ahga
  ) {
    // Validación completa del salto
    if (
      !ValidadorMovimiento_ahga.esCasillaValida_ahga(
        this.tablero_ahga,
        filaIntermedia_ahga,
        columnaIntermedia_ahga
      ) ||
      !ValidadorMovimiento_ahga.esCasillaValida_ahga(
        this.tablero_ahga,
        filaDestino_ahga,
        columnaDestino_ahga
      ) ||
      visitadas_ahga.has(`${filaDestino_ahga},${columnaDestino_ahga}`)
    ) {
      return false;
    }

    const casillaIntermedia_ahga = this.tablero_ahga.obtenerCasilla_ahga(
      filaIntermedia_ahga,
      columnaIntermedia_ahga
    );
    const casillaDestino_ahga = this.tablero_ahga.obtenerCasilla_ahga(
      filaDestino_ahga,
      columnaDestino_ahga
    );

    const piezaIntermedia_ahga = casillaIntermedia_ahga.pieza_ahga;
    const piezaYaCapturada_ahga = capturadas_ahga.some(
      (p_ahga) =>
        p_ahga.fila === filaIntermedia_ahga &&
        p_ahga.columna === columnaIntermedia_ahga
    );

    return (
      piezaIntermedia_ahga &&
      piezaIntermedia_ahga.tipoPieza_ahga === "soldado" &&
      !casillaDestino_ahga.pieza_ahga &&
      !piezaYaCapturada_ahga
    );
  }
}

/* Clases concretas para cada tipo de pieza */
export class Soldado_ahga extends PiezaBase_ahga {
  constructor(filaPosicion_ahga, columnaPosicion_ahga) {
    super("soldado", filaPosicion_ahga, columnaPosicion_ahga);
    this.estrategiaMovimiento_ahga = new EstrategiaMovimientoSoldado_ahga(this);
  }

  calcularMovimientosValidos_ahga(tableroJuego_ahga) {
    this.estrategiaMovimiento_ahga.tablero_ahga = tableroJuego_ahga;
    return this.estrategiaMovimiento_ahga.calcularMovimientos_ahga();
  }
}

export class Oficial_ahga extends PiezaBase_ahga {
  constructor(filaPosicion_ahga, columnaPosicion_ahga) {
    super("oficial", filaPosicion_ahga, columnaPosicion_ahga);
    this.estrategiaMovimiento_ahga = new EstrategiaMovimientoOficial_ahga(this);
  }

  calcularMovimientosValidos_ahga(tableroJuego_ahga) {
    this.estrategiaMovimiento_ahga.tablero_ahga = tableroJuego_ahga;
    return this.estrategiaMovimiento_ahga.calcularMovimientos_ahga();
  }
}

/* Factory para creación de piezas */
export class PiezaFactory_ahga {
  static crearPieza_ahga(tipo_ahga, fila_ahga, columna_ahga) {
    switch (tipo_ahga) {
      case "soldado":
        return new Soldado_ahga(fila_ahga, columna_ahga);
      case "oficial":
        return new Oficial_ahga(fila_ahga, columna_ahga);
      default:
        throw new Error(`Tipo de pieza no válido: ${tipo_ahga}`);
    }
  }
}
