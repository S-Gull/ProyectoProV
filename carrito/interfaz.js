// Módulo para manejo de la interfaz de usuario
class ServicioInterfaz_ahga {
  constructor(
    servicioCarrito_ahga,
    servicioProductos_ahga,
    servicioCupones_ahga
  ) {
    this.servicioCarrito_ahga = servicioCarrito_ahga;
    this.servicioProductos_ahga = servicioProductos_ahga;
    this.servicioCupones_ahga = servicioCupones_ahga;
    this.inicializarElementosDOM_ahga();
    this.configurarEventListeners_ahga();
  }

  inicializarElementosDOM_ahga() {
    // Referencias DOM
    this.contenedorProductos_ahga = document.getElementById("products");
    this.contenedorItemsCarrito_ahga = document.getElementById("cart-items");
    this.elementoContadorCarrito_ahga = document.getElementById("cart-count");
    this.elementoTotalCarrito_ahga = document.getElementById("cart-total");
    this.modalCarrito_ahga = document.getElementById("cart-modal");
    this.botonCarrito_ahga = document.getElementById("cart-button");
    this.botonCerrarCarrito_ahga = document.getElementById("close-cart");
    this.botonCheckout_ahga = document.getElementById("checkout");
    this.modalConfirmacion_ahga = document.getElementById("modal-confirmacion");
    this.detallesCompra_ahga = document.getElementById("detalles-compra");
    this.totalConfirmacion_ahga = document.getElementById("total-confirmacion");
    this.botonConfirmarCompra_ahga =
      document.getElementById("confirmar-compra");
    this.modalCarritoVacio_ahga = document.getElementById(
      "modal-carrito-vacio"
    );
    this.botonCerrarCarritoVacio_ahga = document.getElementById(
      "cerrar-carrito-vacio"
    );

    // Elementos para métodos de pago
    this.modalMetodoPago_ahga = document.getElementById("modal-metodo-pago");
    this.botonCerrarMetodoPago_ahga =
      document.getElementById("cerrar-metodo-pago");
    this.botonPagoMovil_ahga = document.getElementById("btn-pago-movil");
    this.botonZelle_ahga = document.getElementById("btn-zelle");

    // Modal Pago Móvil
    this.modalPagoMovil_ahga = document.getElementById("modal-pago-movil");
    this.botonCerrarPagoMovil_ahga =
      document.getElementById("cerrar-pago-movil");
    this.formPagoMovil_ahga = document.getElementById("form-pago-movil");
    this.montoMovil_ahga = document.getElementById("monto-movil");
    this.fechaMovil_ahga = document.getElementById("fecha-movil");
    this.metodoPagoMovil_ahga = document.getElementById("metodo-pago-movil");

    // Modal Zelle
    this.modalZelle_ahga = document.getElementById("modal-zelle");
    this.botonCerrarZelle_ahga = document.getElementById("cerrar-zelle");
    this.formZelle_ahga = document.getElementById("form-zelle");
    this.montoZelle_ahga = document.getElementById("monto-zelle");
    this.metodoPagoZelle_ahga = document.getElementById("metodo-pago-zelle");

    // Modal Factura
    this.modalFactura_ahga = document.getElementById("modal-factura");
    this.botonCerrarFactura_ahga = document.getElementById("cerrar-factura");
    this.botonDescargarFactura_ahga =
      document.getElementById("descargar-factura");
    this.contenidoFactura_ahga = document.getElementById("contenido-factura");

    // Elementos para cupones
    this.inputCupon_ahga = document.getElementById("input-cupon");
    this.botonAplicarCupon_ahga = document.getElementById("aplicar-cupon");
    this.infoCupon_ahga = document.getElementById("info-cupon");
    this.subtotalCarrito_ahga = document.getElementById("cart-subtotal");
    this.descuentoCarrito_ahga = document.getElementById("cart-descuento");
    this.contenedorDescuento_ahga = document.getElementById(
      "descuento-container"
    );

    console.log("Referencias DOM obtenidas");
  }

