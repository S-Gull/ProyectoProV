// Módulo para manejo de productos
class ServicioProductos_ahga {
  constructor() {
    this.productos_ahga = [];
    this.trabajadorBD_ahga = null;
  }

  // Función para establecer referencia al worker de BD
  establecerTrabajadorBD_ahga(trabajador_ahga) {
    this.trabajadorBD_ahga = trabajador_ahga;
  }

  // Función para cargar productos desde JSON
  async cargarProductos_ahga() {
    console.log("Iniciando carga de productos...");
    try {
      const respuesta_ahga = await fetch("../json/productos.json");
      this.productos_ahga = await respuesta_ahga.json();
      console.log("Productos cargados:", this.productos_ahga.length);
      console.table(this.productos_ahga.slice(0, 24)); // Muestra los primeros 24 productos como muestra
      return this.productos_ahga;
    } catch (error_ahga) {
      console.error("Error cargando productos:", error_ahga);
      throw error_ahga;
    }
  }

  // Función para mostrar productos en el DOM
  mostrarProductos_ahga(contenedor_ahga, carrito_ahga = []) {
    if (!contenedor_ahga) {
      console.error("Contenedor no encontrado");
      return;
    }

    console.log("Mostrando productos en el DOM");
    contenedor_ahga.innerHTML = this.productos_ahga
      .map((producto_ahga) => {
        // Verificar cantidad en carrito
        const itemEnCarrito_ahga = carrito_ahga.find(
          (item) => item.id === producto_ahga.id
        );
        const cantidadEnCarrito_ahga = itemEnCarrito_ahga
          ? itemEnCarrito_ahga.cantidad
          : 0;
        const stockDisponible_ahga =
          producto_ahga.existencia - cantidadEnCarrito_ahga;
        const sinStock_ahga =
          producto_ahga.existencia === 0 || stockDisponible_ahga <= 0;

        return `
          <article class="product-card bg-[#454955]/20 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]" data-id="${
            producto_ahga.id
          }">
              <div class="relative h-48">
                  <img src="${producto_ahga.img}" alt="${
          producto_ahga.nombre
        }" class="absolute top-0 left-0 w-full h-full object-cover">
                  ${
                    sinStock_ahga
                      ? '<div class="absolute inset-0 bg-black/50 flex items-center justify-center"><span class="text-red-500 font-bold text-lg">AGOTADO</span></div>'
                      : ""
                  }
              </div>
              <div class="p-4">
                  <h3 class="text-xl font-bold mb-2">${
                    producto_ahga.nombre
                  }</h3>
                  <p class="text-[#F3EFF5]/80 text-sm mb-2">${
                    producto_ahga.desc
                  }</p>
                  <div class="flex justify-between items-center">
                      <span class="text-lg font-bold text-[#72B01D]">$${
                        producto_ahga.precio
                      }</span>
                      <button class="add-to-cart-btn bg-[#72B01D] hover:bg-[#3F7D20] text-white px-4 py-2 rounded transition-colors ${
                        sinStock_ahga ? "opacity-50 cursor-not-allowed" : ""
                      }" ${sinStock_ahga ? "disabled" : ""}>
                          <i class="ri-shopping-cart-line mr-1"></i> ${
                            sinStock_ahga ? "Agotado" : "Añadir"
                          }
                      </button>
                  </div>
                  <div class="mt-2 text-sm text-[#F3EFF5]/60">
                      Stock: ${producto_ahga.existencia} unidades${
          cantidadEnCarrito_ahga > 0
            ? ` (${cantidadEnCarrito_ahga} en carrito)`
            : ""
        }
                  </div>
              </div>
          </article>
      `;
      })
      .join("");
  }

  // Función para buscar un producto por ID
  buscarProductoPorId_ahga(id_ahga) {
    return this.productos_ahga.find(
      (producto_ahga) => producto_ahga.id === id_ahga
    );
  }

  // Función para filtrar productos
  filtrarProductos_ahga(filtro_ahga) {
    if (!filtro_ahga) return this.productos_ahga;

    return this.productos_ahga.filter(
      (producto_ahga) =>
        producto_ahga.nombre
          .toLowerCase()
          .includes(filtro_ahga.toLowerCase()) ||
        producto_ahga.desc.toLowerCase().includes(filtro_ahga.toLowerCase())
    );
  }

