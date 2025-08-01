export const setupMobileMenu_AHGA = () => {
  const menuToggle_AHGA = document.querySelector("[data-menu-toggle]");
  const menu_AHGA = document.querySelector("[data-menu]");

  if (menuToggle_AHGA && menu_AHGA) {
    menuToggle_AHGA.addEventListener("click", () => {
      menu_AHGA.classList.toggle("hidden");
      menu_AHGA.classList.toggle("md:flex");
    });
  }
};

export const setupScrollAnimations_AHGA = () => {
  const observerOptions_AHGA = {
    threshold: 0.1,
  };

  const handleIntersection_AHGA = (entries_AHGA, observer_AHGA) => {
    entries_AHGA.forEach((entry_AHGA) => {
      if (entry_AHGA.isIntersecting) {
        entry_AHGA.target.classList.add("animate-fade-in");
        observer_AHGA.unobserve(entry_AHGA.target);
      }
    });
  };

  const observer_AHGA = new IntersectionObserver(
    (entries) => handleIntersection_AHGA(entries, observer_AHGA),
    observerOptions_AHGA
  );

  document
    .querySelectorAll(".benefit-item, .service-card, .animate-on-scroll")
    .forEach((el_AHGA) => {
      observer_AHGA.observe(el_AHGA);
    });
};

export const cargarTestimonios_AHGA = async () => {
  const contenedor_AHGA = document.getElementById("testimonios-contenedor");
  if (!contenedor_AHGA) return; // 🚨 Detener si el contenedor no existe
  contenedor_AHGA.innerHTML = "";

  const todosRes_AHGA = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=3"
  );
  const todos_AHGA = await todosRes_AHGA.json();

  const usersRes_AHGA = await fetch(
    "https://jsonplaceholder.typicode.com/users"
  );
  const users_AHGA = await usersRes_AHGA.json();

  const obtenerUsuariosAleatorios_AHGA = (users_AHGA_param, n_AHGA) => {
    const copia_AHGA = [...users_AHGA_param];
    const seleccionados_AHGA = [];
    for (let i_AHGA = 0; i_AHGA < n_AHGA; i_AHGA++) {
      const index_AHGA = Math.floor(Math.random() * copia_AHGA.length);
      seleccionados_AHGA.push(copia_AHGA.splice(index_AHGA, 1)[0]);
    }
    return seleccionados_AHGA;
  };

  const usuariosAleatorios_AHGA = obtenerUsuariosAleatorios_AHGA(users_AHGA, 3);

  // Testimonios personalizados para Nexus AG
  const testimonios_AHGA = [
    "Nexus AG ha revolucionado mis noches de juegos. ¡La experiencia es única y la atención al cliente excelente!",
    "La creatividad y calidad de los juegos de Nexus AG es impresionante. Siempre espero sus nuevos lanzamientos.",
    "Gracias a Nexus AG, he descubierto una comunidad increíble y juegos que realmente desafían mi mente.",
    "El soporte y las actualizaciones constantes de Nexus AG hacen que cada juego sea mejor con el tiempo.",
    "Nexus AG entiende lo que los jugadores queremos: innovación, diversión y mucha rejugabilidad.",
    "Recomiendo Nexus AG a todos mis amigos. Sus juegos son garantía de horas de entretenimiento.",
    "La pasión del equipo de Nexus AG se nota en cada detalle de sus juegos. ¡Sigan así!",
    "Me encanta cómo Nexus AG escucha a la comunidad y mejora sus productos constantemente.",
    "Los juegos de Nexus AG tienen una calidad visual y mecánica sobresaliente. ¡Totalmente recomendados!",
    "Nexus AG no solo crea juegos, crea experiencias memorables para todos los jugadores.",
  ];

  // Función para obtener testimonios aleatorios sin repetición
  const obtenerTestimoniosAleatorios_AHGA = (n) => {
    const copiaTestimonios_AHGA = [...testimonios_AHGA];
    const seleccionados_AHGA = [];
    for (let i = 0; i < n; i++) {
      const randomIndex_AHGA = Math.floor(
        Math.random() * copiaTestimonios_AHGA.length
      );
      seleccionados_AHGA.push(
        copiaTestimonios_AHGA.splice(randomIndex_AHGA, 1)[0]
      );
    }
    return seleccionados_AHGA;
  };

  const testimoniosAleatorios_AHGA = obtenerTestimoniosAleatorios_AHGA(3);

  usuariosAleatorios_AHGA.forEach((user_AHGA, index_AHGA) => {
    // Usa el proxy en lugar de la URL directa
    const avatarUrl_AHGA = `/pravatar/150?img=${user_AHGA.id}`;

    const card_AHGA = document.createElement("div");
    card_AHGA.className =
      "testimonial-card bg-[#232323]/20 p-6 rounded-xl shadow-md flex flex-col items-center text-center border border-[#454955] hover:border-[#72B01D] transition-all";

    card_AHGA.innerHTML = `
    <img 
      src="${avatarUrl_AHGA}" 
      alt="Avatar de ${user_AHGA.name}" 
      class="w-20 h-20 rounded-full mb-4 object-cover border-4 border-[#72B01D] shadow-md"
      crossorigin="anonymous"
    >
    <p class="body-font italic text-[#F3EFF5]/90 mb-4">"${testimoniosAleatorios_AHGA[index_AHGA]}"</p>
    <h3 class="title-font font-semibold text-[#72B01D] mb-1">${user_AHGA.name}</h3>
    <p class="body-font text-xs text-[#F3EFF5]/60">Jugador de Nexus AG</p>
  `;

    contenedor_AHGA.appendChild(card_AHGA);
  });
};

