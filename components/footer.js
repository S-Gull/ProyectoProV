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
                <img src="${base_AHGA}/img/logo80x80.png" alt="Logo de Nexus AG" class="w-10 h-10 rounded-lg mr-3 object-cover" />
                <h3 class="title-font text-2xl text-[#72B01D]">NEXUS AG</h3>
              </div>
              <p class="body-font text-[#F3EFF5]/80 mb-4">
                Creando experiencias de juego innovadoras, inmersivas y con alta rejugabilidad.
              </p>
              <div class="flex space-x-4">
                <!-- Instagram -->
                <a href="#" class="relative group">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#454955] to-[#454955] group-hover:from-[#f09433] group-hover:via-[#dc2743] group-hover:to-[#bc1888] transition-all duration-500 flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 bg-[#454955] rounded-full transition-all duration-300 group-hover:opacity-0"></div>
                    <img src="${base_AHGA}/img/instagram.svg" alt="Instagram" class="w-5 h-5 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-[#72B01D] font-medium whitespace-nowrap">
                    Instagram
                  </div>
                </a>
                <!-- YouTube -->
                <a href="#" class="relative group">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#454955] to-[#454955] group-hover:from-[#FF0000] group-hover:to-[#FF0000] transition-all duration-500 flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 bg-[#454955] rounded-full transition-all duration-300 group-hover:opacity-0"></div>
                    <img src="${base_AHGA}/img/youtube.svg" alt="YouTube" class="w-5 h-5 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-[#72B01D] font-medium whitespace-nowrap">
                    YouTube
                  </div>
                </a>
                <!-- Twitch -->
                <a href="#" class="relative group">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[#454955] to-[#454955] group-hover:from-[#6441a5] group-hover:to-[#6441a5] transition-all duration-500 flex items-center justify-center overflow-hidden">
                    <div class="absolute inset-0 bg-[#454955] rounded-full transition-all duration-300 group-hover:opacity-0"></div>
                    <img src="${base_AHGA}/img/twitch.svg" alt="Twitch" class="w-5 h-5 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-[#72B01D] font-medium whitespace-nowrap">
                    Twitch
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h4 class="title-font text-lg font-semibold mb-4">Menú</h4>
              <ul class="space-y-2">
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Seguimiento de pedidos</a></li>
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Ubicación de tiendas</a></li>
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Política de devolución</a></li>
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Soporte técnico</a></li>
              </ul>
            </div>

            <div>
              <h4 class="title-font text-lg font-semibold mb-4">Recursos</h4>
              <ul class="space-y-2">
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Blog</a></li>
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Centro de ayuda</a></li>
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Documentación</a></li>
                <li><a href="#" class="body-font text-[#F3EFF5]/80 hover:text-[#72B01D] transition">Guías de juego</a></li>
              </ul>
            </div>

            <div>
              <h4 class="title-font text-lg font-semibold mb-4">Contáctanos</h4>
              <ul class="space-y-3">
                <li class="body-font text-[#F3EFF5]/80 flex items-start">
                  <svg class="w-5 h-5 mr-2 mt-0.5 text-[#72B01D]" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                  </svg>
                  Oficina virtual, contacto online
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
                  info@nexusag.com
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
