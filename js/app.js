// app.js 

import { ControladorJuego_ah_ga } from '../js/administradorJuego.js';
        
        const canvas_ah_ga = document.getElementById('canvasJuego_ah_ga');
        new ControladorJuego_ah_ga(canvas_ah_ga);
        
        // Evento para el botón de ayuda
        document.getElementById('botonAyuda_ah_ga').addEventListener('click', () => {
            alert(`REGLAS DEL JUEGO ASALTO:
            
1. OBJETIVOS:
   - Atacantes (Soldados): Ocupar la fortaleza o capturar ambos oficiales
   - Defensores (Oficiales): Eliminar suficientes soldados (menos de 9)

2. MOVIMIENTOS:
   - Soldados: Avanzan hacia arriba o lateralmente
   - Oficiales: Se mueven en cualquier dirección y capturan saltando

3. TURNOS:
   - Alternados entre atacantes y defensores
   - Selecciona tu pieza y luego la casilla destino`);
        });