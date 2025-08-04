// Importar funciones de Firebase para cupones
import {
  obtenerCuponesUsuario_ahga,
  validarCuponFirebase_ahga,
  marcarCuponUsado_ahga,
} from "../firebase/services/firestore.service.js";
import { auth_ahga } from "../firebase/services/index.js";

// Módulo para manejo de cupones y descuentos
class ServicioCupones_ahga {
  constructor() {
    this.cuponAplicado_ahga = null;
    this.cuponesUsuario_ahga = [];
    this.usuarioActual_ahga = null;

    // Escuchar cambios en el estado de autenticación
    auth_ahga.onAuthStateChanged((user) => {
      this.usuarioActual_ahga = user;
      if (user) {
        this.cargarCuponesUsuario_ahga();
      } else {
        this.cuponesUsuario_ahga = [];
        this.cuponAplicado_ahga = null;
      }
    });
  }

  // Cargar cupones del usuario desde Firebase
  async cargarCuponesUsuario_ahga() {
    if (!this.usuarioActual_ahga) {
      this.cuponesUsuario_ahga = [];
      return;
    }

    try {
      this.cuponesUsuario_ahga = await obtenerCuponesUsuario_ahga(
        this.usuarioActual_ahga.uid
      );
      console.log(
        `Cupones cargados para el usuario: ${this.cuponesUsuario_ahga.length}`
      );
    } catch (error) {
      console.error("Error al cargar cupones del usuario:", error);
      this.cuponesUsuario_ahga = [];
    }
  }

  // Función para validar un cupón
  async validarCupon_ahga(codigo_ahga, montoTotal_ahga = 0) {
    console.log(`Validando cupón: ${codigo_ahga}`);

    if (!this.usuarioActual_ahga) {
      return {
        valido: false,
        mensaje: "Debe iniciar sesión para usar cupones",
      };
    }

    try {
      // Validar cupón en Firebase
      const cupon_ahga = await validarCuponFirebase_ahga(
        codigo_ahga,
        this.usuarioActual_ahga.uid
      );

      if (!cupon_ahga) {
        return {
          valido: false,
          mensaje: "Cupón no válido, expirado o ya usado",
        };
      }

      // Verificar monto mínimo (si aplica)
      if (cupon_ahga.montoMinimo && montoTotal_ahga < cupon_ahga.montoMinimo) {
        return {
          valido: false,
          mensaje: `El monto mínimo para este cupón es $${cupon_ahga.montoMinimo}`,
        };
      }

      return {
        valido: true,
        cupon: cupon_ahga,
        mensaje: "Cupón válido",
      };
    } catch (error) {
      console.error("Error al validar cupón:", error);
      return {
        valido: false,
        mensaje: "Error al validar el cupón",
      };
    }
  }

  // Función para aplicar un cupón
  async aplicarCupon_ahga(codigo_ahga, montoTotal_ahga, items_ahga = []) {
    const validacion_ahga = await this.validarCupon_ahga(
      codigo_ahga,
      montoTotal_ahga
    );

    if (!validacion_ahga.valido) {
      return {
        aplicado: false,
        mensaje: validacion_ahga.mensaje,
        descuento: 0,
        montoFinal: montoTotal_ahga,
      };
    }

    const cupon_ahga = validacion_ahga.cupon;
    let descuento_ahga = 0;
    let montoAplicable_ahga = montoTotal_ahga;

    // Calcular descuento (multiplicación directa)
    descuento_ahga = montoAplicable_ahga * cupon_ahga.descuento;

    const montoFinal_ahga = Math.max(0, montoTotal_ahga - descuento_ahga);

    this.cuponAplicado_ahga = {
      ...cupon_ahga,
      descuentoAplicado: descuento_ahga,
    };

    console.log(
      `Cupón ${codigo_ahga} aplicado. Descuento: $${descuento_ahga.toFixed(2)}`
    );

    return {
      aplicado: true,
      mensaje: `Cupón aplicado: ${cupon_ahga.descripcion}`,
      descuento: descuento_ahga,
      montoFinal: montoFinal_ahga,
      cupon: cupon_ahga,
    };
  }

  // Función para remover cupón aplicado
  removerCupon_ahga() {
    const cuponAnterior_ahga = this.cuponAplicado_ahga;
    this.cuponAplicado_ahga = null;

    return {
      removido: true,
      mensaje: cuponAnterior_ahga
        ? `Cupón ${cuponAnterior_ahga.codigo} removido`
        : "No había cupón aplicado",
    };
  }

  // Función para confirmar uso del cupón (al completar compra)
  async confirmarUsoCupon_ahga() {
    if (this.cuponAplicado_ahga) {
      try {
        await marcarCuponUsado_ahga(this.cuponAplicado_ahga.id);
        console.log(
          `Uso confirmado para cupón ${this.cuponAplicado_ahga.codigo}`
        );

        // Recargar cupones del usuario para reflejar el cambio
        await this.cargarCuponesUsuario_ahga();

        // Limpiar cupón aplicado
        this.cuponAplicado_ahga = null;
      } catch (error) {
        console.error("Error al confirmar uso del cupón:", error);
      }
    }
  }

  // Función para obtener cupones disponibles
  async obtenerCuponesDisponibles_ahga() {
    if (!this.usuarioActual_ahga) {
      return [];
    }

    // Recargar cupones del usuario para asegurar datos actualizados
    await this.cargarCuponesUsuario_ahga();

    return this.cuponesUsuario_ahga;
  }

  // Getters
  obtenerCuponAplicado_ahga() {
    return this.cuponAplicado_ahga;
  }

  obtenerTodosLosCupones_ahga() {
    return this.cuponesUsuario_ahga;
  }

  tieneCuponAplicado_ahga() {
    return this.cuponAplicado_ahga !== null;
  }
}

export default ServicioCupones_ahga;
