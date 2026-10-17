
"use strict";

// Obtener los elementos de la ventana emergente
const modalAnimal = document.getElementById("modalAnimal");
const tituloModalAnimal = document.getElementById("tituloModalAnimal");
const infoModalAnimal = document.getElementById("infoModalAnimal");
const btnCerrarModal = document.getElementById("cerrarModalAnimal");

// Obtener los botones de las tarjetas
const botonesExplorar = document.querySelectorAll(".btn-explorar");

// Comprobar que la ventana y sus elementos existan
if (modalAnimal && tituloModalAnimal && infoModalAnimal && btnCerrarModal) {

    // Abrir la ventana con la información del animal seleccionado
    botonesExplorar.forEach(function (boton) {

        boton.addEventListener("click", function () {

            const tarjetaAnimal = boton.parentElement;

            const nombreAnimal = tarjetaAnimal.querySelector("h2");
            const imagenAnimal = tarjetaAnimal.querySelector("img");
            const infoDetalle = tarjetaAnimal.querySelector(".info-detalle");

            if (!nombreAnimal || !infoDetalle) {
                return;
            }

            // Mostrar el nombre del animal
            tituloModalAnimal.textContent = nombreAnimal.textContent;

            // Limpiar la información anterior del modal
            infoModalAnimal.replaceChildren();

            // Copiar la imagen del animal
            if (imagenAnimal) {
                const imagenClonada = imagenAnimal.cloneNode(true);
                imagenClonada.alt = nombreAnimal.textContent;
                infoModalAnimal.appendChild(imagenClonada);
            }

            // Copiar la información detallada
            const detalleClonado = infoDetalle.cloneNode(true);
            detalleClonado.classList.remove("info-detalle");

            infoModalAnimal.appendChild(detalleClonado);

            // Abrir la ventana
            modalAnimal.showModal();
        });
    });

    // Cerrar con el botón X
    btnCerrarModal.addEventListener("click", function () {
        modalAnimal.close();
    });

    // Cerrar al hacer clic fuera del contenido
    modalAnimal.addEventListener("click", function (evento) {
        if (evento.target === modalAnimal) {
            modalAnimal.close();
        }
    });
}
