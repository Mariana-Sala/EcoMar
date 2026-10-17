const preguntas = document.querySelectorAll(".pregunta");
const progreso = document.querySelector(".cuestionario-progreso");
const contador = document.querySelector(".cuestionario-contador");

const btnSiguiente = document.querySelector("#btn-siguiente");
const btnAnterior = document.querySelector("#btn-anterior");

/* ---------- Respuestas correctas ---------- */

const respuestasCorrectas = {
  pregunta1: "reutilizables",
  pregunta2: "ahorrar",
  pregunta3: "reciclar",
  pregunta4: "respetar",
};

/* ---------- Estado del cuestionario ---------- */

let preguntaActual = 0;

/* ---------- Mostrar pregunta actual ---------- */

function mostrarPregunta() {
  preguntas.forEach(function (pregunta, indice) {
    pregunta.hidden = indice !== preguntaActual; 
  });

  progreso.value = preguntaActual + 1;
  contador.textContent = `${preguntaActual + 1}/${preguntas.length}`;

  btnAnterior.hidden = preguntaActual === 0;

  btnSiguiente.textContent =
    preguntaActual === preguntas.length - 1 ? "Ver mi resultado" : "Siguiente";
}

const formulario = document.querySelector(".cuestionario-form");

const panelResultado = document.querySelector("#resultado-cuestionario");

const resultadoPuntuacion = document.querySelector("#resultado-puntuacion");

const resultadoMensaje = document.querySelector("#resultado-mensaje");

const resultadoCompromiso = document.querySelector("#resultado-compromiso");

const btnReiniciar = document.querySelector("#btn-reiniciar");

/* ---------- Calcular puntuación ---------- */

function calcularPuntuacion() {
  let puntuacion = 0;

  for (const pregunta in respuestasCorrectas) {
    const respuesta = document.querySelector(
      `input[name="${pregunta}"]:checked`,
    );

    if (respuesta && respuesta.value === respuestasCorrectas[pregunta]) {
      puntuacion++;
    }
  }

  return puntuacion;
}

/* Función para mostrar resultado */
function mostrarResultado() {
  const puntuacion = calcularPuntuacion();

  // Mostramos la puntuación obtenida
  resultadoPuntuacion.textContent = `Obtuviste ${puntuacion} de 4 respuestas correctas.`;

  // Mensaje según el resultado
  if (puntuacion === 4) {
    resultadoMensaje.textContent =
      "¡Excelente! Tienes buenos conocimientos sobre el cuidado del océano.";
  } else if (puntuacion >= 2) {
    resultadoMensaje.textContent =
      "¡Vas por buen camino! Sigue aprendiendo a proteger nuestros mares.";
  } else {
    resultadoMensaje.textContent =
      "Cada día es una oportunidad para aprender a cuidar el océano.";
  }

  // Recuperamos la respuesta de la pregunta 5
  const compromiso = document.querySelector('input[name="pregunta5"]:checked');

  if (compromiso) {
    const textoCompromiso = compromiso.closest("label").textContent.trim();

    resultadoCompromiso.textContent = `Tu compromiso ambiental: ${textoCompromiso}`;
  }

  // Ocultamos las preguntas y mostramos el resultado
  formulario.hidden = true;
  panelResultado.hidden = false;
}

/* ---------- Botón Siguiente ---------- */

btnSiguiente.addEventListener("click", function () {
  const respuesta = preguntas[preguntaActual].querySelector(
    "input[type='radio']:checked",
  );

  if (!respuesta) {
    alert("Por favor, selecciona una respuesta.");
    return;
  }

  if (preguntaActual < preguntas.length - 1) {
    preguntaActual++;
    mostrarPregunta();
  } else {
    mostrarResultado();
  }
});

/* ---------- Botón Anterior ---------- */

btnAnterior.addEventListener("click", function () {
  if (preguntaActual > 0) {
    preguntaActual--;
    mostrarPregunta();
  }
});

/* ---------- Inicialización ---------- */

mostrarPregunta();


btnReiniciar.addEventListener("click", function () {

    // Reiniciamos las respuestas seleccionadas
    formulario.reset();

    // Volvemos a la primera pregunta
    preguntaActual = 0;

    // Ocultamos el resultado
    panelResultado.hidden = true;

    // Mostramos nuevamente el formulario
    formulario.hidden = false;

    // Actualizamos pregunta y progreso
    mostrarPregunta();

});