import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

const DB_NAME_ahga = "nexusag_carrito.sqlite";
let db_ahga;
let iniciado_ahga = false;

const iniciarDB_ahga = async () => {
  const sqlite3_ahga = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  });

  if ("opfs" in sqlite3_ahga) {
    db_ahga = new sqlite3_ahga.oo1.OpfsDb(DB_NAME_ahga);
  } else {
    db_ahga = new sqlite3_ahga.oo1.DB(DB_NAME_ahga, "ct");
  }

  // Crear nuevas tablas con sufijo _ahga
  await db_ahga.exec(`
    CREATE TABLE IF NOT EXISTS pedidos_ahga (
      id_ahga INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha_ahga TEXT NOT NULL,
      total_ahga REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS detalle_pedido_ahga (
      id_ahga INTEGER PRIMARY KEY AUTOINCREMENT,
      id_pedido_ahga INTEGER,
      producto_id_ahga INTEGER,
      nombre_ahga TEXT,
      cantidad_ahga INTEGER,
      precio_unitario_ahga REAL,
      img_ahga TEXT,
      FOREIGN KEY (id_pedido_ahga) REFERENCES pedidos_ahga(id_ahga)
    );

    CREATE TABLE IF NOT EXISTS carrito_ahga (
      id_producto_ahga INTEGER PRIMARY KEY,
      nombre_ahga TEXT,
      cantidad_ahga INTEGER,
      precio_unitario_ahga REAL,
      img_ahga TEXT
    );

    CREATE TABLE IF NOT EXISTS productos_ahga (
      id_producto_ahga INTEGER PRIMARY KEY,
      nombre_ahga TEXT,
      cantidad_ahga INTEGER,
      desc_ahga TEXT,
      precio_ahga REAL,
      img_ahga TEXT,
      existencia_ahga INTEGER
    );
  `);

  // Sincronizar productos desde JSON a la base de datos
  await sincronizarProductos_ahga();

  iniciado_ahga = true;
};

