// Variables globales
//import { insertar_productos_ahga } from "../firebase/auth.js";
//import productosjson from "../json/productos.json" assert { type: "json" };
//await insertar_productos_ahga(productosjson);

let carrito_ahga = [];
let productos_ahga = [];
const dbWorker_ahga = new Worker(new URL("./db.js", import.meta.url), {
  type: "module",
});

console.log("Worker de base de datos creado");

// Referencias DOM
const contenedorProductos_ahga = document.getElementById("products");
const contenedorItemsCarrito_ahga = document.getElementById("cart-items");
const elementoContadorCarrito_ahga = document.getElementById("cart-count");
const elementoTotalCarrito_ahga = document.getElementById("cart-total");
const modalCarrito_ahga = document.getElementById("cart-modal");
const botonCarrito_ahga = document.getElementById("cart-button");
const botonCerrarCarrito_ahga = document.getElementById("close-cart");
const botonCheckout_ahga = document.getElementById("checkout");
const modalConfirmacion_ahga = document.getElementById("modal-confirmacion");
const detallesCompra_ahga = document.getElementById("detalles-compra");
const totalConfirmacion_ahga = document.getElementById("total-confirmacion");
const botonConfirmarCompra_ahga = document.getElementById("confirmar-compra");
const modalCarritoVacio_ahga = document.getElementById("modal-carrito-vacio");
const botonCerrarCarritoVacio_ahga = document.getElementById(
  "cerrar-carrito-vacio"
);

console.log("Referencias DOM obtenidas");

// Inicializar DB
dbWorker_ahga.postMessage(["iniciar"]);
console.log("Mensaje enviado al worker para iniciar DB");

// Escuchar mensajes del Worker
dbWorker_ahga.onmessage = (e_ahga) => {
  const [accion_ahga, datos_ahga] = e_ahga.data;
  console.log(`Mensaje recibido del worker: Acción=${accion_ahga}`, datos_ahga);

  switch (accion_ahga) {
    case "iniciado":
      console.log("Base de datos iniciada correctamente");
      dbWorker_ahga.postMessage(["obtener_carrito"]);
      console.log("Solicitado carrito desde IndexedDB");
      break;

    case "carrito_obtenido":
      console.log("Carrito obtenido de IndexedDB:", datos_ahga);
      carrito_ahga = Array.isArray(datos_ahga) ? datos_ahga : [];
      console.table(carrito_ahga); // Muestra el carrito en formato tabla
      actualizarCarrito_ahga();
      if (carrito_ahga.length > 0) {
        console.log("Carrito recuperado con items, mostrando notificación");
        mostrarNotificacion_ahga("Carrito recuperado de la última sesión");
      }
      break;

    case "pedido_guardado":
      console.log("Pedido guardado en IndexedDB:", datos_ahga);
      carrito_ahga = [];
      actualizarCarrito_ahga();
      mostrarNotificacion_ahga("Pedido completado");
      break;

    case "error":
      console.error("❌ Error en DB:", datos_ahga);
      mostrarNotificacion_ahga("⚠️ Error en la base de datos");
      break;

    default:
      console.warn("Acción desconocida recibida del worker:", accion_ahga);
  }
};

// Función para cargar productos
const cargarProductos_ahga = async () => {
  console.log("Iniciando carga de productos...");
  try {
    const respuesta_ahga = await fetch("../json/productos.json");
    productos_ahga = await respuesta_ahga.json();
    console.log("Productos cargados:", productos_ahga.length);
    console.table(productos_ahga.slice(0, 24)); // Muestra los primeros 10 productos como muestra
    mostrarProductos_ahga(productos_ahga);
  } catch (error_ahga) {
    console.error("Error cargando productos:", error_ahga);
  }
};

// Función para mostrar productos
const mostrarProductos_ahga = (productos_ahga) => {
  console.log("Mostrando productos en el DOM");
  contenedorProductos_ahga.innerHTML = productos_ahga
    .map(
      (producto_ahga) => `
        <article class="product-card bg-[#454955]/20 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]" data-id="${producto_ahga.id}">
            <div class="relative h-48">
                <img src="${producto_ahga.img}" alt="${producto_ahga.nombre}" class="absolute top-0 left-0 w-full h-full object-cover">
            </div>
            <div class="p-4">
                <h3 class="text-xl font-bold mb-2">${producto_ahga.nombre}</h3>
                <p class="text-[#F3EFF5]/80 text-sm mb-2">${producto_ahga.desc}</p>
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold text-[#72B01D]">$${producto_ahga.precio}</span>
                    <button class="add-to-cart-btn bg-[#72B01D] hover:bg-[#3F7D20] text-white px-4 py-2 rounded transition-colors">
                        <i class="ri-shopping-cart-line mr-1"></i> Añadir
                    </button>
                </div>
            </div>
        </article>
    `
    )
    .join("");
};

