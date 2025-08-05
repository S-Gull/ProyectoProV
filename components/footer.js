class Footer_AHGA extends HTMLElement {
  constructor() {
    super();
    const base_AHGA = this.getAttribute("base_AHGA") || ".";

    this.innerHTML = `
      <footer class="bg-[#0D0A0B] border-t border-[#454955] pt-16 pb-8">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div class="flex items-center mb-6">
               
                <h3 class="title-font text-2xl text-[#72B01D]">NEXUS AG</h3>
              </div>
              <p class="body-font text-[#F3EFF5]/80 mb-4">
                Creando experiencias de juego innovadoras, inmersivas y con alta rejugabilidad.
              </p>

            </div>

            <div>
              <h4 class="title-font text-lg font-semibold mb-4">Menú</h4>
              <ul class="space-y-2">
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Seguimiento de pedidos</div></li>
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Ubicación de tiendas</div></li>
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Política de devolución</div></li>
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Soporte técnico</div></li>
              </ul>
            </div>

            <div>
              <h4 class="title-font text-lg font-semibold mb-4">Recursos</h4>
              <ul class="space-y-2">
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Blog</div></li>
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Centro de ayuda</div></li>
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Documentación</div></li>
                <li><div class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Guías de juego</div></li>
              </ul>
            </div>

            <div>
              <h4 class="title-font text-lg font-semibold mb-4">Contáctanos</h4>
              <ul class="space-y-3">
                <li class="body-font text-[#F3EFF5]/80 flex items-start">
                  <svg class="w-5 h-5 mr-2 mt-0.5 text-[#72B01D]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  Oripoto Caracas, contacto online
                </li>
                <li class="body-font text-[#F3EFF5]/80 flex items-start">
                  <svg class="w-5 h-5 mr-2 mt-0.5 text-[#72B01D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                  +58 212 878 9632
                </li>
                <li class="body-font text-[#F3EFF5]/80 flex items-start">
                  <svg class="w-5 h-5 mr-2 mt-0.5 text-[#72B01D]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  nexusag.games@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div class="border-t border-[#454955] pt-8 text-center">
            <p class="body-font text-[#F3EFF5]/60">
              &copy; 2024 Nexus AG. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    `;
  }
}
customElements.define("footer-ahga", Footer_AHGA);
