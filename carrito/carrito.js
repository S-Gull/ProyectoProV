// Módulo para manejo del carrito de compras
import { mostrarNotificacion_ahga } from "./interfaz.js";

class ServicioCarrito_ahga {
  constructor() {
    this.carrito_ahga = [];
    this.trabajadorBD_ahga = new Worker(new URL("./db.js", import.meta.url), {
      type: "module",
    });
    this.inicializarTrabajador_ahga();
  }

  inicializarTrabajador_ahga() {
    console.log("Worker de base de datos creado");
    this.trabajadorBD_ahga.postMessage(["iniciar"]);
    console.log("Mensaje enviado al worker para iniciar DB");

    // Escuchar mensajes del Worker
    this.trabajadorBD_ahga.onmessage = (evento_ahga) => {
      const [accion_ahga, datos_ahga] = evento_ahga.data;
      console.log(
        `Mensaje recibido del worker: Acción=${accion_ahga}`,
        datos_ahga
      );

      switch (accion_ahga) {
        case "iniciado":
          console.log("Base de datos iniciada correctamente");
          this.trabajadorBD_ahga.postMessage(["obtener_carrito"]);
          console.log("Solicitado carrito desde IndexedDB");
          break;

        case "carrito_obtenido":
          console.log("Carrito obtenido de IndexedDB:", datos_ahga);
          this.carrito_ahga = Array.isArray(datos_ahga) ? datos_ahga : [];
          console.table(this.carrito_ahga);
          this.actualizarCarrito_ahga();
          if (this.carrito_ahga.length > 0) {
            console.log("Carrito recuperado con items, mostrando notificación");
            mostrarNotificacion_ahga("Carrito recuperado de la última sesión");
          }
          break;

        case "pedido_guardado":
          console.log("Pedido guardado en IndexedDB:", datos_ahga);
          this.carrito_ahga = [];
          this.actualizarCarrito_ahga();
          mostrarNotificacion_ahga("✅ Pedido completado exitosamente");
          break;

        case "error_stock":
          console.error("❌ Error de stock:", datos_ahga);
          mostrarNotificacion_ahga(
            `⚠️ Stock insuficiente para ${datos_ahga.producto}. Disponible: ${datos_ahga.stockActual}, Solicitado: ${datos_ahga.cantidadSolicitada}`
          );
          break;

        case "error":
          console.error("❌ Error en DB:", datos_ahga);
          mostrarNotificacion_ahga("⚠️ Error en la base de datos");
          break;

        default:
          console.warn("Acción desconocida recibida del worker:", accion_ahga);
      }
    };
  }

  // Función para añadir productos al carrito
  agregarAlCarrito_ahga(producto_ahga) {
    console.log(
      `Intentando agregar producto ID: ${producto_ahga.id} al carrito`
    );

    if (!producto_ahga) {
      console.error(`Producto no encontrado`);
      return;
    }

    console.log("Producto encontrado:", producto_ahga.nombre);

    const itemExistente_ahga = this.carrito_ahga.find(
      (item_ahga) => item_ahga.id === producto_ahga.id
    );

    if (itemExistente_ahga) {
      console.log(
        `Producto ya existe en carrito, incrementando cantidad (antes: ${itemExistente_ahga.cantidad})`
      );
      itemExistente_ahga.cantidad += 1;
    } else {
      console.log("Producto no existe en carrito, agregando nuevo item");
      this.carrito_ahga.push({ ...producto_ahga, cantidad: 1 });
    }

    this.actualizarCarrito_ahga();
    mostrarNotificacion_ahga(`${producto_ahga.nombre} añadido al carrito`);
    this.guardarCarrito_ahga();
  }

  // Funciones para modificar cantidades
  aumentarCantidad_ahga(idProducto_ahga) {
    console.log(`Aumentando cantidad para producto ID: ${idProducto_ahga}`);
    const item_ahga = this.carrito_ahga.find(
      (item_ahga) => item_ahga.id === idProducto_ahga
    );
    if (item_ahga) {
      console.log(`Cantidad antes: ${item_ahga.cantidad}`);
      item_ahga.cantidad += 1;
      console.log(`Cantidad después: ${item_ahga.cantidad}`);
      this.actualizarCarrito_ahga();
      this.guardarCarrito_ahga();
    } else {
      console.error(`Producto ID ${idProducto_ahga} no encontrado en carrito`);
    }
  }

  disminuirCantidad_ahga(idProducto_ahga) {
    console.log(`Disminuyendo cantidad para producto ID: ${idProducto_ahga}`);
    const item_ahga = this.carrito_ahga.find(
      (item_ahga) => item_ahga.id === idProducto_ahga
    );
    if (item_ahga && item_ahga.cantidad > 1) {
      console.log(`Cantidad antes: ${item_ahga.cantidad}`);
      item_ahga.cantidad -= 1;
      console.log(`Cantidad después: ${item_ahga.cantidad}`);
      this.actualizarCarrito_ahga();
      this.guardarCarrito_ahga();
    } else {
      console.log(
        `No se puede disminuir, cantidad es 1 o producto no encontrado`
      );
    }
  }

