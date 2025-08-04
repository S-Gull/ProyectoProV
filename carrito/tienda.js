// Importar módulos
import ServicioCarrito_ahga from "./carrito.js";
import ServicioProductos_ahga from "./productos.js";
import ServicioCupones_ahga from "./cupones.js";
import ServicioInterfaz_ahga from "./interfaz.js";

// Inicializar servicios
const servicioCarrito_ahga = new ServicioCarrito_ahga();
const servicioProductos_ahga = new ServicioProductos_ahga();
const servicioCupones_ahga = new ServicioCupones_ahga();
const servicioInterfaz_ahga = new ServicioInterfaz_ahga(
  servicioCarrito_ahga,
  servicioProductos_ahga,
  servicioCupones_ahga
);

console.log("Servicios inicializados");

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado, inicializando aplicación...");
  servicioInterfaz_ahga.inicializar_ahga();
});

// Si el DOM ya está cargado, inicializar inmediatamente
if (document.readyState === "loading") {
  // El DOM aún se está cargando
} else {
  // El DOM ya está cargado
  console.log("DOM ya cargado, inicializando aplicación...");
  servicioInterfaz_ahga.inicializar_ahga();
}

// Exportar servicios para uso global si es necesario
window.servicioCarrito_ahga = servicioCarrito_ahga;
window.servicioProductos_ahga = servicioProductos_ahga;
window.servicioCupones_ahga = servicioCupones_ahga;
window.servicioInterfaz_ahga = servicioInterfaz_ahga;

console.log("Tienda inicializada con arquitectura modular");
