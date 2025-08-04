// Componente Drag and Drop para Imágenes de Perfil
class DragDropImage_AHGA extends HTMLElement {
  constructor() {
    super();
    this.imageFile = null;
    this.previewUrl = null;
    this.onImageChange = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    const width = this.getAttribute("width") || "120";
    const height = this.getAttribute("height") || "120";
    const defaultImage =
      this.getAttribute("default-image") || "../img/default-avatar.svg";
    const borderRadius = this.getAttribute("border-radius") || "rounded-full";

    this.innerHTML = `
      <div class="drag-drop-container relative inline-block">
        <!-- Zona de Drop -->
        <div id="dropZone_ahga" class="drop-zone relative group cursor-pointer transition-all duration-300 hover:scale-105">
          <img 
            id="imagePreview_ahga" 
            src="${defaultImage}" 
            alt="Imagen de perfil" 
            class="w-${width / 4} h-${
      height / 4
    } ${borderRadius} object-cover border-4 border-[#72b01d] transition-all duration-300 group-hover:border-[#5a8c16]"
            style="width: ${width}px; height: ${height}px;"
          />
          
          <!-- Overlay de drag -->
          <div id="dragOverlay_ahga" class="absolute inset-0 bg-black bg-opacity-50 ${borderRadius} flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div class="text-center text-white">
              <i class="fas fa-cloud-upload-alt text-2xl mb-2"></i>
              <p class="text-sm font-medium">Arrastra una imagen</p>
              <p class="text-xs">o haz clic para seleccionar</p>
            </div>
          </div>
          
          <!-- Botón de cámara -->
          <button 
            type="button" 
            id="cameraButton_ahga" 
            class="absolute bottom-0 right-0 bg-[#72b01d] hover:bg-[#5a8c16] text-white rounded-full p-2 transition-colors duration-200 shadow-lg"
          >
            <i class="fas fa-camera text-sm"></i>
          </button>
        </div>
        
        <!-- Input file oculto -->
        <input 
          type="file" 
          id="fileInput_ahga" 
          accept="image/*" 
          class="hidden"
        />
        
        <!-- Indicador de carga -->
        <div id="loadingIndicator_ahga" class="absolute inset-0 bg-black bg-opacity-75 ${borderRadius} flex items-center justify-center hidden">
          <div class="text-center text-white">
            <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
            <p class="text-sm">Procesando imagen...</p>
          </div>
        </div>
        
        <!-- Botón de eliminar imagen -->
        <button 
          type="button" 
          id="removeButton_ahga" 
          class="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors duration-200 shadow-lg hidden"
        >
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
      
      <!-- Información adicional -->
      <div class="mt-2 text-center">
        <p class="text-xs text-[#b8b3ba]">Formatos: JPG, PNG, GIF (máx. 5MB)</p>
        <p id="fileName_ahga" class="text-xs text-[#72b01d] mt-1 hidden"></p>
      </div>
    `;
  }

