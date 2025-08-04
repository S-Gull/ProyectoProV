class Header_AHGA extends HTMLElement {
  constructor() {
    super();
    this.opciones_AHGA = JSON.parse(this.getAttribute("opciones_AHGA") || "{}");
    this.base_AHGA = this.getAttribute("base_AHGA") || ".";

    // Renderizar header inicial
    this.renderHeader();

    // Configurar listener de autenticación de Firebase
    this.setupAuthListener();
    this.setupStorageListener();
  }

  renderHeader() {
    // Detectar si estamos en breefing.html o landing.html
    const esPaginaBreefing_ahga = location.pathname.endsWith("breefing.html");
    const esPaginaLanding_ahga = location.pathname.endsWith("landing.html");

    // Elegir el conjunto de enlaces según la página
    let enlacesHeader_ahga;

    if (esPaginaBreefing_ahga) {
      enlacesHeader_ahga = [
        { href: "#inicio", label: "Inicio" },
        { href: "#sobre-el-juego", label: "Sobre el juego" },
        { href: "#reglas", label: "Reglas del juego" },
      ];
    } else if (esPaginaLanding_ahga) {
      enlacesHeader_ahga = [
        { href: "#inicio", label: "Inicio" },
        { href: "#sobre-el-juego", label: "Características" },
        { href: "#reglas", label: "Reglas" },
      ];
    } else {
      enlacesHeader_ahga = [
        { href: "/index.html", label: "Inicio" },
        { href: "/dist/carrito.html", label: "Compra Juegos" },
        { href: "/dist/landing.html", label: "Nuevo Lanzamiento" },
        { href: "#galeria", label: "Galería" },
        { href: "#contacto", label: "Contacto" },
      ];
    }

    // Verificar si hay usuario logueado
    const datosUsuario_ahga = this.obtenerDatosUsuario_ahga();
    const estaLogueado_ahga = datosUsuario_ahga !== null;

    this.innerHTML = `
      <header class="bg-[#0D0A0B] border-b border-[#454955] sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center relative">
          <div class="flex items-center">
            <a href="/index.html" class="flex items-center space-x-2 hover:opacity-80">
              <img src="${
                this.base_AHGA
              }/img/logo80x80.png" alt="Logo de Nexus AG" class="w-10 h-10 rounded-lg mr-3 object-cover" />
              <span class="title-font text-2xl text-[#72B01D]">NEXUS AG</span>
            </a>
        </div>

          <button id="botonMenu_ahga" class="md:hidden flex flex-col justify-between w-8 h-6 focus:outline-none group">
            <span class="block w-full h-1 bg-[#72B01D] rounded transition-transform duration-300 group-[.open]:rotate-45 group-[.open]:translate-y-[9px]"></span>
            <span class="block w-full h-1 bg-[#72B01D] rounded transition-opacity duration-300 group-[.open]:opacity-0"></span>
            <span class="block w-full h-1 bg-[#72B01D] rounded transition-transform duration-300 group-[.open]:-rotate-45 group-[.open]:-translate-y-[9px]"></span>
          </button>

          <nav id="navegacionMenu_ahga" class="absolute top-full left-0 w-full md:static md:w-auto md:flex bg-[#0D0A0B] md:bg-transparent border-t md:border-none border-[#454955] transform scale-y-0 origin-top transition-transform duration-300 ease-in-out md:scale-y-100 md:transform-none hidden md:flex-row md:items-center md:space-x-8">
            ${enlacesHeader_ahga
              .map((enlace_ahga) => {
                let href_ahga = "";

                if (
                  ["galería", "contacto"].includes(
                    enlace_ahga.label.toLowerCase()
                  )
                ) {
                  const ancla_ahga = enlace_ahga.href.replace("#", "");
                  href_ahga = `${this.base_AHGA.replace(
                    /\/dist$/,
                    ""
                  )}/index.html#${ancla_ahga}`;
                } else if (enlace_ahga.href.startsWith("#")) {
                  href_ahga = enlace_ahga.href;
                } else {
                  href_ahga = `${this.base_AHGA}/${enlace_ahga.href.replace(
                    /^\.*\//,
                    ""
                  )}`;
                }

                return `<a href="${href_ahga}" class="enlace_ahga block px-4 py-2 text-center md:p-0 body-font hover:text-[#72B01D]">${enlace_ahga.label}</a>`;
              })
              .join("")}
          </nav>

          <div class="hidden md:flex items-center space-x-4">
            ${
              estaLogueado_ahga
                ? this.crearDropdownPerfil_ahga(datosUsuario_ahga)
                : this.crearBotonLogin_ahga(this.opciones_AHGA, this.base_AHGA)
            }
          </div>
        </div>

        <div class="md:hidden px-4 py-2 text-center border-t border-[#454955] bg-[#0D0A0B]">
          ${
            estaLogueado_ahga
              ? this.crearPerfilMovil_ahga(datosUsuario_ahga)
              : this.crearBotonLoginMovil_ahga(
                  this.opciones_AHGA,
                  this.base_AHGA
                )
          }
        </div>
      </header>
    `;

    // Configurar eventos después de renderizar
    setTimeout(() => {
      this.configurarEventos_ahga();
      if (estaLogueado_ahga) {
        this.configurarEventosPerfil_ahga();
      }
    }, 0);
  }

  // Configurar listener de autenticación de Firebase
  async setupAuthListener() {
    try {
      // Importar auth de Firebase
      const { auth_ahga } = await import("../firebase/services/index.js");

      // Escuchar cambios de autenticación
      auth_ahga.onAuthStateChanged(async (usuario_ahga) => {
        console.log(
          "Estado de autenticación cambió:",
          usuario_ahga ? usuario_ahga.email : "No autenticado"
        );

        if (usuario_ahga) {
          // Usuario autenticado - obtener datos adicionales y actualizar sessionStorage
          try {
            const { obtenerUsuario_ahga } = await import(
              "../firebase/services/firestore.service.js"
            );
            const datosUsuario_ahga = await obtenerUsuario_ahga(
              usuario_ahga.uid
            );

            const datosCompletosUsuario_ahga = {
              uid: usuario_ahga.uid,
              email: usuario_ahga.email,
              emailVerificado: usuario_ahga.emailVerified,
              ...datosUsuario_ahga,
              fechaRegistro:
                datosUsuario_ahga?.fechaRegistro ||
                new Date().toLocaleDateString("es-ES"),
            };

            sessionStorage.setItem(
              "datosUsuario_ahga",
              JSON.stringify(datosCompletosUsuario_ahga)
            );
          } catch (error_ahga) {
            console.error("Error al obtener datos del usuario:", error_ahga);
            // Guardar datos básicos si hay error
            const datosBasicosUsuario_ahga = {
              uid: usuario_ahga.uid,
              email: usuario_ahga.email,
              emailVerificado: usuario_ahga.emailVerified,
              fechaRegistro: new Date().toLocaleDateString("es-ES"),
            };
            sessionStorage.setItem(
              "datosUsuario_ahga",
              JSON.stringify(datosBasicosUsuario_ahga)
            );
          }
        } else {
          // Usuario no autenticado - limpiar sessionStorage
          sessionStorage.removeItem("datosUsuario_ahga");
          sessionStorage.removeItem("tokenAuth_ahga");
        }

        // Re-renderizar el header cuando cambie el estado de autenticación
        this.renderHeader();
      });
    } catch (error_ahga) {
      console.error(
        "Error al configurar listener de autenticación:",
        error_ahga
      );
    }
  }

  // Configurar listener para cambios en sessionStorage
  setupStorageListener() {
    // Escuchar cambios en sessionStorage desde otras pestañas/ventanas
    window.addEventListener("storage", (event) => {
      if (event.key === "datosUsuario_ahga") {
        console.log(
          "🔄 Datos de usuario actualizados en sessionStorage, re-renderizando header..."
        );
        this.renderHeader();
      }
    });

    // Escuchar cambios en la misma pestaña usando un evento personalizado
    window.addEventListener("userDataUpdated_ahga", () => {
      console.log(
        "🔄 Datos de usuario actualizados localmente, re-renderizando header..."
      );
      this.renderHeader();
    });
  }

  // Obtener datos del usuario desde sessionStorage
  obtenerDatosUsuario_ahga() {
    try {
      const datosUsuario_ahga = sessionStorage.getItem("datosUsuario_ahga");
      return datosUsuario_ahga ? JSON.parse(datosUsuario_ahga) : null;
    } catch (error_ahga) {
      console.error("Error al obtener datos del usuario:", error_ahga);
      return null;
    }
  }

  // Crear dropdown de perfil para desktop
  crearDropdownPerfil_ahga(datosUsuario_ahga) {
    const nombreMostrar_ahga =
      datosUsuario_ahga.nombre ||
      datosUsuario_ahga.nombreUsuario ||
      datosUsuario_ahga.email.split("@")[0];
    const avatar_ahga = datosUsuario_ahga.avatar || "../img/default-avatar.svg";

    return `
      <div class="relative">
        <button id="dropdownPerfil_ahga" class="flex items-center space-x-2 bg-[#25262b] hover:bg-[#454955] px-3 py-2 rounded-full transition-colors duration-200">
          <img src="${avatar_ahga}" alt="Avatar" class="w-8 h-8 rounded-full object-cover">
          <span class="text-[#f3eff5] text-sm font-medium">${nombreMostrar_ahga}</span>
          <svg class="w-4 h-4 text-[#f3eff5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div id="menuDropdownPerfil_ahga" class="absolute right-0 mt-2 w-48 bg-[#25262b] border border-[#454955] rounded-lg shadow-lg z-50 hidden">
          <div class="py-1">
            <button id="verPerfil_ahga" class="w-full text-left px-4 py-2 text-[#f3eff5] hover:bg-[#454955] transition-colors duration-200">
              <i class="fas fa-user mr-2"></i>Ver Perfil
            </button>
            <button id="editarPerfil_ahga" class="w-full text-left px-4 py-2 text-[#f3eff5] hover:bg-[#454955] transition-colors duration-200">
              <i class="fas fa-edit mr-2"></i>Editar Perfil
            </button>
            <hr class="border-[#454955] my-1">
            <button id="cerrarSesion_ahga" class="w-full text-left px-4 py-2 text-red-400 hover:bg-[#454955] transition-colors duration-200">
              <i class="fas fa-sign-out-alt mr-2"></i>Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Crear botón de login para desktop
  crearBotonLogin_ahga(opciones_AHGA, base_AHGA) {
    return `
      <a href="${
        opciones_AHGA.loginHref_AHGA || base_AHGA + "/dist/login.html"
      }" class="body-font text-sm btn-secondary px-4 py-2 rounded-full">
        ${opciones_AHGA.loginLabel_AHGA || "Iniciar Sesión"}
      </a>
    `;
  }

  // Crear perfil móvil
  crearPerfilMovil_ahga(datosUsuario_ahga) {
    const nombreMostrar_ahga =
      datosUsuario_ahga.nombre ||
      datosUsuario_ahga.nombreUsuario ||
      datosUsuario_ahga.email.split("@")[0];
    return `
      <div class="flex items-center justify-center space-x-4">
        <button id="verPerfilMovil_ahga" class="body-font text-sm btn-secondary px-4 py-2 rounded-full">
          Perfil (${nombreMostrar_ahga})
        </button>
        <button id="cerrarSesionMovil_ahga" class="body-font text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full">
          Salir
        </button>
      </div>
    `;
  }

  // Crear botón de login móvil
  crearBotonLoginMovil_ahga(opciones_AHGA, base_AHGA) {
    return `
      <a href="${
        opciones_AHGA.loginHref_AHGA || base_AHGA + "/dist/login.html"
      }" class="body-font text-sm btn-secondary px-4 py-2 rounded-full inline-block">
        ${opciones_AHGA.loginLabel_AHGA || "Iniciar Sesión"}
      </a>
    `;
  }

  // Configurar eventos generales
  configurarEventos_ahga() {
    const boton_ahga = this.querySelector("#botonMenu_ahga");
    const navegacion_ahga = this.querySelector("#navegacionMenu_ahga");
    const enlaces_ahga = this.querySelectorAll(".enlace_ahga");

    const esIndex_ahga =
      location.pathname.endsWith("index.html") || location.pathname === "/";
    const esBreefing_ahga = location.pathname.endsWith("breefing.html");
    const esLanding_ahga = location.pathname.endsWith("landing.html");

    boton_ahga.addEventListener("click", () => {
      boton_ahga.classList.toggle("open");

      if (navegacion_ahga.classList.contains("scale-y-0")) {
        navegacion_ahga.classList.remove("hidden");
        setTimeout(() => navegacion_ahga.classList.remove("scale-y-0"), 10);
      } else {
        navegacion_ahga.classList.add("scale-y-0");
        setTimeout(() => navegacion_ahga.classList.add("hidden"), 300);
      }
    });

    enlaces_ahga.forEach((enlace_ahga) => {
      enlace_ahga.addEventListener("click", (evento_ahga) => {
        if (document.documentElement.clientWidth < 768) {
          navegacion_ahga.classList.add("scale-y-0");
          boton_ahga.classList.remove("open");
          setTimeout(() => navegacion_ahga.classList.add("hidden"), 300);
        }

        const href_ahga = enlace_ahga.getAttribute("href");
        const esInicio_ahga = href_ahga.endsWith("index.html");
        const esAncla_ahga =
          href_ahga.includes("#") && !href_ahga.startsWith("http");

        if (
          (esIndex_ahga || esBreefing_ahga || esLanding_ahga) &&
          esAncla_ahga
        ) {
          const soloAncla_ahga = href_ahga.split("#")[1];
          const objetivo_ahga = document.getElementById(soloAncla_ahga);
          if (objetivo_ahga) {
            evento_ahga.preventDefault();
            objetivo_ahga.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }

        if (
          (esIndex_ahga || esBreefing_ahga || esLanding_ahga) &&
          esInicio_ahga
        ) {
          evento_ahga.preventDefault();
          document.documentElement.scrollTop = 0;
        }
      });
    });
  }

  // Configurar eventos del perfil
  configurarEventosPerfil_ahga() {
    // Dropdown toggle
    const dropdownPerfil_ahga = this.querySelector("#dropdownPerfil_ahga");
    const menuDropdown_ahga = this.querySelector("#menuDropdownPerfil_ahga");

    if (dropdownPerfil_ahga && menuDropdown_ahga) {
      dropdownPerfil_ahga.addEventListener("click", (evento_ahga) => {
        evento_ahga.stopPropagation();
        menuDropdown_ahga.classList.toggle("hidden");
      });

      // Cerrar dropdown al hacer click fuera
      document.addEventListener("click", () => {
        menuDropdown_ahga.classList.add("hidden");
      });
    }

    // Obtener instancia del ProfileManager
    const profileManager = document.querySelector("profile-manager-ahga");

    // Ver perfil
    const botonesVerPerfil_ahga = this.querySelectorAll(
      "#verPerfil_ahga, #verPerfilMovil_ahga"
    );
    botonesVerPerfil_ahga.forEach((boton_ahga) => {
      boton_ahga.addEventListener("click", () => {
        // Redirigir al ver-perfil.html
        window.location.href = "/dist/ver-perfil.html";
        if (menuDropdown_ahga) menuDropdown_ahga.classList.add("hidden");
      });
    });

    // Editar perfil
    const botonEditarPerfil_ahga = this.querySelector("#editarPerfil_ahga");
    if (botonEditarPerfil_ahga) {
      botonEditarPerfil_ahga.addEventListener("click", () => {
        // Redirigir a la página de editar perfil
        window.location.href = "/dist/editar-perfil.html";
        if (menuDropdown_ahga) menuDropdown_ahga.classList.add("hidden");
      });
    }

    // Cerrar sesión
    const botonesCerrarSesion_ahga = this.querySelectorAll(
      "#cerrarSesion_ahga, #cerrarSesionMovil_ahga"
    );
    botonesCerrarSesion_ahga.forEach((boton_ahga) => {
      boton_ahga.addEventListener("click", () => {
        this.cerrarSesion_ahga();
      });
    });
  }

  // Cerrar sesión
  cerrarSesion_ahga() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      // Limpiar sessionStorage
      sessionStorage.removeItem("datosUsuario_ahga");

      // Cerrar sesión en Firebase
      this.cerrarSesionEnFirebase_ahga();

      // Redirigir a login
      location.href = "/dist/login.html";
    }
  }

  // Cerrar sesión en Firebase
  async cerrarSesionEnFirebase_ahga() {
    try {
      // Importar y usar la función de cerrar sesión
      const { cerrarSesion_ahga } = await import(
        "../firebase/services/auth.service.js"
      );
      await cerrarSesion_ahga();
    } catch (error_ahga) {
      console.error("Error al cerrar sesión en Firebase:", error_ahga);
    }
  }
}

customElements.define("header-ahga", Header_AHGA);