  configurarEventListeners_ahga() {
    // Event Listeners principales
    if (this.botonCarrito_ahga) {
      this.botonCarrito_ahga.addEventListener("click", () => {
        console.log("Botón carrito clickeado, mostrando modal");
        this.mostrarModal_ahga(this.modalCarrito_ahga);
      });
    }

    if (this.botonCerrarCarrito_ahga) {
      this.botonCerrarCarrito_ahga.addEventListener("click", () => {
        console.log("Botón cerrar carrito clickeado, ocultando modal");
        this.ocultarModal_ahga(this.modalCarrito_ahga);
      });
    }

    if (this.botonCheckout_ahga) {
      this.botonCheckout_ahga.addEventListener("click", async () => {
        console.log("Botón checkout clickeado");
        
        // Verificar si el usuario está autenticado
        const usuarioAutenticado = await this.verificarAutenticacion_ahga();
        
        if (!usuarioAutenticado) {
          console.log("Usuario no autenticado, mostrando modal de login");
          this.mostrarModalLoginRequerido_ahga();
          return;
        }
        
        if (!this.servicioCarrito_ahga.estaVacio_ahga()) {
          console.log(
            "Carrito tiene items, mostrando selección de método de pago"
          );
          this.mostrarModal_ahga(this.modalMetodoPago_ahga);
        } else {
          console.log("Carrito vacío, mostrando advertencia");
          this.mostrarModal_ahga(this.modalCarritoVacio_ahga);
        }
      });
    }

    if (this.botonConfirmarCompra_ahga) {
      this.botonConfirmarCompra_ahga.addEventListener("click", async () => {
        console.log("Compra confirmada, procesando");
        await this.procesarCompra_ahga();
      });
    }

    if (this.botonCerrarCarritoVacio_ahga) {
      this.botonCerrarCarritoVacio_ahga.addEventListener("click", () => {
        console.log("Cerrando modal de carrito vacío");
        this.ocultarModal_ahga(this.modalCarritoVacio_ahga);
      });
    }

    // Botones del modal de factura
    if (this.botonCerrarFactura_ahga) {
      this.botonCerrarFactura_ahga.addEventListener("click", () => {
        this.ocultarModal_ahga(this.modalFactura_ahga);
      });
    }

    const botonAceptarFactura_ahga = document.getElementById("aceptar-factura");
    if (botonAceptarFactura_ahga) {
      botonAceptarFactura_ahga.addEventListener("click", () => {
        this.ocultarModal_ahga(this.modalFactura_ahga);
      });
    }

    // Event listeners para métodos de pago
    if (this.botonCerrarMetodoPago_ahga) {
      this.botonCerrarMetodoPago_ahga.addEventListener("click", () => {
        this.ocultarModal_ahga(this.modalMetodoPago_ahga);
      });
    }

    if (this.botonPagoMovil_ahga) {
      this.botonPagoMovil_ahga.addEventListener("click", () => {
        this.ocultarModal_ahga(this.modalMetodoPago_ahga);
        this.mostrarModalPagoMovil_ahga();
      });
    }

    if (this.botonZelle_ahga) {
      this.botonZelle_ahga.addEventListener("click", () => {
        this.ocultarModal_ahga(this.modalMetodoPago_ahga);
        this.mostrarModalZelle_ahga();
      });
    }

    // Event listeners para modal Pago Móvil
    if (this.botonCerrarPagoMovil_ahga) {
      this.botonCerrarPagoMovil_ahga.addEventListener("click", () => {
        this.ocultarModal_ahga(this.modalPagoMovil_ahga);
      });
    }

    if (this.formPagoMovil_ahga) {
      this.formPagoMovil_ahga.addEventListener("submit", async (e_ahga) => {
        e_ahga.preventDefault();
        await this.procesarPagoMovil_ahga();
      });
    }

    // Event listeners para modal Zelle
    if (this.botonCerrarZelle_ahga) {
      this.botonCerrarZelle_ahga.addEventListener("click", () => {
        this.ocultarModal_ahga(this.modalZelle_ahga);
      });
    }

    if (this.formZelle_ahga) {
      this.formZelle_ahga.addEventListener("submit", async (e_ahga) => {
        e_ahga.preventDefault();
        await this.procesarZelle_ahga();
      });
    }

    // Event listeners para cupones
    if (this.botonAplicarCupon_ahga) {
      this.botonAplicarCupon_ahga.addEventListener("click", async () => {
        await this.aplicarCupon_ahga();
      });
    }

    if (this.inputCupon_ahga) {
      this.inputCupon_ahga.addEventListener("keypress", async (e_ahga) => {
        if (e_ahga.key === "Enter") {
          await this.aplicarCupon_ahga();
        }
      });
    }

    // Cerrar modales al hacer clic fuera
    if (this.modalConfirmacion_ahga) {
      this.modalConfirmacion_ahga.addEventListener("click", (e_ahga) => {
        if (e_ahga.target === this.modalConfirmacion_ahga) {
          console.log("Clic fuera del modal de confirmación, cerrando");
          this.ocultarModal_ahga(this.modalConfirmacion_ahga);
        }
      });
    }

    if (this.modalCarritoVacio_ahga) {
      this.modalCarritoVacio_ahga.addEventListener("click", (e_ahga) => {
        if (e_ahga.target === this.modalCarritoVacio_ahga) {
          console.log("Clic fuera del modal de carrito vacío, cerrando");
          this.ocultarModal_ahga(this.modalCarritoVacio_ahga);
        }
      });
    }

    // Cerrar modales de pago al hacer clic fuera
    if (this.modalMetodoPago_ahga) {
      this.modalMetodoPago_ahga.addEventListener("click", (e_ahga) => {
        if (e_ahga.target === this.modalMetodoPago_ahga) {
          this.ocultarModal_ahga(this.modalMetodoPago_ahga);
        }
      });
    }

    if (this.modalPagoMovil_ahga) {
      this.modalPagoMovil_ahga.addEventListener("click", (e_ahga) => {
        if (e_ahga.target === this.modalPagoMovil_ahga) {
          this.ocultarModal_ahga(this.modalPagoMovil_ahga);
        }
      });
    }

    if (this.modalZelle_ahga) {
      this.modalZelle_ahga.addEventListener("click", (e_ahga) => {
        if (e_ahga.target === this.modalZelle_ahga) {
          this.ocultarModal_ahga(this.modalZelle_ahga);
        }
      });
    }

    // Cerrar modal de factura al hacer clic fuera
    if (this.modalFactura_ahga) {
      this.modalFactura_ahga.addEventListener("click", (e_ahga) => {
        if (e_ahga.target === this.modalFactura_ahga) {
          this.ocultarModal_ahga(this.modalFactura_ahga);
        }
      });
    }

    // Escuchar eventos de actualización del carrito para actualizar cupones y productos
    window.addEventListener("carritoActualizado", () => {
      this.actualizarInfoCupon_ahga();
      this.actualizarVistaProductos_ahga();
    });

    // Delegación de eventos para productos
    if (this.contenedorProductos_ahga) {
      this.contenedorProductos_ahga.addEventListener("click", (e_ahga) => {
        const botonAgregar_ahga = e_ahga.target.closest(".add-to-cart-btn");
        if (botonAgregar_ahga && !botonAgregar_ahga.disabled) {
          const tarjetaProducto_ahga = e_ahga.target.closest(".product-card");
          const idProducto_ahga = parseInt(tarjetaProducto_ahga.dataset.id);
          console.log(
            `Botón agregar clickeado para producto ID: ${idProducto_ahga}`
          );

          const producto_ahga =
            this.servicioProductos_ahga.buscarProductoPorId_ahga(
              idProducto_ahga
            );
          if (producto_ahga) {
            // Verificar stock considerando cantidad ya en carrito
            const itemEnCarrito_ahga = this.servicioCarrito_ahga
              .obtenerCarrito_ahga()
              .find((item) => item.id === idProducto_ahga);
            const cantidadEnCarrito_ahga = itemEnCarrito_ahga
              ? itemEnCarrito_ahga.cantidad
              : 0;
            const stockDisponible_ahga = producto_ahga.existencia;

            if (cantidadEnCarrito_ahga < stockDisponible_ahga) {
              this.servicioCarrito_ahga.agregarAlCarrito_ahga(producto_ahga);
            } else {
              mostrarNotificacion_ahga(
                `⚠️ Stock insuficiente. Solo quedan ${stockDisponible_ahga} unidades disponibles`
              );
            }
          }
        }
      });
    }

    // Delegación de eventos para el carrito
    if (this.contenedorItemsCarrito_ahga) {
      this.contenedorItemsCarrito_ahga.addEventListener("click", (e_ahga) => {
        const itemCarrito_ahga = e_ahga.target.closest(".cart-item");
        if (!itemCarrito_ahga) return;

        const idProducto_ahga = parseInt(itemCarrito_ahga.dataset.id);
        console.log(`Interacción con item del carrito ID: ${idProducto_ahga}`);

        if (e_ahga.target.closest(".increase-btn")) {
          console.log("Botón aumentar cantidad clickeado");

          // Verificar stock disponible antes de aumentar cantidad
          const producto_ahga =
            this.servicioProductos_ahga.buscarProductoPorId_ahga(
              idProducto_ahga
            );
          const itemCarrito_ahga = this.servicioCarrito_ahga
            .obtenerCarrito_ahga()
            .find((item) => item.id === idProducto_ahga);

          if (producto_ahga && itemCarrito_ahga) {
            const cantidadActualEnCarrito_ahga = itemCarrito_ahga.cantidad;
            const stockDisponible_ahga = producto_ahga.existencia;

            if (cantidadActualEnCarrito_ahga < stockDisponible_ahga) {
              this.servicioCarrito_ahga.aumentarCantidad_ahga(idProducto_ahga);
            } else {
              mostrarNotificacion_ahga(
                `⚠️ Stock insuficiente. Solo quedan ${stockDisponible_ahga} unidades disponibles`
              );
            }
          }
        } else if (e_ahga.target.closest(".decrease-btn")) {
          console.log("Botón disminuir cantidad clickeado");
          this.servicioCarrito_ahga.disminuirCantidad_ahga(idProducto_ahga);
        } else if (e_ahga.target.closest(".remove-btn")) {
          console.log("Botón eliminar clickeado");
          this.servicioCarrito_ahga.eliminarDelCarrito_ahga(idProducto_ahga);
        }

        // Actualizar información de cupón si hay uno aplicado
        this.actualizarInfoCupon_ahga();
      });
    }
  }