  setupEventListeners() {
    const dropZone = this.querySelector("#dropZone_ahga");
    const fileInput = this.querySelector("#fileInput_ahga");
    const cameraButton = this.querySelector("#cameraButton_ahga");
    const removeButton = this.querySelector("#removeButton_ahga");
    const dragOverlay = this.querySelector("#dragOverlay_ahga");

    // Eventos de drag and drop
    dropZone.addEventListener("dragover", (e) => this.handleDragOver(e));
    dropZone.addEventListener("dragenter", (e) => this.handleDragEnter(e));
    dropZone.addEventListener("dragleave", (e) => this.handleDragLeave(e));
    dropZone.addEventListener("drop", (e) => this.handleDrop(e));

    // Click en la zona de drop
    dropZone.addEventListener("click", () => fileInput.click());

    // Click en el botón de cámara
    cameraButton.addEventListener("click", (e) => {
      e.stopPropagation();
      fileInput.click();
    });

    // Cambio en el input file
    fileInput.addEventListener("change", (e) => this.handleFileSelect(e));

    // Botón de eliminar
    removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.removeImage();
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  handleDragEnter(e) {
    e.preventDefault();
    const dragOverlay = this.querySelector("#dragOverlay_ahga");
    dragOverlay.classList.remove("opacity-0");
    dragOverlay.classList.add("opacity-100");
  }

  handleDragLeave(e) {
    e.preventDefault();
    // Solo ocultar si realmente salimos del elemento
    if (!this.contains(e.relatedTarget)) {
      const dragOverlay = this.querySelector("#dragOverlay_ahga");
      dragOverlay.classList.remove("opacity-100");
      dragOverlay.classList.add("opacity-0");
    }
  }

  handleDrop(e) {
    e.preventDefault();
    const dragOverlay = this.querySelector("#dragOverlay_ahga");
    dragOverlay.classList.remove("opacity-100");
    dragOverlay.classList.add("opacity-0");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file) {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      this.showError("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    // Validar tamaño (5MB máximo)
    if (file.size > 5 * 1024 * 1024) {
      this.showError("La imagen es demasiado grande. Máximo 5MB.");
      return;
    }

    this.showLoading(true);

    // Leer archivo
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageFile = file;
      this.previewUrl = e.target.result;
      this.updatePreview(e.target.result);
      this.showFileName(file.name);
      this.showRemoveButton(true);
      this.showLoading(false);

      // Callback para notificar cambios
      if (this.onImageChange) {
        this.onImageChange({
          file: file,
          previewUrl: e.target.result,
          fileName: file.name,
        });
      }

      // Disparar evento personalizado
      this.dispatchEvent(
        new CustomEvent("imageChanged", {
          detail: {
            file: file,
            previewUrl: e.target.result,
            fileName: file.name,
          },
        })
      );
    };

    reader.onerror = () => {
      this.showError("Error al leer el archivo.");
      this.showLoading(false);
    };

    reader.readAsDataURL(file);
  }

  updatePreview(src) {
    const imagePreview = this.querySelector("#imagePreview_ahga");
    imagePreview.src = src;
  }

  showFileName(fileName) {
    const fileNameElement = this.querySelector("#fileName_ahga");
    fileNameElement.textContent = fileName;
    fileNameElement.classList.remove("hidden");
  }

  showRemoveButton(show) {
    const removeButton = this.querySelector("#removeButton_ahga");
    if (show) {
      removeButton.classList.remove("hidden");
    } else {
      removeButton.classList.add("hidden");
    }
  }

  showLoading(show) {
    const loadingIndicator = this.querySelector("#loadingIndicator_ahga");
    if (show) {
      loadingIndicator.classList.remove("hidden");
    } else {
      loadingIndicator.classList.add("hidden");
    }
  }

  removeImage() {
    this.imageFile = null;
    this.previewUrl = null;

    // Restaurar imagen por defecto
    const defaultImage =
      this.getAttribute("default-image") || "../img/default-avatar.svg";
    this.updatePreview(defaultImage);

    // Ocultar elementos
    this.showFileName("");
    this.querySelector("#fileName_ahga").classList.add("hidden");
    this.showRemoveButton(false);

    // Limpiar input
    const fileInput = this.querySelector("#fileInput_ahga");
    fileInput.value = "";

    // Callback para notificar cambios
    if (this.onImageChange) {
      this.onImageChange(null);
    }

    // Disparar evento personalizado
    this.dispatchEvent(new CustomEvent("imageRemoved"));
  }

  showError(message) {
    // Crear notificación de error
    const notification = document.createElement("div");
    notification.className =
      "fixed top-20 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50";
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle mr-2"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Métodos públicos
  setImage(src) {
    this.updatePreview(src);
  }

  getImageFile() {
    return this.imageFile;
  }

  getPreviewUrl() {
    return this.previewUrl;
  }

  setOnImageChange(callback) {
    this.onImageChange = callback;
  }
}

// Registrar el componente
customElements.define("drag-drop-image-ahga", DragDropImage_AHGA);
