import "../components/header.js";
import "../components/footer.js";
import { setupCompanyMap_AHGA } from "../components/geolocalizacion.js";
import {
  cargarTestimonios_AHGA,
  setupFormSubmission_AHGA,
  setupMobileMenu_AHGA,
  setupScrollAnimations_AHGA,
} from "../components/testimonios.js";

// ✅ Bloque del formulario protegido
document.addEventListener("DOMContentLoaded", () => {
  const form_ahga = document.getElementById("contact-form");
  if (!form_ahga) return;

  form_ahga.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      nombre_ah: form.nombre.value,
      remitente_ah: form.remitente.value,
      asunto_ah: form.asunto.value,
      contenido_ah: form.contenido.value,
    };

    const statusDiv = document.getElementById("form-status");
    statusDiv.textContent = "Enviando...";

    try {
      const res = await fetch("/api/backend/mailer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success_ah) {
        statusDiv.textContent = "✅ " + result.message_ah;
        statusDiv.className = "text-green-600 mt-4";
        form.reset();
      } else {
        statusDiv.textContent = "❌ " + result.message_ah;
        statusDiv.className = "text-red-600 mt-4";
      }
    } catch (err) {
      statusDiv.textContent = "❌ Error de red o servidor.";
      statusDiv.className = "text-red-600 mt-4";
    }
  });
});

// ✅ Geolocalización
document.addEventListener("DOMContentLoaded", () => {
  setupCompanyMap_AHGA();
});

// ✅ Testimonios y extras
document.addEventListener("DOMContentLoaded", () => {
  cargarTestimonios_AHGA();
  setupFormSubmission_AHGA?.();
  setupMobileMenu_AHGA?.();
  setupScrollAnimations_AHGA?.();
});
