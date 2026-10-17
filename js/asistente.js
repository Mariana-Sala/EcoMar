
"use strict";

const formulario = document.getElementById("chatFormulario");
const input = document.getElementById("chatInput");
const mensajes = document.getElementById("chatMensajes");
const boton = document.getElementById("chatBoton");

// Historial de la conversación actual
const historial = [];

// Mostrar mensajes sin interpretar el contenido como HTML
function agregarMensaje(texto, tipo) {
    const elemento = document.createElement("p");

    elemento.classList.add("mensaje", `mensaje-${tipo}`);
    elemento.textContent = texto;

    mensajes.appendChild(elemento);
    mensajes.scrollTop = mensajes.scrollHeight;

    return elemento;
}

// Enviar el mensaje a nuestro servidor
formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const pregunta  = input.value.trim();

    if (!pregunta || boton.disabled ) {
        return;
    }

    agregarMensaje(pregunta, "usuario");

    historial.push({
        role: "user",
        text: pregunta
    });

    input.value = "";
    input.disabled = true;
    boton.disabled = true;

    const indicador = agregarMensaje(
        "Náyade está pensando... 🌊",
        "asistente"
    );

    try {
        const respuesta = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: historial  
            })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "No se pudo obtener una respuesta.");
        }

        indicador.textContent = datos.reply;

        requestAnimationFrame(() => {
          mensajes.scrollTop = mensajes.scrollHeight;
        });


        // Guardar la conversación para mantener el contexto
        historial.push({
            role: "model",
            text: datos.reply
        });

        // Mantener solo los últimos 20 mensajes
        if (historial.length > 20) {
            historial.splice(0, historial.length - 20);
        }

    } catch (error) {
        console.error("Error al comunicarse con Náyade:", error);

        indicador.textContent =
            "No pude responder en este momento. Verifica tu conexión e inténtalo nuevamente.";

    } finally {
        input.disabled = false;
        boton.disabled = false;
        input.focus();
        mensajes.scrollTop = mensajes.scrollHeight;
    }
});

