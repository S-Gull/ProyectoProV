class ModalDialog_ahga {
  constructor() {
    this.modalContainer_ahga = document.getElementById("modalContainer");
    this.modalContent_ahga = document.getElementById("modalContent");
    this.modalHeader_ahga = document.getElementById("modalHeader");
    this.modalIcon_ahga = document.getElementById("modalIcon");
    this.modalTitle_ahga = document.getElementById("modalTitle");
    this.modalMessage_ahga = document.getElementById("modalMessage");
    this.modalClose_ahga = document.getElementById("modalClose");
    this.modalAction_ahga = document.getElementById("modalAction");
    this.modalCancel_ahga = document.getElementById("modalCancel");

    this.resolvePromise = null;
    this.rejectPromise = null;

    this.modalClose_ahga.addEventListener("click", () => this.cancel_ahga());
    this.modalAction_ahga.addEventListener("click", () => this.confirm_ahga());
    this.modalCancel_ahga.addEventListener("click", () => this.cancel_ahga());

    this.modalContainer_ahga.addEventListener("click", (e_ahga) => {
      if (e_ahga.target === this.modalContainer_ahga) {
        this.cancel_ahga();
      }
    });
  }

  /**
   * Muestra un modal genérico o contextual (como reportes).
   * @param {string} title_ahga
   * @param {string|Array} message_ahga
   * @param {string} type_ahga
   * @param {boolean} isConfirm
   * @returns {Promise<boolean>}
   */
  show_ahga(title_ahga, message_ahga, type_ahga, isConfirm = false) {
    // Tipo de modal
    switch (type_ahga) {
      case "success":
        this.modalHeader_ahga.className = "modal-header success-bg";
        this.modalIcon_ahga.className = "modal-icon fas fa-check-circle";
        this.modalAction_ahga.className =
          "px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700";
        break;
      case "error":
        this.modalHeader_ahga.className = "modal-header error";
        this.modalIcon_ahga.className = "modal-icon fas fa-times-circle";
        this.modalAction_ahga.className =
          "px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700";
        break;
      case "warning":
        this.modalHeader_ahga.className = "modal-header warning-bg";
        this.modalIcon_ahga.className =
          "modal-icon fas fa-exclamation-triangle";
        this.modalAction_ahga.className =
          "px-4 py-2 rounded-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700";
        break;
      case "reportes":
        this.modalHeader_ahga.className = "modal-header success-bg";
        this.modalIcon_ahga.className = "modal-icon fas fa-file-alt";
        this.modalAction_ahga.className =
          "px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700";
        break;
    }

    this.modalTitle_ahga.textContent = title_ahga;

    if (type_ahga === "reportes" && Array.isArray(message_ahga)) {
      const html_ahga =
        message_ahga.length > 0
          ? message_ahga
              .map(
                (r) => `
                    <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <h4 class="font-semibold text-gray-800 dark:text-white mb-1">
                        ${
                          r.tipo === "reporte_banco"
                            ? "Reporte Bancario"
                            : "Reporte Contable"
                        } #${r.id}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Fecha: ${new Date(r.fecha).toLocaleDateString("es-ES")}
                      </p>
                      <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
${r.info}
                      </pre>
                    </div>
                  `
              )
              .join("")
          : `<p class="text-gray-600 dark:text-gray-400">No hay reportes para mostrar.</p>`;
      this.modalMessage_ahga.innerHTML = html_ahga;
    } else {
      // Si el mensaje contiene HTML (detectamos por la presencia de etiquetas), usar innerHTML
      if (typeof message_ahga === "string" && message_ahga.includes("<")) {
        this.modalMessage_ahga.innerHTML = message_ahga;
      } else {
        this.modalMessage_ahga.textContent = message_ahga;
      }
    }

    this.modalAction_ahga.textContent =
      type_ahga === "error" ? "Reintentar" : "Aceptar";
    this.modalCancel_ahga.style.display = isConfirm ? "block" : "none";

    this.modalContainer_ahga.classList.add("active");
    document.body.style.overflow = "hidden";

    return new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
  }

  showConfirm_ahga(title_ahga, message_ahga) {
    return this.show_ahga(title_ahga, message_ahga, "warning", true);
  }

  showSuccess_ahga(title_ahga, message_ahga) {
    return this.show_ahga(title_ahga, message_ahga, "success");
  }

  showError_ahga(title_ahga, message_ahga) {
    return this.show_ahga(title_ahga, message_ahga, "error");
  }

  showWarning_ahga(title_ahga, message_ahga) {
    return this.show_ahga(title_ahga, message_ahga, "warning");
  }

  /**
   * Modal especializado para reportes: invoca show_ahga con tipo 'reportes'.
   * @param {string} titulo
   * @param {Array} arrayReportes
   * @returns {Promise<boolean>}
   */
  showReportes_ahga(titulo, arrayReportes) {
    return this.show_ahga(titulo, arrayReportes, "reportes");
  }

  confirm_ahga() {
    this.hide_ahga();
    if (this.resolvePromise) {
      this.resolvePromise(true);
    }
  }

  cancel_ahga() {
    this.hide_ahga();
    if (this.resolvePromise) {
      this.resolvePromise(false);
    }
  }

  hide_ahga() {
    this.modalContainer_ahga.classList.remove("active");
    document.body.style.overflow = "";
  }
}

const modal_ahga = new ModalDialog_ahga();
export { ModalDialog_ahga, modal_ahga };
