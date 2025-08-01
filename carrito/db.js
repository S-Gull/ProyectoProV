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

  // Eliminar todas las tablas antiguas
  await db_ahga.exec(`
    DROP TABLE IF EXISTS pedidos;
    DROP TABLE IF EXISTS detalle_pedido_ah;
    DROP TABLE IF EXISTS carrito;
    DROP TABLE IF EXISTS productos_agha;
    DROP TABLE IF EXISTS pedidos_ahga;
    DROP TABLE IF EXISTS detalle_pedido_ahga;
    DROP TABLE IF EXISTS carrito_ahga;
    DROP TABLE IF EXISTS productos_ahga;
  `);

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

  iniciado_ahga = true;
};

const guardarPedido_ahga = async (items_ahga, total_ahga) => {
  const fecha_ahga = new Date().toISOString();

  await db_ahga.exec("BEGIN TRANSACTION");

  // Insertar pedido principal
  await db_ahga.exec({
    sql: "INSERT INTO pedidos_ahga (fecha_ahga, total_ahga) VALUES (?, ?)",
    bind: [fecha_ahga, total_ahga],
  });

  const pedidoId_ahga = db_ahga.lastInsertRowId;

  // Insertar detalles del pedido
  for (const item_ahga of items_ahga) {
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
  }

  await db_ahga.exec("COMMIT");
  return pedidoId_ahga;
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

self.onmessage = async (e_ahga) => {
  const [accion_ahga, data_ahga] = e_ahga.data;

  try {
    switch (accion_ahga) {
      case "iniciar":
        await iniciarDB_ahga();
        self.postMessage(["iniciado"]);
        break;

      case "guardar_pedido":
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

      default:
        console.log("Acción conocida:", accion_ahga);
    }
  } catch (error_ahga) {
    console.error("❌ Error en Worker:", error_ahga);
    self.postMessage(["error", error_ahga.message]);
  }
};
