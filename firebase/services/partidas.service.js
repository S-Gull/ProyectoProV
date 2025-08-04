/**
 * Servicio para manejar las partidas del juego Asalto
 * Guarda resultados, estadísticas y historial de partidas
 */

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

import { db_ahga } from "./index.js";
import { createFriendlyError_ahga } from "../utils/error-handler.js";

/**
 * Guarda el resultado de una partida en Firebase
 * @param {Object} datosPartida - Datos de la partida
 * @param {string} datosPartida.jugador1Id - ID del jugador 1
 * @param {string} datosPartida.jugador1Nombre - Nombre del jugador 1
 * @param {string} datosPartida.jugador1Equipo - Equipo del jugador 1 ('soldado' o 'oficial')
 * @param {string|null} datosPartida.jugador2Id - ID del jugador 2 (null si es invitado)
 * @param {string} datosPartida.jugador2Nombre - Nombre del jugador 2
 * @param {string} datosPartida.jugador2Equipo - Equipo del jugador 2 ('soldado' o 'oficial')
 * @param {string} datosPartida.ganador - ID del ganador o 'invitado'
 * @param {string} datosPartida.equipoGanador - Equipo ganador ('soldado' o 'oficial')
 * @param {string} datosPartida.tipoVictoria - Tipo de victoria
 * @param {number} datosPartida.duracionMinutos - Duración de la partida en minutos
 * @returns {Promise<string>} ID de la partida guardada
 */
export const guardarPartida_ahga = async (datosPartida_ahga) => {
  try {
    const partidaData_ahga = {
      ...datosPartida_ahga,
      fechaCreacion: serverTimestamp(),
      estado: 'finalizada'
    };

    const docRef_ahga = await addDoc(collection(db_ahga, "partidas"), partidaData_ahga);
    console.log("Partida guardada con ID:", docRef_ahga.id);
    
    // Actualizar estadísticas de los jugadores
    // Siempre actualizar estadísticas del jugador 1 (usuario logueado)
    await actualizarEstadisticasJugador_ahga(datosPartida_ahga.jugador1Id, {
      equipo: datosPartida_ahga.jugador1Equipo,
      gano: datosPartida_ahga.ganador === datosPartida_ahga.jugador1Id
    });
    
    // Solo actualizar estadísticas del jugador 2 si está registrado (tiene ID)
    if (datosPartida_ahga.jugador2Id) {
      await actualizarEstadisticasJugador_ahga(datosPartida_ahga.jugador2Id, {
        equipo: datosPartida_ahga.jugador2Equipo,
        gano: datosPartida_ahga.ganador === datosPartida_ahga.jugador2Id
      });
    }
    // Si el jugador 2 es invitado (no tiene ID), no se actualizan sus estadísticas
    // pero sí se registra la partida y se actualizan las estadísticas del jugador 1
    
    return docRef_ahga.id;
  } catch (error_ahga) {
    console.error("Error al guardar partida:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al guardar el resultado de la partida"
    );
  }
};

/**
 * Actualiza las estadísticas de un jugador
 * @param {string} jugadorId - ID del jugador
 * @param {Object} datosPartida - Datos de la partida para el jugador
 */
const actualizarEstadisticasJugador_ahga = async (jugadorId_ahga, datosPartida_ahga) => {
  try {
    const estadisticasRef_ahga = doc(db_ahga, "estadisticas", jugadorId_ahga);
    const estadisticasDoc_ahga = await getDoc(estadisticasRef_ahga);
    
    let estadisticas_ahga;
    if (estadisticasDoc_ahga.exists()) {
      estadisticas_ahga = estadisticasDoc_ahga.data();
    } else {
      estadisticas_ahga = {
        partidasJugadas: 0,
        partidasGanadas: 0,
        partidasPerdidas: 0,
        victoriasComoAtacante: 0,
        victoriasComoDefensor: 0,
        derrotasComoAtacante: 0,
        derrotasComoDefensor: 0
      };
    }
    
    // Actualizar estadísticas
    estadisticas_ahga.partidasJugadas += 1;
    
    if (datosPartida_ahga.gano) {
      estadisticas_ahga.partidasGanadas += 1;
      if (datosPartida_ahga.equipo === 'soldado') {
        estadisticas_ahga.victoriasComoAtacante += 1;
      } else {
        estadisticas_ahga.victoriasComoDefensor += 1;
      }
    } else {
      estadisticas_ahga.partidasPerdidas += 1;
      if (datosPartida_ahga.equipo === 'soldado') {
        estadisticas_ahga.derrotasComoAtacante += 1;
      } else {
        estadisticas_ahga.derrotasComoDefensor += 1;
      }
    }
    
    estadisticas_ahga.ultimaActualizacion = serverTimestamp();
    
    await setDoc(estadisticasRef_ahga, estadisticas_ahga);
    console.log("Estadísticas actualizadas para jugador:", jugadorId_ahga);
  } catch (error_ahga) {
    console.error("Error al actualizar estadísticas:", error_ahga);
    // No lanzamos error aquí para no interrumpir el guardado de la partida
  }
};