  // Función para mostrar el modal de confirmación
  mostrarModalConfirmacion_ahga() {
    console.log("Mostrando modal de confirmación de compra");
    const carrito_ahga = this.servicioCarrito_ahga.obtenerCarrito_ahga();
    const total_ahga = this.servicioCarrito_ahga.obtenerTotal_ahga();

    // Calcular descuento si hay cupón aplicado
    let descuento_ahga = 0;
    let totalFinal_ahga = total_ahga;

    if (this.servicioCupones_ahga.tieneCuponAplicado_ahga()) {
      const cuponAplicado_ahga =
        this.servicioCupones_ahga.obtenerCuponAplicado_ahga();
      descuento_ahga = cuponAplicado_ahga.descuentoAplicado;
      totalFinal_ahga = total_ahga - descuento_ahga;
    }

    this.detallesCompra_ahga.innerHTML = carrito_ahga
      .map(
        (item_ahga) => `
        <div class="flex items-start border-b border-[#454955]/30 pb-2">
          <img src="${item_ahga.img}" alt="${
          item_ahga.nombre
        }" class="w-12 h-12 object-cover rounded mr-3">
          <div class="flex-1">
            <h4 class="font-medium">${item_ahga.nombre}</h4>
            <p class="text-sm text-[#F3EFF5]/60">
              ${item_ahga.cantidad} x $${item_ahga.precio} = $${(
          item_ahga.cantidad * item_ahga.precio
        ).toFixed(2)}
            </p>
          </div>
        </div>
      `
      )
      .join("");

    // Agregar información de descuento si aplica
    if (descuento_ahga > 0) {
      this.detallesCompra_ahga.innerHTML += `
        <div class="border-t border-[#454955]/30 pt-2 mt-2">
          <div class="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>$${total_ahga.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-sm text-green-400">
            <span>Descuento:</span>
            <span>-$${descuento_ahga.toFixed(2)}</span>
          </div>
        </div>
      `;
    }

    console.log(
      `Total en modal de confirmación: $${totalFinal_ahga.toFixed(2)}`
    );
    this.totalConfirmacion_ahga.textContent = `$${totalFinal_ahga.toFixed(2)}`;
    this.mostrarModal_ahga(this.modalConfirmacion_ahga);
  }