  eliminarDelCarrito_ahga(idProducto_ahga) {
    console.log(`Eliminando producto ID: ${idProducto_ahga} del carrito`);
    const cantidadAntes_ahga = this.carrito_ahga.length;
    this.carrito_ahga = this.carrito_ahga.filter(
      (item_ahga) => item_ahga.id !== idProducto_ahga
    );
    console.log(
      `Items antes: ${cantidadAntes_ahga}, después: ${this.carrito_ahga.length}`
    );
    this.actualizarCarrito_ahga();
    this.guardarCarrito_ahga();
  }

  // Función para actualizar el carrito en la interfaz
  actualizarCarrito_ahga() {
    console.log("Actualizando visualización del carrito");
    const totalItems_ahga = this.carrito_ahga.reduce(
      (suma_ahga, item_ahga) => suma_ahga + item_ahga.cantidad,
      0
    );
    console.log(`Total items en carrito: ${totalItems_ahga}`);

    // Actualizar contador
    const elementoContador_ahga = document.getElementById("cart-count");
    if (elementoContador_ahga) {
      elementoContador_ahga.textContent = totalItems_ahga;
    }

    // Actualizar contenido del carrito
    const contenedorItems_ahga = document.getElementById("cart-items");
    if (contenedorItems_ahga) {
      contenedorItems_ahga.innerHTML = this.carrito_ahga
        .map(
          (item_ahga) => `
            <div class="cart-item flex items-center border-b border-[#454955]/50 pb-4" data-id="${item_ahga.id}">
                <img src="${item_ahga.img}" alt="${item_ahga.nombre}" class="w-16 h-16 object-cover rounded mr-4">
                <div class="flex-1">
                    <h4 class="font-bold">${item_ahga.nombre}</h4>
                    <p class="text-sm text-[#F3EFF5]/60">$${item_ahga.precio} x ${item_ahga.cantidad}</p>
                </div>
                <div class="flex items-center">
                    <button class="decrease-btn text-[#F3EFF5]/50 hover:text-[#72B01D] p-1">
                        <i class="ri-subtract-line"></i>
                    </button>
                    <span class="mx-2">${item_ahga.cantidad}</span>
                    <button class="increase-btn text-[#F3EFF5]/50 hover:text-[#72B01D] p-1">
                        <i class="ri-add-line"></i>
                    </button>
                    <button class="remove-btn text-red-400 hover:text-red-500 ml-2 p-1">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
        `
        )
        .join("");
    }

    // Actualizar total
    const total_ahga = this.carrito_ahga.reduce(
      (suma_ahga, item_ahga) =>
        suma_ahga + item_ahga.precio * item_ahga.cantidad,
      0
    );
    console.log(`Total calculado del carrito: $${total_ahga.toFixed(2)}`);

    // Actualizar subtotal en lugar del total directamente
    const elementoSubtotal_ahga = document.getElementById("cart-subtotal");
    if (elementoSubtotal_ahga) {
      elementoSubtotal_ahga.textContent = `$${total_ahga.toFixed(2)}`;
    }

    // El total final se actualizará a través de la interfaz de cupones
    const elementoTotal_ahga = document.getElementById("cart-total");
    if (elementoTotal_ahga) {
      elementoTotal_ahga.textContent = `$${total_ahga.toFixed(2)}`;
    }

    // Disparar evento personalizado para que la interfaz actualice los cupones
    window.dispatchEvent(
      new CustomEvent("carritoActualizado", { detail: { total: total_ahga } })
    );
  }

  // Función para guardar el carrito
  guardarCarrito_ahga() {
    this.trabajadorBD_ahga.postMessage(["guardar_carrito", this.carrito_ahga]);
    console.log("Carrito actual enviado al worker para guardar");
  }

  // Función para procesar la compra
  procesarCompra_ahga() {
    if (this.carrito_ahga.length === 0) {
      return false;
    }

    const total_ahga = this.carrito_ahga.reduce(
      (suma_ahga, item_ahga) =>
        suma_ahga + item_ahga.precio * item_ahga.cantidad,
      0
    );

    console.log("Enviando pedido al worker para guardar en IndexedDB");
    this.trabajadorBD_ahga.postMessage([
      "guardar_pedido",
      {
        items: this.carrito_ahga,
        total: total_ahga,
        fecha: new Date().toISOString(),
      },
    ]);

    return { items: this.carrito_ahga, total: total_ahga };
  }

  // Getters
  obtenerCarrito_ahga() {
    return this.carrito_ahga;
  }

  obtenerTotal_ahga() {
    return this.carrito_ahga.reduce(
      (suma_ahga, item_ahga) =>
        suma_ahga + item_ahga.precio * item_ahga.cantidad,
      0
    );
  }

  estaVacio_ahga() {
    return this.carrito_ahga.length === 0;
  }
}

export default ServicioCarrito_ahga;
