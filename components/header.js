class Header_AHGA extends HTMLElement {
  constructor() {
    super();
    const opciones_AHGA = JSON.parse(
      this.getAttribute("opciones_AHGA") || "{}"
    );
    const base_AHGA = this.getAttribute("base_AHGA") || ".";

    // Detectar si estamos en breefing.html
    const isBreefingPage = location.pathname.endsWith("breefing.html");

    // Elegir el conjunto de enlaces según la página
    const enlacesHeader = isBreefingPage
      ? [
          { href: "#inicio", label: "Inicio" },
          { href: "#sobre-el-juego", label: "Sobre el juego" },
          { href: "#reglas", label: "Reglas del juego" },
        ]
      : [
          { href: "/index.html", label: "Inicio" },
          { href: "/dist/carrito.html", label: "Compra Juegos" },
          { href: "/dist/breefing.html", label: "Nuevo Lanzamiento" },
          { href: "#galeria", label: "Galería" },
          { href: "#contacto", label: "Contacto" },
        ];

    this.innerHTML = `
      <header class="bg-[#0D0A0B] border-b border-[#454955] sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center relative">
          <div class="flex items-center">
            <a href="/index.html" class="flex items-center space-x-2 hover:opacity-80">
              <img src="${base_AHGA}/img/logo80x80.png" alt="Logo de Nexus AG" class="w-10 h-10 rounded-lg mr-3 object-cover" />
              <span class="title-font text-2xl text-[#72B01D]">NEXUS AG</span>
            </a>
        </div>

          <button id="menu-btn_ahga" class="md:hidden flex flex-col justify-between w-8 h-6 focus:outline-none group">
            <span class="block w-full h-1 bg-[#72B01D] rounded transition-transform duration-300 group-[.open]:rotate-45 group-[.open]:translate-y-[9px]"></span>
            <span class="block w-full h-1 bg-[#72B01D] rounded transition-opacity duration-300 group-[.open]:opacity-0"></span>
            <span class="block w-full h-1 bg-[#72B01D] rounded transition-transform duration-300 group-[.open]:-rotate-45 group-[.open]:-translate-y-[9px]"></span>
          </button>

          <nav id="menu-nav_ahga" class="absolute top-full left-0 w-full md:static md:w-auto md:flex bg-[#0D0A0B] md:bg-transparent border-t md:border-none border-[#454955] transform scale-y-0 origin-top transition-transform duration-300 ease-in-out md:scale-y-100 md:transform-none hidden md:flex-row md:items-center md:space-x-8">
            ${enlacesHeader
              .map((link_ahga) => {
                let href_ahga = "";

                if (
                  ["galería", "contacto"].includes(
                    link_ahga.label.toLowerCase()
                  )
                ) {
                  const anchor = link_ahga.href.replace("#", "");
                  href_ahga = `${base_AHGA.replace(
                    /\/dist$/,
                    ""
                  )}/index.html#${anchor}`;
                } else if (link_ahga.href.startsWith("#")) {
                  href_ahga = link_ahga.href;
                } else {
                  href_ahga = `${base_AHGA}/${link_ahga.href.replace(
                    /^\.?\/*/,
                    ""
                  )}`;
                }

                return `<a href="${href_ahga}" class="link_ahga block px-4 py-2 text-center md:p-0 body-font hover:text-[#72B01D]">${link_ahga.label}</a>`;
              })
              .join("")}
          </nav>

          <div class="hidden md:flex items-center space-x-4">
            <a href="${
              opciones_AHGA.loginHref_AHGA || base_AHGA + "/dist/login.html"
            }" class="body-font text-sm btn-secondary px-4 py-2 rounded-full">
              ${opciones_AHGA.loginLabel_AHGA || "Iniciar Sesión"}
            </a>
          </div>
        </div>

        <div class="md:hidden px-4 py-2 text-center border-t border-[#454955] bg-[#0D0A0B]">
          <a href="${
            opciones_AHGA.loginHref_AHGA || base_AHGA + "/dist/login.html"
          }" class="body-font text-sm btn-secondary px-4 py-2 rounded-full inline-block">
            ${opciones_AHGA.loginLabel_AHGA || "Iniciar Sesión"}
          </a>
        </div>
      </header>
    `;

    // Animaciones
    setTimeout(() => {
      const btn_ahga = this.querySelector("#menu-btn_ahga");
      const nav_ahga = this.querySelector("#menu-nav_ahga");
      const links_ahga = this.querySelectorAll(".link_ahga");

      const isIndex =
        location.pathname.endsWith("index.html") || location.pathname === "/";
      const isBreefing = location.pathname.endsWith("breefing.html");

      btn_ahga.addEventListener("click", () => {
        btn_ahga.classList.toggle("open");

        if (nav_ahga.classList.contains("scale-y-0")) {
          nav_ahga.classList.remove("hidden");
          setTimeout(() => nav_ahga.classList.remove("scale-y-0"), 10);
        } else {
          nav_ahga.classList.add("scale-y-0");
          setTimeout(() => nav_ahga.classList.add("hidden"), 300);
        }
      });

      links_ahga.forEach((link) => {
        link.addEventListener("click", (event) => {
          if (window.innerWidth < 768) {
            nav_ahga.classList.add("scale-y-0");
            btn_ahga.classList.remove("open");
            setTimeout(() => nav_ahga.classList.add("hidden"), 300);
          }

          const href_ahga = link.getAttribute("href");
          const isInicio = href_ahga.endsWith("index.html");
          const isAnchor =
            href_ahga.includes("#") && !href_ahga.startsWith("http");

          if ((isIndex || isBreefing) && isAnchor) {
            const anchorOnly = href_ahga.split("#")[1];
            const target_ahga = document.getElementById(anchorOnly);
            if (target_ahga) {
              event.preventDefault();
              target_ahga.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }

          if ((isIndex || isBreefing) && isInicio) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      });
    }, 0);
  }
}

customElements.define("header-ahga", Header_AHGA);
