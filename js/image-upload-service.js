// Servicio para manejo de imágenes de perfil
class ImageUploadService_AHGA {
  constructor() {
    this.storage = null;
    this.initFirebase();
  }

  // Inicializar Firebase Storage
  async initFirebase() {
    try {
      // Verificar si Firebase está disponible
      if (typeof firebase !== "undefined" && firebase.storage) {
        this.storage = firebase.storage();
        console.log("✅ Firebase Storage inicializado");
      } else {
        console.warn("⚠️ Firebase Storage no está disponible");
      }
    } catch (error) {
      console.error("❌ Error al inicializar Firebase Storage:", error);
    }
  }

  // Subir imagen de perfil
  async uploadProfileImage(file, userId) {
    try {
      if (!this.storage) {
        console.warn("⚠️ Firebase Storage no disponible, usando preview local");
        return this.createLocalPreview(file);
      }

      // Crear referencia única para la imagen
      const timestamp = Date.now();
      const fileName = `profile_${userId}_${timestamp}.${this.getFileExtension(
        file.name
      )}`;
      const storageRef = this.storage.ref(`avatars/${fileName}`);

      // Mostrar progreso de subida
      const uploadTask = storageRef.put(file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progreso de subida
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`📤 Progreso de subida: ${progress.toFixed(2)}%`);

            // Disparar evento de progreso
            document.dispatchEvent(
              new CustomEvent("uploadProgress", {
                detail: { progress, fileName },
              })
            );
          },
          (error) => {
            console.error("❌ Error en la subida:", error);
            reject(error);
          },
          async () => {
            // Subida completada
            try {
              const downloadURL =
                await uploadTask.snapshot.ref.getDownloadURL();
              console.log("✅ Imagen subida exitosamente:", downloadURL);
              resolve({
                url: downloadURL,
                fileName: fileName,
                size: file.size,
                type: file.type,
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
      throw error;
    }
  }

  // Crear preview local cuando Firebase no está disponible
  createLocalPreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: e.target.result,
          fileName: file.name,
          size: file.size,
          type: file.type,
          isLocal: true,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Eliminar imagen anterior
  async deleteProfileImage(imageUrl) {
    try {
      if (
        !this.storage ||
        !imageUrl ||
        imageUrl.includes("default-avatar.svg") ||
        imageUrl.startsWith("data:")
      ) {
        console.log(
          "🗑️ No hay imagen para eliminar o es una imagen local/generada"
        );
        return;
      }

      const imageRef = this.storage.refFromURL(imageUrl);
      await imageRef.delete();
      console.log("🗑️ Imagen anterior eliminada exitosamente");
    } catch (error) {
      console.warn("⚠️ No se pudo eliminar la imagen anterior:", error);
      // No es crítico si no se puede eliminar la imagen anterior
    }
  }

  // Optimizar imagen antes de subir
  async optimizeImage(file, maxWidth = 400, maxHeight = 400, quality = 0.8) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            // Crear nuevo archivo con el blob optimizado
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            console.log(
              `🔧 Imagen optimizada: ${file.size} → ${optimizedFile.size} bytes`
            );
            resolve(optimizedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Calcular dimensiones manteniendo proporción
  calculateDimensions(originalWidth, originalHeight, maxWidth, maxHeight) {
    let width = originalWidth;
    let height = originalHeight;

    // Redimensionar si excede el ancho máximo
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    // Redimensionar si excede la altura máxima
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Obtener extensión del archivo
  getFileExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
  }

  // Validar tipo de archivo
  isValidImageType(file) {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    return validTypes.includes(file.type);
  }

  // Validar tamaño de archivo
  isValidFileSize(file, maxSizeMB = 5) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  // Procesar imagen completa (validar, optimizar y subir)
  async processProfileImage(file, userId, options = {}) {
    try {
      // Opciones por defecto
      const {
        optimize = true,
        maxWidth = 400,
        maxHeight = 400,
        quality = 0.8,
        maxSizeMB = 5,
      } = options;

      // Validaciones
      if (!this.isValidImageType(file)) {
        throw new Error(
          "Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG, GIF y WebP."
        );
      }

      if (!this.isValidFileSize(file, maxSizeMB)) {
        throw new Error(
          `El archivo es demasiado grande. Máximo ${maxSizeMB}MB.`
        );
      }

      // Optimizar imagen si está habilitado
      let processedFile = file;
      if (optimize) {
        processedFile = await this.optimizeImage(
          file,
          maxWidth,
          maxHeight,
          quality
        );
      }

      // Subir imagen
      const result = await this.uploadProfileImage(processedFile, userId);

      return {
        ...result,
        originalSize: file.size,
        processedSize: processedFile.size,
        optimized: optimize,
      };
    } catch (error) {
      console.error("❌ Error al procesar imagen:", error);
      throw error;
    }
  }

  // Generar avatar por defecto
  generateDefaultAvatar(name, size = 120) {
    const encodedName = encodeURIComponent(name || "Usuario");
    return "../img/default-avatar.svg";
  }
}

// Exportar instancia singleton
const imageUploadService = new ImageUploadService_AHGA();

// Hacer disponible globalmente
if (typeof window !== "undefined") {
  window.ImageUploadService_AHGA = imageUploadService;
}

export default imageUploadService;
