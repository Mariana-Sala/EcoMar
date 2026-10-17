const btnVolverInicio = document.getElementById("btnVolverInicio");

// Mostrar u ocultar el botón según el scroll
window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
        btnVolverInicio.classList.add("visible");
    } else {
        btnVolverInicio.classList.remove("visible");
    }
});

// Volver al inicio con desplazamiento suave
btnVolverInicio.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