// Función para añadir productos al carrito
const agregarAlCarrito_ahga = (idProducto_ahga) => {
  console.log(`Intentando agregar producto ID: ${idProducto_ahga} al carrito`);
  const producto_ahga = productos_ahga.find(
    (p_ahga) => p_ahga.id === idProducto_ahga
  );

  if (!producto_ahga) {
    console.error(`Producto con ID ${idProducto_ahga} no encontrado`);
    return;
  }

  console.log("Producto encontrado:", producto_ahga.nombre);

  const itemExistente_ahga = carrito_ahga.find(
    (item_ahga) => item_ahga.id === idProducto_ahga
  );

  if (itemExistente_ahga) {
    console.log(
      `Producto ya existe en carrito, incrementando cantidad (antes: ${itemExistente_ahga.cantidad})`
    );
    itemExistente_ahga.cantidad += 1;
  } else {
    console.log("Producto no existe en carrito, agregando nuevo item");
    carrito_ahga.push({ ...producto_ahga, cantidad: 1 });
  }

  actualizarCarrito_ahga();
  mostrarNotificacion_ahga(`${producto_ahga.nombre} añadido al carrito`);
  dbWorker_ahga.postMessage(["guardar_carrito", carrito_ahga]);
  console.log("Carrito actual enviado al worker para guardar");
};

// Función para actualizar el carrito
const actualizarCarrito_ahga = () => {
  console.log("Actualizando visualización del carrito");
  const totalItems_ahga = carrito_ahga.reduce(
    (suma_ahga, item_ahga) => suma_ahga + item_ahga.cantidad,
    0
  );
  console.log(`Total items en carrito: ${totalItems_ahga}`);
  elementoContadorCarrito_ahga.textContent = totalItems_ahga;

  contenedorItemsCarrito_ahga.innerHTML = carrito_ahga
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

  const total_ahga = carrito_ahga.reduce(
    (suma_ahga, item_ahga) => suma_ahga + item_ahga.precio * item_ahga.cantidad,
    0
  );
  console.log(`Total calculado del carrito: $${total_ahga.toFixed(2)}`);
  elementoTotalCarrito_ahga.textContent = `$${total_ahga.toFixed(2)}`;
};

// Funciones para modificar cantidades
const aumentarCantidad_ahga = (idProducto_ahga) => {
  console.log(`Aumentando cantidad para producto ID: ${idProducto_ahga}`);
  const item_ahga = carrito_ahga.find(
    (item_ahga) => item_ahga.id === idProducto_ahga
  );
  if (item_ahga) {
    console.log(`Cantidad antes: ${item_ahga.cantidad}`);
    item_ahga.cantidad += 1;
    console.log(`Cantidad después: ${item_ahga.cantidad}`);
    actualizarCarrito_ahga();
    dbWorker_ahga.postMessage(["guardar_carrito", carrito_ahga]);
  } else {
    console.error(`Producto ID ${idProducto_ahga} no encontrado en carrito`);
  }
};

const disminuirCantidad_ahga = (idProducto_ahga) => {
  console.log(`Disminuyendo cantidad para producto ID: ${idProducto_ahga}`);
  const item_ahga = carrito_ahga.find(
    (item_ahga) => item_ahga.id === idProducto_ahga
  );
  if (item_ahga && item_ahga.cantidad > 1) {
    console.log(`Cantidad antes: ${item_ahga.cantidad}`);
    item_ahga.cantidad -= 1;
    console.log(`Cantidad después: ${item_ahga.cantidad}`);
    actualizarCarrito_ahga();
    dbWorker_ahga.postMessage(["guardar_carrito", carrito_ahga]);
  } else {
    console.log(
      `No se puede disminuir, cantidad es 1 o producto no encontrado`
    );
  }
};

const eliminarDelCarrito_ahga = (idProducto_ahga) => {
  console.log(`Eliminando producto ID: ${idProducto_ahga} del carrito`);
  const cantidadAntes = carrito_ahga.length;
  carrito_ahga = carrito_ahga.filter(
    (item_ahga) => item_ahga.id !== idProducto_ahga
  );
  console.log(`Items antes: ${cantidadAntes}, después: ${carrito_ahga.length}`);
  actualizarCarrito_ahga();
  dbWorker_ahga.postMessage(["guardar_carrito", carrito_ahga]);
};

