const talonario = document.getElementById("talonario");
const listaCompras = document.getElementById("listaCompras");

const modal = document.getElementById("modalReserva");
const numeroSeleccionado = document.getElementById("numeroSeleccionado");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

let numeroActual = "";

let vendidos =
JSON.parse(localStorage.getItem("vendidos")) || [];

crearTalonario();
actualizarListado();
actualizarEstadisticas();

function crearTalonario() {

    talonario.innerHTML = "";

    for (let i = 0; i <= 99; i++) {

        let numero = i.toString().padStart(2, "0");

        let div = document.createElement("div");

        div.classList.add("numero");

        div.innerHTML = numero;

        if (
            vendidos.some(item => item.numero === numero)
        ) {
            div.classList.add("vendido");
        }

        div.addEventListener("click", () => {

            if (
                vendidos.some(item => item.numero === numero)
            ) {

                alert("Este número ya está reservado.");
                return;
            }

            numeroActual = numero;

            numeroSeleccionado.textContent = numero;

            modal.style.display = "flex";

        });

        talonario.appendChild(div);
    }
}

btnGuardar.addEventListener("click", () => {

    let nombre =
        document.getElementById("nombre").value.trim();

    let telefono =
        document.getElementById("telefono").value.trim();

    let ciudad =
        document.getElementById("ciudad").value.trim();

    let metodoPago =
        document.getElementById("metodoPago").value;

    if (
        nombre === "" ||
        telefono === "" ||
        ciudad === "" ||
        metodoPago === ""
    ) {

        alert("Por favor complete todos los campos.");
        return;
    }

    vendidos.push({
        numero: numeroActual,
        nombre: nombre,
        telefono: telefono,
        ciudad: ciudad,
        metodoPago: metodoPago
    });

    localStorage.setItem(
        "vendidos",
        JSON.stringify(vendidos)
    );

    let mensaje =
`Hola.

Deseo reservar el número ${numeroActual}

Nombre: ${nombre}

Teléfono: ${telefono}

Ciudad: ${ciudad}

Método de pago: ${metodoPago}

Enviaré el comprobante de pago en una imagen por este mismo chat.

Gracias.`;

    let telefonoDestino = "573014834578";

    let enlace =
        `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(mensaje)}`;

    window.open(enlace, "_blank");

    modal.style.display = "none";

    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("ciudad").value = "";
    document.getElementById("metodoPago").value = "";

    crearTalonario();
    actualizarListado();
    actualizarEstadisticas();

});

btnCancelar.addEventListener("click", () => {

    modal.style.display = "none";

});

function actualizarListado() {

    listaCompras.innerHTML = "";

    vendidos.forEach(item => {

        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${item.numero}</td>
            <td>${item.nombre}</td>
            <td>${item.telefono}</td>
            <td>${item.ciudad}</td>
            <td>${item.metodoPago}</td>
            <td>
                <button
                    class="btn-liberar"
                    onclick="liberarNumero('${item.numero}')">
                    Liberar
                </button>
            </td>
        `;

        listaCompras.appendChild(fila);

    });

}

function liberarNumero(numero) {

    let clave =
        prompt("Ingrese clave de administrador");

    if (clave !== "2026") {

        alert("Clave incorrecta");
        return;

    }

    vendidos =
        vendidos.filter(
            item => item.numero !== numero
        );

    localStorage.setItem(
        "vendidos",
        JSON.stringify(vendidos)
    );

    crearTalonario();
    actualizarListado();
    actualizarEstadisticas();

}

function actualizarEstadisticas() {

    document.getElementById("vendidos").textContent =
        vendidos.length;

    document.getElementById("disponibles").textContent =
        100 - vendidos.length;

}