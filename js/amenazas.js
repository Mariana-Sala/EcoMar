
console.log("JavaScript de Amenazas conectado correctamente");

// Seleccionamos las cuatro tarjetas
const tarjetas = document.querySelectorAll(".amenaza");

console.log("Cantidad de tarjetas:", tarjetas.length);

// Recorremos cada tarjeta
tarjetas.forEach(function (tarjeta) {

    // Buscamos el botón de esta tarjeta
    const boton = tarjeta.querySelector(".amenaza-impacto");

    // Obtenemos el ID del detalle asociado
    const idDetalle = boton.getAttribute("aria-controls");

    // Buscamos el contenido que queremos mostrar
    const detalle = document.getElementById(idDetalle);

    // Escuchamos el clic en el botón
    boton.addEventListener("click", function () {

        // Alternamos la visibilidad del detalle
        detalle.hidden = !detalle.hidden;

        // Actualizamos el estado de accesibilidad
        boton.setAttribute(
            "aria-expanded",
            String(!detalle.hidden)
        );

    });

});