// Función para mostrar notificaciones
const mostrarNotificacion_ahga = (mensaje_ahga) => {
  console.log(`Mostrando notificación: "${mensaje_ahga}"`);
  const notificacion_ahga = document.createElement("div");
  notificacion_ahga.className =
    "fixed bottom-4 right-4 bg-[#72B01D] text-white px-4 py-2 rounded shadow-lg";
  notificacion_ahga.textContent = mensaje_ahga;
  document.body.appendChild(notificacion_ahga);

  setTimeout(() => {
    console.log("Eliminando notificación");
    notificacion_ahga.remove();
  }, 3000);
};

// Función para mostrar el modal de confirmación
const mostrarModalConfirmacion_ahga = () => {
  console.log("Mostrando modal de confirmación de compra");
  detallesCompra_ahga.innerHTML = carrito_ahga
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

  const total_ahga = carrito_ahga.reduce(
    (suma_ahga, item_ahga) => suma_ahga + item_ahga.precio * item_ahga.cantidad,
    0
  );
  console.log(`Total en modal de confirmación: $${total_ahga.toFixed(2)}`);
  totalConfirmacion_ahga.textContent = `$${total_ahga.toFixed(2)}`;
  modalConfirmacion_ahga.classList.remove("hidden");

  // Guardar pedido en la base de datos
  console.log("Enviando pedido al worker para guardar en IndexedDB");
  dbWorker_ahga.postMessage([
    "guardar_pedido",
    {
      items: carrito_ahga,
      total: total_ahga,
      fecha: new Date().toISOString(),
    },
  ]);
};

// Event Listeners
botonCarrito_ahga.addEventListener("click", () => {
  console.log("Botón carrito clickeado, mostrando modal");
  modalCarrito_ahga.classList.remove("hidden");
});

botonCerrarCarrito_ahga.addEventListener("click", () => {
  console.log("Botón cerrar carrito clickeado, ocultando modal");
  modalCarrito_ahga.classList.add("hidden");
});

botonCheckout_ahga.addEventListener("click", () => {
  console.log("Botón checkout clickeado");
  if (carrito_ahga.length > 0) {
    console.log("Carrito tiene items, mostrando confirmación");
    mostrarModalConfirmacion_ahga();
  } else {
    console.log("Carrito vacío, mostrando advertencia");
    mostrarModalCarritoVacio_ahga();
  }
});

botonConfirmarCompra_ahga.addEventListener("click", () => {
  console.log("Compra confirmada, cerrando modal");
  modalConfirmacion_ahga.classList.add("hidden");
});

botonCerrarCarritoVacio_ahga.addEventListener("click", () => {
  console.log("Cerrando modal de carrito vacío");
  modalCarritoVacio_ahga.classList.add("hidden");
});

// Cerrar modales al hacer clic fuera
modalConfirmacion_ahga.addEventListener("click", (e) => {
  if (e.target === modalConfirmacion_ahga) {
    console.log("Clic fuera del modal de confirmación, cerrando");
    modalConfirmacion_ahga.classList.add("hidden");
  }
});

modalCarritoVacio_ahga.addEventListener("click", (e) => {
  if (e.target === modalCarritoVacio_ahga) {
    console.log("Clic fuera del modal de carrito vacío, cerrando");
    modalCarritoVacio_ahga.classList.add("hidden");
  }
});

// Delegación de eventos para productos
contenedorProductos_ahga.addEventListener("click", (e_ahga) => {
  const addButton_ahga = e_ahga.target.closest(".add-to-cart-btn");
  if (addButton_ahga) {
    const productCard_ahga = e_ahga.target.closest(".product-card");
    const productId_ahga = parseInt(productCard_ahga.dataset.id);
    console.log(`Botón agregar clickeado para producto ID: ${productId_ahga}`);
    agregarAlCarrito_ahga(productId_ahga);
  }
});

// Delegación de eventos para el carrito
contenedorItemsCarrito_ahga.addEventListener("click", (e_ahga) => {
  const cartItem_ahga = e_ahga.target.closest(".cart-item");
  if (!cartItem_ahga) return;

  const productId_ahga = parseInt(cartItem_ahga.dataset.id);
  console.log(`Interacción con item del carrito ID: ${productId_ahga}`);

  if (e_ahga.target.closest(".increase-btn")) {
    console.log("Botón aumentar cantidad clickeado");
    aumentarCantidad_ahga(productId_ahga);
  } else if (e_ahga.target.closest(".decrease-btn")) {
    console.log("Botón disminuir cantidad clickeado");
    disminuirCantidad_ahga(productId_ahga);
  } else if (e_ahga.target.closest(".remove-btn")) {
    console.log("Botón eliminar clickeado");
    eliminarDelCarrito_ahga(productId_ahga);
  }
});

// Inicialización
console.log("Inicializando aplicación...");
cargarProductos_ahga();