const sincronizarProductos_ahga = async () => {
  try {
    const respuesta_ahga = await fetch("../json/productos.json");
    const productos_ahga = await respuesta_ahga.json();

    for (const producto_ahga of productos_ahga) {
      await db_ahga.exec({
        sql: `INSERT OR REPLACE INTO productos_ahga 
              (id_producto_ahga, nombre_ahga, cantidad_ahga, desc_ahga, precio_ahga, img_ahga, existencia_ahga)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        bind: [
          producto_ahga.id,
          producto_ahga.nombre,
          producto_ahga.cantidad || 0,
          producto_ahga.desc,
          producto_ahga.precio,
          producto_ahga.img,
          producto_ahga.existencia,
        ],
      });
    }
    console.log("Productos sincronizados en la base de datos");
  } catch (error_ahga) {
    console.error("Error sincronizando productos:", error_ahga);
  }
};

const guardarPedido_ahga = async (items_ahga, total_ahga) => {
  const fecha_ahga = new Date().toISOString();

  await db_ahga.exec("BEGIN TRANSACTION");

  try {
    // Insertar pedido principal
    await db_ahga.exec({
      sql: "INSERT INTO pedidos_ahga (fecha_ahga, total_ahga) VALUES (?, ?)",
      bind: [fecha_ahga, total_ahga],
    });

    const pedidoId_ahga = db_ahga.lastInsertRowId;

    // Insertar detalles del pedido y actualizar stock
    for (const item_ahga of items_ahga) {
      // Insertar detalle del pedido
      await db_ahga.exec({
        sql: `INSERT INTO detalle_pedido_ahga 
              (id_pedido_ahga, producto_id_ahga, nombre_ahga, cantidad_ahga, precio_unitario_ahga, img_ahga)
              VALUES (?, ?, ?, ?, ?, ?)`,
        bind: [
          pedidoId_ahga,
          item_ahga.id,
          item_ahga.nombre,
          item_ahga.cantidad,
          item_ahga.precio,
          item_ahga.img,
        ],
      });

      // Actualizar stock del producto (disminuir existencia)
      await db_ahga.exec({
        sql: `UPDATE productos_ahga 
              SET existencia_ahga = existencia_ahga - ? 
              WHERE id_producto_ahga = ? AND existencia_ahga >= ?`,
        bind: [item_ahga.cantidad, item_ahga.id, item_ahga.cantidad],
      });

      // Verificar si la actualización fue exitosa
      const result_ahga = await db_ahga.exec({
        sql: "SELECT changes() as cambios",
        returnValue: "resultRows",
        rowMode: "object",
      });

      if (result_ahga[0]?.cambios === 0) {
        throw new Error(
          `Stock insuficiente para el producto: ${item_ahga.nombre}`
        );
      }
    }

    await db_ahga.exec("COMMIT");
    return pedidoId_ahga;
  } catch (error_ahga) {
    await db_ahga.exec("ROLLBACK");
    throw error_ahga;
  }
};

const guardarCarrito_ahga = async (items_ahga) => {
  await db_ahga.exec("BEGIN TRANSACTION");
  await db_ahga.exec("DELETE FROM carrito_ahga");

  for (const item_ahga of items_ahga) {
    await db_ahga.exec({
      sql: `INSERT INTO carrito_ahga 
            (id_producto_ahga, nombre_ahga, cantidad_ahga, precio_unitario_ahga, img_ahga)
            VALUES (?, ?, ?, ?, ?)`,
      bind: [
        item_ahga.id,
        item_ahga.nombre,
        item_ahga.cantidad,
        item_ahga.precio,
        item_ahga.img,
      ],
    });
  }

  await db_ahga.exec("COMMIT");
};

const obtenerCarrito_ahga = async () => {
  const result_ahga = await db_ahga.exec({
    sql: `SELECT id_producto_ahga as id, nombre_ahga as nombre, cantidad_ahga as cantidad, 
          precio_unitario_ahga as precio, img_ahga as img 
          FROM carrito_ahga`,
    returnValue: "resultRows",
    rowMode: "object",
  });
  return result_ahga;
};

const vaciarCarrito_ahga = async () => {
  await db_ahga.exec("DELETE FROM carrito_ahga");
};

const obtenerStockProducto_ahga = async (id_producto_ahga) => {
  const result_ahga = await db_ahga.exec({
    sql: "SELECT existencia_ahga FROM productos_ahga WHERE id_producto_ahga = ?",
    bind: [id_producto_ahga],
    returnValue: "resultRows",
    rowMode: "object",
  });
  return result_ahga[0]?.existencia_ahga || 0;
};

const obtenerTodosLosStocks_ahga = async () => {
  const result_ahga = await db_ahga.exec({
    sql: "SELECT id_producto_ahga as id, existencia_ahga as stock FROM productos_ahga",
    returnValue: "resultRows",
    rowMode: "object",
  });
  return result_ahga;
};

const verificarStockDisponible_ahga = async (items_ahga) => {
  for (const item_ahga of items_ahga) {
    const stockActual_ahga = await obtenerStockProducto_ahga(item_ahga.id);
    if (stockActual_ahga < item_ahga.cantidad) {
      return {
        disponible: false,
        producto: item_ahga.nombre,
        stockActual: stockActual_ahga,
        cantidadSolicitada: item_ahga.cantidad,
      };
    }
  }
  return { disponible: true };
};

self.onmessage = async (e_ahga) => {
  const [accion_ahga, data_ahga] = e_ahga.data;

  try {
    switch (accion_ahga) {
      case "iniciar":
        await iniciarDB_ahga();
        self.postMessage(["iniciado"]);
        break;

      case "guardar_pedido":
        // Verificar stock antes de guardar el pedido
        const verificacion_ahga = await verificarStockDisponible_ahga(
          data_ahga.items
        );
        if (!verificacion_ahga.disponible) {
          self.postMessage(["error_stock", verificacion_ahga]);
          break;
        }

        const id_ahga = await guardarPedido_ahga(
          data_ahga.items,
          data_ahga.total
        );
        await vaciarCarrito_ahga();
        self.postMessage(["pedido_guardado", id_ahga]);
        break;

      case "guardar_carrito":
        await guardarCarrito_ahga(data_ahga);
        self.postMessage(["carrito_guardado"]);
        break;

      case "obtener_carrito":
        const carrito_ahga = await obtenerCarrito_ahga();
        self.postMessage(["carrito_obtenido", carrito_ahga]);
        break;

      case "vaciar_carrito":
        await vaciarCarrito_ahga();
        self.postMessage(["carrito_vaciado"]);
        break;

      case "verificar_stock":
        const stockDisponible_ahga = await verificarStockDisponible_ahga(
          data_ahga
        );
        self.postMessage(["stock_verificado", stockDisponible_ahga]);
        break;

      case "obtener_stock":
        const stock_ahga = await obtenerStockProducto_ahga(data_ahga.id);
        self.postMessage([
          "stock_obtenido",
          { id: data_ahga.id, stock: stock_ahga },
        ]);
        break;

      case "obtener_todos_stocks":
        const todosLosStocks_ahga = await obtenerTodosLosStocks_ahga();
        self.postMessage(["stocks_obtenidos", todosLosStocks_ahga]);
        break;

      default:
        console.log("Acción conocida:", accion_ahga);
    }
  } catch (error_ahga) {
    console.error("❌ Error en Worker:", error_ahga);
    self.postMessage(["error", error_ahga.message]);
  }
};