/**
 * Obtiene el historial de partidas de un jugador
 * @param {string} jugadorId - ID del jugador
 * @param {number} limite - Número máximo de partidas a obtener
 * @returns {Promise<Array>} Array de partidas
 */
export const obtenerHistorialPartidas_ahga = async (jugadorId_ahga, limite_ahga = 10) => {
  try {
    const q_ahga = query(
      collection(db_ahga, "partidas"),
      where("jugador1Id", "==", jugadorId_ahga),
      orderBy("fechaCreacion", "desc"),
      limit(limite_ahga)
    );
    
    const q2_ahga = query(
      collection(db_ahga, "partidas"),
      where("jugador2Id", "==", jugadorId_ahga),
      orderBy("fechaCreacion", "desc"),
      limit(limite_ahga)
    );
    
    const [snapshot1_ahga, snapshot2_ahga] = await Promise.all([
      getDocs(q_ahga),
      getDocs(q2_ahga)
    ]);
    
    const partidas_ahga = [];
    
    snapshot1_ahga.forEach((doc_ahga) => {
      partidas_ahga.push({ id: doc_ahga.id, ...doc_ahga.data() });
    });
    
    snapshot2_ahga.forEach((doc_ahga) => {
      partidas_ahga.push({ id: doc_ahga.id, ...doc_ahga.data() });
    });
    
    // Ordenar por fecha y limitar
    return partidas_ahga
      .sort((a, b) => b.fechaCreacion?.toDate() - a.fechaCreacion?.toDate())
      .slice(0, limite_ahga);
  } catch (error_ahga) {
    console.error("Error al obtener historial:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al obtener el historial de partidas"
    );
  }
};

/**
 * Obtiene las estadísticas de un jugador
 * @param {string} jugadorId - ID del jugador
 * @returns {Promise<Object|null>} Estadísticas del jugador
 */
export const obtenerEstadisticasJugador_ahga = async (jugadorId_ahga) => {
  try {
    const estadisticasRef_ahga = doc(db_ahga, "estadisticas", jugadorId_ahga);
    const estadisticasDoc_ahga = await getDoc(estadisticasRef_ahga);
    
    if (estadisticasDoc_ahga.exists()) {
      return { id: estadisticasDoc_ahga.id, ...estadisticasDoc_ahga.data() };
    } else {
      return null;
    }
  } catch (error_ahga) {
    console.error("Error al obtener estadísticas:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al obtener las estadísticas del jugador"
    );
  }
};

/**
 * Obtiene el ranking de jugadores
 * @param {number} limite - Número de jugadores a obtener
 * @returns {Promise<Array>} Array de jugadores ordenados por victorias
 */
export const obtenerRanking_ahga = async (limite_ahga = 10) => {
  try {
    const q_ahga = query(
      collection(db_ahga, "estadisticas"),
      orderBy("partidasGanadas", "desc"),
      limit(limite_ahga)
    );
    
    const querySnapshot_ahga = await getDocs(q_ahga);
    const ranking_ahga = [];
    
    for (const doc_ahga of querySnapshot_ahga.docs) {
      const estadisticas_ahga = { id: doc_ahga.id, ...doc_ahga.data() };
      
      // Obtener datos del usuario
      const usuarioRef_ahga = doc(db_ahga, "users", doc_ahga.id);
      const usuarioDoc_ahga = await getDoc(usuarioRef_ahga);
      
      if (usuarioDoc_ahga.exists()) {
        const datosUsuario_ahga = usuarioDoc_ahga.data();
        ranking_ahga.push({
          ...estadisticas_ahga,
          nombreUsuario: datosUsuario_ahga.nombreUsuario || datosUsuario_ahga.nombre,
          nombre: datosUsuario_ahga.nombre,
          apellido: datosUsuario_ahga.apellido
        });
      }
    }
    
    return ranking_ahga;
  } catch (error_ahga) {
    console.error("Error al obtener ranking:", error_ahga);
    throw createFriendlyError_ahga(
      error_ahga,
      "Error al obtener el ranking de jugadores"
    );
  }
};