  // Función para ordenar productos
  ordenarProductos_ahga(criterio_ahga = "nombre", orden_ahga = "asc") {
    const productosOrdenados_ahga = [...this.productos_ahga];

    productosOrdenados_ahga.sort((a_ahga, b_ahga) => {
      let valorA_ahga, valorB_ahga;

      switch (criterio_ahga) {
        case "precio":
          valorA_ahga = a_ahga.precio;
          valorB_ahga = b_ahga.precio;
          break;
        case "existencia":
          valorA_ahga = a_ahga.existencia;
          valorB_ahga = b_ahga.existencia;
          break;
        case "nombre":
        default:
          valorA_ahga = a_ahga.nombre.toLowerCase();
          valorB_ahga = b_ahga.nombre.toLowerCase();
          break;
      }

      if (orden_ahga === "desc") {
        return valorA_ahga < valorB_ahga
          ? 1
          : valorA_ahga > valorB_ahga
          ? -1
          : 0;
      } else {
        return valorA_ahga > valorB_ahga
          ? 1
          : valorA_ahga < valorB_ahga
          ? -1
          : 0;
      }
    });

    return productosOrdenados_ahga;
  }

  // Función para verificar disponibilidad
  verificarDisponibilidad_ahga(id_ahga, cantidad_ahga = 1) {
    const producto_ahga = this.buscarProductoPorId_ahga(id_ahga);
    if (!producto_ahga) {
      return { disponible: false, mensaje: "Producto no encontrado" };
    }

    if (producto_ahga.existencia < cantidad_ahga) {
      return {
        disponible: false,
        mensaje: `Solo quedan ${producto_ahga.existencia} unidades disponibles`,
      };
    }

    return { disponible: true, mensaje: "Producto disponible" };
  }

  // Función para actualizar existencia (simulación)
  actualizarExistencia_ahga(id_ahga, cantidad_ahga) {
    const producto_ahga = this.buscarProductoPorId_ahga(id_ahga);
    if (producto_ahga) {
      producto_ahga.existencia = Math.max(
        0,
        producto_ahga.existencia - cantidad_ahga
      );
      console.log(
        `Existencia actualizada para ${producto_ahga.nombre}: ${producto_ahga.existencia}`
      );
      return true;
    }
    return false;
  }

  // Función para actualizar stock desde la base de datos
  async actualizarStockDesdeBD_ahga() {
    if (!this.trabajadorBD_ahga) {
      console.warn("Worker de BD no disponible para actualizar stock");
      return;
    }

    return new Promise((resolve) => {
      const handler = (e) => {
        const [accion, datos] = e.data;
        if (accion === "stocks_obtenidos") {
          // Actualizar el stock de cada producto
          datos.forEach((stockInfo) => {
            const producto = this.buscarProductoPorId_ahga(stockInfo.id);
            if (producto) {
              producto.existencia = stockInfo.stock;
            }
          });
          console.log("Stock actualizado desde la base de datos");
          this.trabajadorBD_ahga.removeEventListener("message", handler);
          resolve();
        }
      };

      this.trabajadorBD_ahga.addEventListener("message", handler);
      this.trabajadorBD_ahga.postMessage(["obtener_todos_stocks"]);
    });
  }

  // Función para obtener productos con bajo stock
  obtenerProductosBajoStock_ahga(limite_ahga = 5) {
    return this.productos_ahga.filter(
      (producto_ahga) => producto_ahga.existencia <= limite_ahga
    );
  }

  // Función para obtener productos agotados
  obtenerProductosAgotados_ahga() {
    return this.productos_ahga.filter(
      (producto_ahga) => producto_ahga.existencia === 0
    );
  }

  // Función para obtener estadísticas de productos
  obtenerEstadisticas_ahga() {
    const total_ahga = this.productos_ahga.length;
    const agotados_ahga = this.obtenerProductosAgotados_ahga().length;
    const bajoStock_ahga = this.obtenerProductosBajoStock_ahga().length;
    const disponibles_ahga = total_ahga - agotados_ahga;

    const precioPromedio_ahga =
      this.productos_ahga.reduce(
        (suma_ahga, producto_ahga) => suma_ahga + producto_ahga.precio,
        0
      ) / total_ahga;

    const stockTotal_ahga = this.productos_ahga.reduce(
      (suma_ahga, producto_ahga) => suma_ahga + producto_ahga.existencia,
      0
    );

    return {
      total: total_ahga,
      disponibles: disponibles_ahga,
      agotados: agotados_ahga,
      bajoStock: bajoStock_ahga,
      precioPromedio: precioPromedio_ahga.toFixed(2),
      stockTotal: stockTotal_ahga,
    };
  }

  // Getters
  obtenerTodosLosProductos_ahga() {
    return this.productos_ahga;
  }

  obtenerProductosDisponibles_ahga() {
    return this.productos_ahga.filter(
      (producto_ahga) => producto_ahga.existencia > 0
    );
  }
}

export default ServicioProductos_ahga;