  // Función para procesar la compra
  async procesarCompra_ahga() {
    const resultado_ahga = this.servicioCarrito_ahga.procesarCompra_ahga();
    if (resultado_ahga) {
      // Confirmar uso del cupón si hay uno aplicado
      await this.servicioCupones_ahga.confirmarUsoCupon_ahga();

      // Remover cupón aplicado
      this.servicioCupones_ahga.removerCupon_ahga();
      this.actualizarInfoCupon_ahga();

      // Actualizar stock desde la base de datos
      await this.servicioProductos_ahga.actualizarStockDesdeBD_ahga();

      // Actualizar vista de productos con el nuevo stock
      this.actualizarVistaProductos_ahga();

      this.ocultarModal_ahga(this.modalConfirmacion_ahga);
      this.ocultarModal_ahga(this.modalCarrito_ahga);
    }
  }

  // Función para mostrar modal de Pago Móvil
  mostrarModalPagoMovil_ahga() {
    const total_ahga = this.calcularTotalFinal_ahga();

    // Configurar valores por defecto
    if (this.montoMovil_ahga) {
      // Convertir USD a Bs (tasa de ejemplo: 1 USD = 125 Bs)
      const tasaCambio_ahga = 125;
      this.montoMovil_ahga.value = (total_ahga * tasaCambio_ahga).toFixed(2);
    }

    if (this.fechaMovil_ahga) {
      const hoy_ahga = new Date().toISOString().split("T")[0];
      this.fechaMovil_ahga.value = hoy_ahga;
    }

    if (this.metodoPagoMovil_ahga) {
      this.metodoPagoMovil_ahga.value = "pago-movil";
    }

    this.mostrarModal_ahga(this.modalPagoMovil_ahga);
  }

