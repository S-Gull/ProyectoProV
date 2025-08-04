class ModalDialog_ah_ga {
    constructor() {
        this.modalContainer_ah_ga = document.getElementById('modalContainer');
        this.modalContent_ah_ga = document.getElementById('modalContent');
        this.modalHeader_ah_ga = document.getElementById('modalHeader');
        this.modalIcon_ah_ga = document.getElementById('modalIcon');
        this.modalTitle_ah_ga = document.getElementById('modalTitle');
        this.modalMessage_ah_ga = document.getElementById('modalMessage');
        this.modalClose_ah_ga = document.getElementById('modalClose');
        this.modalAction_ah_ga = document.getElementById('modalAction');
        this.modalCancel_ah_ga = document.getElementById('modalCancel');

        this.resolvePromise = null;
        this.rejectPromise = null;

        this.modalClose_ah_ga.addEventListener('click', () => this.cancel_ah_ga());
        this.modalAction_ah_ga.addEventListener('click', () => this.confirm_ah_ga());
        this.modalCancel_ah_ga.addEventListener('click', () => this.cancel_ah_ga());

        this.modalContainer_ah_ga.addEventListener('click', (e_ah_ga) => {
            if (e_ah_ga.target === this.modalContainer_ah_ga) {
                this.cancel_ah_ga();
            }
        });
    }

    /**
     * Muestra un modal genérico o contextual (como reportes).
     * @param {string} title_ah_ga 
     * @param {string|Array} message_ah_ga 
     * @param {string} type_ah_ga 
     * @param {boolean} isConfirm 
     * @returns {Promise<boolean>}
     */
    show_ah_ga(title_ah_ga, message_ah_ga, type_ah_ga, isConfirm = false) {
        // Tipo de modal
        switch(type_ah_ga) {
            case 'success':
                this.modalHeader_ah_ga.className = 'modal-header success-bg';
                this.modalIcon_ah_ga.className = 'modal-icon fas fa-check-circle';
                this.modalAction_ah_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700';
                break;
            case 'error':
                this.modalHeader_ah_ga.className = 'modal-header error';
                this.modalIcon_ah_ga.className = 'modal-icon fas fa-times-circle';
                this.modalAction_ah_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700';
                break;
            case 'warning':
                this.modalHeader_ah_ga.className = 'modal-header warning-bg';
                this.modalIcon_ah_ga.className = 'modal-icon fas fa-exclamation-triangle';
                this.modalAction_ah_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700';
                break;
            case 'reportes':
                this.modalHeader_ah_ga.className = 'modal-header success-bg';
                this.modalIcon_ah_ga.className = 'modal-icon fas fa-file-alt';
                this.modalAction_ah_ga.className = 'px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700';
                break;
        }

        this.modalTitle_ah_ga.textContent = title_ah_ga;

        if (type_ah_ga === 'reportes' && Array.isArray(message_ah_ga)) {
            const html_ah_ga = message_ah_ga.length > 0
                ? message_ah_ga.map(r => `
                    <div class="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      <h4 class="font-semibold text-gray-800 dark:text-white mb-1">
                        ${r.tipo === 'reporte_banco' ? 'Reporte Bancario' : 'Reporte Contable'} #${r.id}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Fecha: ${new Date(r.fecha).toLocaleDateString('es-ES')}
                      </p>
                      <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
${r.info}
                      </pre>
                    </div>
                  `).join('')
                : `<p class="text-gray-600 dark:text-gray-400">No hay reportes para mostrar.</p>`;
            this.modalMessage_ah_ga.innerHTML = html_ah_ga;
        } else {
            // Si el mensaje contiene HTML (detectamos por la presencia de etiquetas), usar innerHTML
            if (typeof message_ah_ga === 'string' && message_ah_ga.includes('<')) {
                this.modalMessage_ah_ga.innerHTML = message_ah_ga;
            } else {
                this.modalMessage_ah_ga.textContent = message_ah_ga;
            }
        }

        this.modalAction_ah_ga.textContent = type_ah_ga === 'error' ? 'Reintentar' : 'Aceptar';
        this.modalCancel_ah_ga.style.display = isConfirm ? 'block' : 'none';

        this.modalContainer_ah_ga.classList.add('active');
        document.body.style.overflow = 'hidden';

        return new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;
        });
    }

    showConfirm_ah_ga(title_ah_ga, message_ah_ga) {
        return this.show_ah_ga(title_ah_ga, message_ah_ga, 'warning', true);
    }

    showSuccess_ah_ga(title_ah_ga, message_ah_ga) {
        return this.show_ah_ga(title_ah_ga, message_ah_ga, 'success');
    }

    showError_ah_ga(title_ah_ga, message_ah_ga) {
        return this.show_ah_ga(title_ah_ga, message_ah_ga, 'error');
    }

    showWarning_ah_ga(title_ah_ga, message_ah_ga) {
        return this.show_ah_ga(title_ah_ga, message_ah_ga, 'warning');
    }

    /**
     * Modal especializado para reportes: invoca show_ah_ga con tipo 'reportes'.
     * @param {string} titulo 
     * @param {Array} arrayReportes 
     * @returns {Promise<boolean>}
     */
    showReportes_ah_ga(titulo, arrayReportes) {
        return this.show_ah_ga(titulo, arrayReportes, 'reportes');
    }

    confirm_ah_ga() {
        this.hide_ah_ga();
        if (this.resolvePromise) {
            this.resolvePromise(true);
        }
    }

    cancel_ah_ga() {
        this.hide_ah_ga();
        if (this.resolvePromise) {
            this.resolvePromise(false);
        }
    }

    hide_ah_ga() {
        this.modalContainer_ah_ga.classList.remove('active');
        document.body.style.overflow = '';
    }
}

const modal_ah_ga = new ModalDialog_ah_ga();
export { ModalDialog_ah_ga, modal_ah_ga };
