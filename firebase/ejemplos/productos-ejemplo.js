/**
 * Ejemplo de uso de la nueva estructura de Firebase para manejar productos
 * Este archivo muestra cómo se integraría la nueva estructura en el carrito
 */

// Importar servicios específicos de Firestore
import { insertarProductos_ahga, obtenerProductos_ahga } from "../services/firestore.service.js";

/**
 * Ejemplo de cómo cargar productos desde un archivo JSON e insertarlos en Firestore
 */
async function cargarProductosEnFirestore_ahga() {
  try {
    // Importar productos desde un archivo JSON
    const productosJson = await import("/json/productos.json", { assert: { type: "json" } });
    
    // Insertar productos en Firestore
    await insertarProductos_ahga(productosJson.default);
    
    console.log("Productos cargados exitosamente en Firestore");
  } catch (error_ahga) {
    console.error("Error al cargar productos:", error_ahga);
    // Mostrar mensaje de error al usuario
    alert(`Error al cargar productos: ${error_ahga.message}`);
  }
}

/**
 * Ejemplo de cómo obtener y mostrar productos desde Firestore
 */
async function mostrarProductos_ahga() {
  try {
    // Obtener productos de Firestore
    const productos = await obtenerProductos_ahga();
    
    // Mostrar productos en la interfaz
    const contenedorProductos = document.getElementById("products");
    contenedorProductos.innerHTML = "";
    
    productos.forEach(producto => {
      // Crear elemento de producto
      const productoElement = document.createElement("div");
      productoElement.className = "product-card";
      productoElement.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>${producto.desc}</p>
        <p class="price">$${producto.precio.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${producto.id}">Añadir al carrito</button>
      `;
      
      contenedorProductos.appendChild(productoElement);
    });
    
    console.log("Productos mostrados exitosamente");
  } catch (error_ahga) {
    console.error("Error al mostrar productos:", error_ahga);
    // Mostrar mensaje de error al usuario
    const contenedorProductos = document.getElementById("products");
    contenedorProductos.innerHTML = `<p class="error">Error al cargar productos: ${error_ahga.message}</p>`;
  }
}

// Ejemplo de uso
document.addEventListener("DOMContentLoaded", () => {
  // Botón para cargar productos en Firestore (solo para administradores)
  const btnCargarProductos = document.getElementById("cargar-productos");
  if (btnCargarProductos) {
    btnCargarProductos.addEventListener("click", cargarProductosEnFirestore_ahga);
  }
  
  // Mostrar productos al cargar la página
  mostrarProductos_ahga();
});