  // Función para mostrar modal de Zelle
  mostrarModalZelle_ahga() {
    const total_ahga = this.calcularTotalFinal_ahga();

    // Configurar valores por defecto
    if (this.montoZelle_ahga) {
      this.montoZelle_ahga.value = total_ahga.toFixed(2);
    }

    if (this.metodoPagoZelle_ahga) {
      this.metodoPagoZelle_ahga.value = "zelle";
    }

    this.mostrarModal_ahga(this.modalZelle_ahga);
  }

  // Función para calcular total final con descuentos
  calcularTotalFinal_ahga() {
    const total_ahga = this.servicioCarrito_ahga.obtenerTotal_ahga();
    let totalFinal_ahga = total_ahga;

    if (this.servicioCupones_ahga.tieneCuponAplicado_ahga()) {
      const cuponAplicado_ahga =
        this.servicioCupones_ahga.obtenerCuponAplicado_ahga();
      totalFinal_ahga = total_ahga - cuponAplicado_ahga.descuentoAplicado;
    }

    return totalFinal_ahga;
  }

  // Función para procesar pago móvil
  async procesarPagoMovil_ahga() {
    const formData_ahga = new FormData(this.formPagoMovil_ahga);
    const datosPago_ahga = {
      metodoPago: "Pago Móvil",
      nombre:
        formData_ahga.get("nombre-movil") ||
        document.getElementById("nombre-movil").value,
      direccion:
        formData_ahga.get("direccion-movil") ||
        document.getElementById("direccion-movil").value,
      telefono:
        formData_ahga.get("telefono-movil") ||
        document.getElementById("telefono-movil").value,
      referencia:
        formData_ahga.get("referencia-movil") ||
        document.getElementById("referencia-movil").value,
      telefonoEmisor:
        formData_ahga.get("telefono-emisor-movil") ||
        document.getElementById("telefono-emisor-movil").value,
      bancoEmisor:
        formData_ahga.get("banco-emisor-movil") ||
        document.getElementById("banco-emisor-movil").value,
      monto:
        formData_ahga.get("monto-movil") ||
        document.getElementById("monto-movil").value,
      fecha:
        formData_ahga.get("fecha-movil") ||
        document.getElementById("fecha-movil").value,
      cedula:
        formData_ahga.get("cedula-movil") ||
        document.getElementById("cedula-movil").value,
    };

    // Validar que todos los campos estén llenos
    const camposRequeridos_ahga = [
      "nombre",
      "direccion",
      "telefono",
      "referencia",
      "telefonoEmisor",
      "bancoEmisor",
      "monto",
      "fecha",
      "cedula",
    ];
    const camposVacios_ahga = camposRequeridos_ahga.filter(
      (campo_ahga) =>
        !datosPago_ahga[campo_ahga] || datosPago_ahga[campo_ahga].trim() === ""
    );

    if (camposVacios_ahga.length > 0) {
      mostrarNotificacion_ahga(
        "❌ Por favor, complete todos los campos requeridos"
      );
      return;
    }

    console.log("Datos de Pago Móvil:", datosPago_ahga);

    // Capturar datos del carrito antes de procesarlo
    const carritoParaFactura_ahga = [
      ...this.servicioCarrito_ahga.obtenerCarrito_ahga(),
    ];
    const totalParaFactura_ahga = this.servicioCarrito_ahga.obtenerTotal_ahga();
    const totalFinalParaFactura_ahga = this.calcularTotalFinal_ahga();

    // Procesar la compra
    await this.procesarCompra_ahga();

    // Cerrar modal de pago móvil
    this.ocultarModal_ahga(this.modalPagoMovil_ahga);

    // Mostrar factura con los datos capturados
    this.mostrarFactura_ahga(
      datosPago_ahga,
      carritoParaFactura_ahga,
      totalParaFactura_ahga,
      totalFinalParaFactura_ahga
    );

    mostrarNotificacion_ahga("✅ Pago Móvil procesado exitosamente");
  }