export const setupFormSubmission_AHGA = (options_AHGA = {}) => {
  const {
    formId: formId_AHGA = "contactForm",
    submitBtnSelector: submitBtnSelector_AHGA = 'button[type="submit"]',
    actionUrl: actionUrl_AHGA = "php/contact.php",
    spinnerHtml:
      spinnerHtml_AHGA = '<span class="animate-spin">⏳</span> Enviando...',
    resetOnSuccess: resetOnSuccess_AHGA = true,
    successTitle: successTitle_AHGA = "Éxito",
    errorTitle: errorTitle_AHGA = "Error",
  } = options_AHGA;

  const form_AHGA = document.getElementById(formId_AHGA);
  if (!form_AHGA) return;

  form_AHGA.addEventListener("submit", async (e_AHGA) => {
    e_AHGA.preventDefault();

    const submitBtn_AHGA = form_AHGA.querySelector(submitBtnSelector_AHGA);
    if (!submitBtn_AHGA) return;

    const originalBtnText_AHGA = submitBtn_AHGA.innerHTML;
    submitBtn_AHGA.disabled = true;
    submitBtn_AHGA.innerHTML = spinnerHtml_AHGA;

    try {
      const response_AHGA = await fetch(actionUrl_AHGA, {
        method: "POST",
        body: new FormData(form_AHGA),
      });

      if (!response_AHGA.ok) {
        throw new Error(`HTTP error! status: ${response_AHGA.status}`);
      }

      const result_AHGA = await response_AHGA.json();
      if (result_AHGA.success) {
        modal_AHGA.showSuccess_AHGA(successTitle_AHGA, result_AHGA.message);
        if (resetOnSuccess_AHGA) form_AHGA.reset();
      } else {
        modal_AHGA.showError_AHGA(errorTitle_AHGA, result_AHGA.message);
      }
    } catch (error_AHGA) {
      console.error("Error:", error_AHGA);
      modal_AHGA.showError_AHGA(
        errorTitle_AHGA,
        "Error de conexión. Intenta de nuevo."
      );
    } finally {
      submitBtn_AHGA.disabled = false;
      submitBtn_AHGA.innerHTML = originalBtnText_AHGA;
    }
  });
};
