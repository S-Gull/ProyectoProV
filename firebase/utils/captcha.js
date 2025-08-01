/**
 * Utilidad para implementar CAPTCHA simple en formularios
 * En una aplicación de producción, se recomienda usar servicios como reCAPTCHA de Google
 */

/**
 * Genera un CAPTCHA simple basado en operaciones matemáticas
 * @returns {Object} Objeto con la pregunta y la respuesta correcta
 */
export const generateCaptcha_ahga = () => {
  // Generar dos números aleatorios entre 1 y 10
  const num1_ahga = Math.floor(Math.random() * 10) + 1;
  const num2_ahga = Math.floor(Math.random() * 10) + 1;

  // Operaciones posibles: suma, resta, multiplicación
  const operations_ahga = [
    { symbol: "+", calculate: (a, b) => a + b },
    { symbol: "-", calculate: (a, b) => a - b },
    { symbol: "×", calculate: (a, b) => a * b },
  ];

  // Seleccionar una operación aleatoria
  const operationIndex_ahga = Math.floor(
    Math.random() * operations_ahga.length
  );
  const operation_ahga = operations_ahga[operationIndex_ahga];

  // Calcular el resultado
  const result_ahga = operation_ahga.calculate(num1_ahga, num2_ahga);

  // Crear la pregunta
  const question_ahga = `¿Cuánto es ${num1_ahga} ${operation_ahga.symbol} ${num2_ahga}?`;

  return {
    question: question_ahga,
    answer: result_ahga.toString(),
  };
};

/**
 * Verifica si la respuesta del usuario es correcta
 * @param {string} userAnswer - Respuesta proporcionada por el usuario
 * @param {string} correctAnswer - Respuesta correcta
 * @returns {boolean} Si la respuesta es correcta
 */
export const verifyCaptcha_ahga = (userAnswer_ahga, correctAnswer_ahga) => {
  return userAnswer_ahga.trim() === correctAnswer_ahga.trim();
};

/**
 * Crea y muestra un CAPTCHA en el DOM
 * @param {string} containerId - ID del contenedor donde se mostrará el CAPTCHA
 * @param {string} inputId - ID del input donde el usuario ingresará la respuesta
 * @returns {string} La respuesta correcta del CAPTCHA
 */
export const createCaptcha_ahga = (containerId_ahga, inputId_ahga) => {
  const container_ahga = document.getElementById(containerId_ahga);
  if (!container_ahga) {
    console.error(`Contenedor con ID ${containerId_ahga} no encontrado`);
    return null;
  }

  // Generar el CAPTCHA
  const captcha_ahga = generateCaptcha_ahga();

  // Crear el HTML del CAPTCHA
  container_ahga.innerHTML = `
    <div class="captcha-container">
      <label for="${inputId_ahga}" class="captcha-question">${captcha_ahga.question}</label>
      <input type="text" id="${inputId_ahga}" class="captcha-input" placeholder="Ingrese la respuesta" required>
      <button type="button" class="refresh-captcha" id="refresh-${containerId_ahga}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
        </svg>
      </button>
    </div>
  `;

  // Agregar estilos CSS para el CAPTCHA
  if (!document.getElementById("captcha-styles")) {
    const style_ahga = document.createElement("style");
    style_ahga.id = "captcha-styles";
    style_ahga.textContent = `
      .captcha-container {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 5px;
        border: 1px solid #dee2e6;
        color: black
      }
      .captcha-question {
        flex-grow: 1;
        font-weight: bold;
        margin-right: 10px;
      }
      .captcha-input {
        width: 80px;
        padding: 5px;
        border: 1px solid #ced4da;
        border-radius: 4px;
      }
      .refresh-captcha {
        background: none;
        border: none;
        color: #0d6efd;
        cursor: pointer;
        padding: 5px;
        margin-left: 5px;
      }
      .refresh-captcha:hover {
        color: #0a58ca;
      }
    `;
    document.head.appendChild(style_ahga);
  }

  // Configurar el botón de actualizar CAPTCHA
  document
    .getElementById(`refresh-${containerId_ahga}`)
    .addEventListener("click", () => {
      // Almacenar la respuesta actual en el localStorage para poder verificarla después
      localStorage.removeItem(`captcha-${containerId_ahga}`);
      createCaptcha_ahga(containerId_ahga, inputId_ahga);
    });

  // Almacenar la respuesta en localStorage para poder verificarla después
  localStorage.setItem(`captcha-${containerId_ahga}`, captcha_ahga.answer);

  return captcha_ahga.answer;
};

/**
 * Verifica el CAPTCHA ingresado por el usuario
 * @param {string} containerId - ID del contenedor del CAPTCHA
 * @param {string} inputId - ID del input donde el usuario ingresó la respuesta
 * @returns {boolean} Si el CAPTCHA es válido
 */
export const validateCaptcha_ahga = (containerId_ahga, inputId_ahga) => {
  const userAnswer_ahga = document.getElementById(inputId_ahga).value;
  const correctAnswer_ahga = localStorage.getItem(
    `captcha-${containerId_ahga}`
  );

  if (!correctAnswer_ahga) {
    console.error("No se encontró la respuesta del CAPTCHA");
    return false;
  }

  const isValid_ahga = verifyCaptcha_ahga(userAnswer_ahga, correctAnswer_ahga);

  // Si la validación fue exitosa, eliminar la respuesta almacenada
  if (isValid_ahga) {
    localStorage.removeItem(`captcha-${containerId_ahga}`);
  }

  return isValid_ahga;
};