  // Función para procesar Zelle
  async procesarZelle_ahga() {
    const formData_ahga = new FormData(this.formZelle_ahga);
    const datosPago_ahga = {
      metodoPago: "Zelle",
      nombre:
        formData_ahga.get("nombre-zelle") ||
        document.getElementById("nombre-zelle").value,
      direccion:
        formData_ahga.get("direccion-zelle") ||
        document.getElementById("direccion-zelle").value,
      telefono:
        formData_ahga.get("telefono-zelle") ||
        document.getElementById("telefono-zelle").value,
      correoZelle:
        formData_ahga.get("correo-zelle") ||
        document.getElementById("correo-zelle").value,
      monto:
        formData_ahga.get("monto-zelle") ||
        document.getElementById("monto-zelle").value,
      titular:
        formData_ahga.get("titular-zelle") ||
        document.getElementById("titular-zelle").value,
      confirmacion:
        formData_ahga.get("confirmacion-zelle") ||
        document.getElementById("confirmacion-zelle").value,
    };

    // Validar que todos los campos estén llenos
    const camposRequeridos_ahga = [
      "nombre",
      "direccion",
      "telefono",
      "correoZelle",
      "monto",
      "titular",
      "confirmacion",
    ];
    const camposVacios_ahga = camposRequeridos_ahga.filter(
      (campo_ahga) =>
        !datosPago_ahga[campo_ahga] || datosPago_ahga[campo_ahga].trim() === ""
    );

    if (camposVacios_ahga.length > 0) {
      mostrarNotificacion_ahga(
        "❌ Por favor, complete todos los campos requeridos"
      );
      return;
    }

    console.log("Datos de Zelle:", datosPago_ahga);

    // Capturar datos del carrito antes de procesarlo
    const carritoParaFactura_ahga = [
      ...this.servicioCarrito_ahga.obtenerCarrito_ahga(),
    ];
    const totalParaFactura_ahga = this.servicioCarrito_ahga.obtenerTotal_ahga();
    const totalFinalParaFactura_ahga = this.calcularTotalFinal_ahga();

    // Procesar la compra
    await this.procesarCompra_ahga();

    // Cerrar modal de Zelle
    this.ocultarModal_ahga(this.modalZelle_ahga);

    // Mostrar factura con los datos capturados
    this.mostrarFactura_ahga(
      datosPago_ahga,
      carritoParaFactura_ahga,
      totalParaFactura_ahga,
      totalFinalParaFactura_ahga
    );

    mostrarNotificacion_ahga("✅ Pago Zelle procesado exitosamente");
  }

  // Función para aplicar cupón
  async aplicarCupon_ahga() {
    if (!this.inputCupon_ahga) return;

    const codigo_ahga = this.inputCupon_ahga.value.trim();
    if (!codigo_ahga) {
      mostrarNotificacion_ahga("Por favor ingresa un código de cupón");
      return;
    }

    const total_ahga = this.servicioCarrito_ahga.obtenerTotal_ahga();
    const carrito_ahga = this.servicioCarrito_ahga.obtenerCarrito_ahga();

    const resultado_ahga = await this.servicioCupones_ahga.aplicarCupon_ahga(
      codigo_ahga,
      total_ahga,
      carrito_ahga
    );

    if (resultado_ahga.aplicado) {
      mostrarNotificacion_ahga(resultado_ahga.mensaje);
      this.inputCupon_ahga.value = "";
      this.actualizarInfoCupon_ahga();
    } else {
      mostrarNotificacion_ahga(resultado_ahga.mensaje);
    }
  }

  // Función para actualizar información del cupón
  actualizarInfoCupon_ahga() {
    const total_ahga = this.servicioCarrito_ahga.obtenerTotal_ahga();

    // Actualizar subtotal
    if (this.subtotalCarrito_ahga) {
      this.subtotalCarrito_ahga.textContent = `$${total_ahga.toFixed(2)}`;
    }

    if (this.servicioCupones_ahga.tieneCuponAplicado_ahga()) {
      const cupon_ahga = this.servicioCupones_ahga.obtenerCuponAplicado_ahga();
      const totalFinal_ahga = total_ahga - cupon_ahga.descuentoAplicado;

      // Mostrar información del cupón aplicado
      if (this.infoCupon_ahga) {
        this.infoCupon_ahga.innerHTML = `
          <div class="flex justify-between items-center bg-green-500/20 border border-green-500 rounded p-2">
            <div class="flex items-center gap-2">
              <i class="ri-check-line text-green-400"></i>
              <span class="text-green-400 font-medium">${cupon_ahga.codigo}</span>
              <span class="text-[#F3EFF5]/80">aplicado</span>
            </div>
            <button id="remover-cupon" class="text-red-400 hover:text-red-500 p-1">
              <i class="ri-close-line"></i>
            </button>
          </div>
        `;
        this.infoCupon_ahga.classList.remove("hidden");

        // Event listener para remover cupón
        const botonRemover_ahga = document.getElementById("remover-cupon");
        if (botonRemover_ahga) {
          botonRemover_ahga.addEventListener("click", () => {
            const resultado_ahga =
              this.servicioCupones_ahga.removerCupon_ahga();
            mostrarNotificacion_ahga(resultado_ahga.mensaje);
            this.actualizarInfoCupon_ahga();
          });
        }
      }

      // Mostrar descuento
      if (this.contenedorDescuento_ahga && this.descuentoCarrito_ahga) {
        this.descuentoCarrito_ahga.textContent = `-$${cupon_ahga.descuentoAplicado.toFixed(
          2
        )}`;
        this.contenedorDescuento_ahga.classList.remove("hidden");
      }

      // Actualizar total final
      if (this.elementoTotalCarrito_ahga) {
        this.elementoTotalCarrito_ahga.textContent = `$${totalFinal_ahga.toFixed(
          2
        )}`;
      }
    } else {
      // Ocultar información del cupón
      if (this.infoCupon_ahga) {
        this.infoCupon_ahga.innerHTML = "";
        this.infoCupon_ahga.classList.add("hidden");
      }

      // Ocultar descuento
      if (this.contenedorDescuento_ahga) {
        this.contenedorDescuento_ahga.classList.add("hidden");
      }

      // Mostrar total original
      if (this.elementoTotalCarrito_ahga) {
        this.elementoTotalCarrito_ahga.textContent = `$${total_ahga.toFixed(
          2
        )}`;
      }
    }
  }

  // Funciones auxiliares para modales
  mostrarModal_ahga(modal_ahga) {
    if (modal_ahga) {
      modal_ahga.classList.remove("hidden");
    }
  }

  ocultarModal_ahga(modal_ahga) {
    if (modal_ahga) {
      modal_ahga.classList.add("hidden");
    }
  }

  // Función para actualizar la vista de productos
  actualizarVistaProductos_ahga() {
    const carrito_ahga = this.servicioCarrito_ahga.obtenerCarrito_ahga();
    this.servicioProductos_ahga.mostrarProductos_ahga(
      this.contenedorProductos_ahga,
      carrito_ahga
    );
  }

  // Función para mostrar la factura
  mostrarFactura_ahga(
    datosPago_ahga,
    carritoParaFactura_ahga = null,
    totalParaFactura_ahga = null,
    totalFinalParaFactura_ahga = null
  ) {
    // Usar datos capturados o datos actuales del carrito
    const carrito_ahga =
      carritoParaFactura_ahga ||
      this.servicioCarrito_ahga.obtenerCarrito_ahga();
    const total_ahga =
      totalParaFactura_ahga || this.servicioCarrito_ahga.obtenerTotal_ahga();
    const fecha_ahga = new Date().toLocaleDateString("es-ES");
    const hora_ahga = new Date().toLocaleTimeString("es-ES");

    // Usar total final capturado o calcularlo
    let totalFinal_ahga = totalFinalParaFactura_ahga || total_ahga;
    if (
      !totalFinalParaFactura_ahga &&
      this.servicioCupones_ahga.tieneCuponAplicado_ahga()
    ) {
      totalFinal_ahga = this.calcularTotalFinal_ahga();
    }

    // Llenar datos del cliente
    document.getElementById("factura-nombre").textContent =
      datosPago_ahga.nombre;
    document.getElementById("factura-direccion").textContent =
      datosPago_ahga.direccion;
    document.getElementById("factura-telefono").textContent =
      datosPago_ahga.telefono;
    document.getElementById("factura-metodo-pago").textContent =
      datosPago_ahga.metodoPago;

    // Llenar detalles específicos del pago
    const detallesPago_ahga = document.getElementById("factura-detalles-pago");
    let htmlDetalles_ahga = "";

    if (datosPago_ahga.metodoPago === "Pago Móvil") {
      htmlDetalles_ahga = `
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Referencia:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.referencia}</span>
         </div>
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Banco Emisor:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.bancoEmisor}</span>
         </div>
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Teléfono Emisor:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.telefonoEmisor}</span>
         </div>
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Fecha:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.fecha}</span>
         </div>
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Cédula:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.cedula}</span>
         </div>
       `;
    } else if (datosPago_ahga.metodoPago === "Zelle") {
      htmlDetalles_ahga = `
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Correo Zelle:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.correoZelle}</span>
         </div>
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Titular:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.titular}</span>
         </div>
         <div class="flex justify-between">
           <span class="text-[#F3EFF5]/70">Confirmación:</span>
           <span class="text-[#F3EFF5]">${datosPago_ahga.confirmacion}</span>
         </div>
       `;
    }

    detallesPago_ahga.innerHTML = htmlDetalles_ahga;

    // Llenar productos
    const productosContainer_ahga =
      document.getElementById("factura-productos");
    let htmlProductos_ahga = "";

    carrito_ahga.forEach((item_ahga) => {
      htmlProductos_ahga += `
         <div class="flex justify-between items-center bg-[#454955]/20 p-2 rounded">
           <div>
             <span class="text-[#F3EFF5] font-medium">${item_ahga.nombre}</span>
             <span class="text-[#F3EFF5]/70 text-sm"> x${
               item_ahga.cantidad
             }</span>
           </div>
           <span class="text-[#F3EFF5]">$${(
             item_ahga.precio * item_ahga.cantidad
           ).toFixed(2)}</span>
         </div>
       `;
    });

    productosContainer_ahga.innerHTML = htmlProductos_ahga;

    // Llenar total y fecha
    document.getElementById(
      "factura-total"
    ).textContent = `$${totalFinal_ahga.toFixed(2)}`;
    document.getElementById(
      "factura-fecha"
    ).textContent = `${fecha_ahga} ${hora_ahga}`;

    this.mostrarModal_ahga(this.modalFactura_ahga);
  }

  // Función para inicializar la aplicación
  async inicializar_ahga() {
    try {
      console.log("Inicializando aplicación...");

      // Establecer referencia al worker en el servicio de productos
      this.servicioProductos_ahga.establecerTrabajadorBD_ahga(
        this.servicioCarrito_ahga.trabajadorBD_ahga
      );

      await this.servicioProductos_ahga.cargarProductos_ahga();
      this.actualizarVistaProductos_ahga();
    } catch (error_ahga) {
      console.error("Error inicializando aplicación:", error_ahga);
      mostrarNotificacion_ahga("Error cargando la aplicación");
    }
  }

  // Verificar si el usuario está autenticado
  async verificarAutenticacion_ahga() {
    try {
      // Verificar en sessionStorage primero
      const datosUsuario = sessionStorage.getItem("datosUsuario_ahga");
      if (datosUsuario) {
        const usuario = JSON.parse(datosUsuario);
        if (usuario && usuario.uid) {
          console.log("Usuario autenticado encontrado en sessionStorage:", usuario.email);
          return true;
        }
      }

      // Verificar con Firebase Auth como respaldo
      const { verificarUsuarioActual_ahga } = await import(
        "../firebase/services/auth.service.js"
      );
      const usuarioFirebase = verificarUsuarioActual_ahga();
      
      if (usuarioFirebase && usuarioFirebase.uid) {
        console.log("Usuario autenticado encontrado en Firebase:", usuarioFirebase.email);
        return true;
      }

      console.log("No se encontró usuario autenticado");
      return false;
    } catch (error_ahga) {
      console.error("Error al verificar autenticación:", error_ahga);
      return false;
    }
  }

  // Mostrar modal que requiere login
  mostrarModalLoginRequerido_ahga() {
    // Crear modal dinámicamente si no existe
    let modalLogin = document.getElementById("modal-login-requerido");
    
    if (!modalLogin) {
      modalLogin = document.createElement("div");
      modalLogin.id = "modal-login-requerido";
      modalLogin.className = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center";
      modalLogin.innerHTML = `
        <div class="bg-[#0D0A0B] border border-[#454955] rounded-xl p-6 max-w-md mx-4">
          <div class="text-center">
            <div class="mb-4">
              <i class="ri-user-line text-4xl text-[#72B01D]"></i>
            </div>
            <h3 class="text-xl font-bold mb-2 text-[#F3EFF5]">Inicia Sesión Requerida</h3>
            <p class="text-[#F3EFF5]/80 mb-6">
              Debes iniciar sesión para poder realizar compras en nuestra tienda.
            </p>
            <div class="flex gap-3">
              <button 
                id="btn-ir-login" 
                class="flex-1 bg-[#72B01D] hover:bg-[#3F7D20] text-white py-2 px-4 rounded transition-colors"
              >
                Iniciar Sesión
              </button>
              <button 
                id="btn-cancelar-login" 
                class="flex-1 bg-[#454955] hover:bg-[#5A5A6B] text-white py-2 px-4 rounded transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalLogin);

      // Configurar eventos del modal
       document.getElementById("btn-ir-login").addEventListener("click", () => {
         window.location.href = "../dist/login.html";
       });

      document.getElementById("btn-cancelar-login").addEventListener("click", () => {
        this.ocultarModal_ahga(modalLogin);
      });

      // Cerrar modal al hacer click fuera
      modalLogin.addEventListener("click", (e) => {
        if (e.target === modalLogin) {
          this.ocultarModal_ahga(modalLogin);
        }
      });
    }

    this.mostrarModal_ahga(modalLogin);
  }
}

// Función para mostrar notificaciones (exportada para uso global)
export const mostrarNotificacion_ahga = (mensaje_ahga) => {
  console.log(`Mostrando notificación: "${mensaje_ahga}"`);
  const notificacion_ahga = document.createElement("div");
  notificacion_ahga.className =
    "fixed bottom-4 right-4 bg-[#72B01D] text-white px-4 py-2 rounded shadow-lg z-50";
  notificacion_ahga.textContent = mensaje_ahga;
  document.body.appendChild(notificacion_ahga);

  setTimeout(() => {
    console.log("Eliminando notificación");
    notificacion_ahga.remove();
  }, 3000);
};

export default ServicioInterfaz_ahga;
