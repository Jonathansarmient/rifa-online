document.addEventListener("DOMContentLoaded", async () => {

    const SUPABASE_URL =
        "https://rurjturupxgjuzgexejx.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_n11wWiZX9IGMBD3YHW6aoA_LDRCapAP";

    const supabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    const talonario =
        document.getElementById("talonario");

    const listaCompras =
        document.getElementById("listaCompras");

    const modal =
        document.getElementById("modalReserva");

    const numeroSeleccionado =
        document.getElementById("numeroSeleccionado");

    const btnGuardar =
        document.getElementById("btnGuardar");

    const btnCancelar =
        document.getElementById("btnCancelar");

    let numeroActual = "";

    let vendidos = [];

    // ==========================
    // CARGAR DATOS
    // ==========================

    async function cargarReservas() {

        const { data, error } =
            await supabase
                .from("vendidos")
                .select("*");

        if (error) {

            console.error(error);
            return;

        }

        vendidos = data;

        crearTalonario();
        actualizarListado();
        actualizarEstadisticas();

    }

    await cargarReservas();

   document
.getElementById("btnExcel")
.addEventListener("click", () => {

    let clave = prompt(
        "Ingrese clave de administrador"
    );

    if(clave !== "Rifa2026"){

        alert("Clave incorrecta");
        return;

    }

    exportarExcel();

});

    // ==========================
    // TALONARIO
    // ==========================

    function crearTalonario() {

        talonario.innerHTML = "";

        for (let i = 0; i <= 99; i++) {

            let numero =
                i.toString().padStart(2, "0");

            let div =
                document.createElement("div");

            div.className = "numero";

            div.textContent = numero;

            if (
                vendidos.some(
                    item => item.numero === numero
                )
            ) {
                div.classList.add("vendido");
            }

            div.addEventListener("click", () => {

                if (
                    vendidos.some(
                        item => item.numero === numero
                    )
                ) {

                    alert("Este número ya fue reservado.");
                    return;

                }

                numeroActual = numero;

                numeroSeleccionado.innerHTML =
                    "🎟️ " + numero;

                modal.style.display = "flex";

            });

            talonario.appendChild(div);

        }

    }

    // ==========================
    // GUARDAR
    // ==========================

    btnGuardar.addEventListener("click", async () => {

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

            alert("Complete todos los campos.");
            return;

        }

        const { error } =
            await supabase
                .from("vendidos")
                .insert([
                    {
                        numero: numeroActual,
                        nombre,
                        telefono,
                        ciudad,
                        metodopago: metodoPago
                    }
                ]);

        if (error) {

            alert("Error al guardar");
            console.error(error);
            return;

        }

        let mensaje =
`Hola.

Deseo reservar el número ${numeroActual}

Nombre: ${nombre}

Teléfono: ${telefono}

Ciudad: ${ciudad}

Método de pago: ${metodoPago}

Enviaré el comprobante por este mismo chat.

Gracias.`;

        let telefonoDestino =
            "573014834578";

        let enlace =
            `https://wa.me/${telefonoDestino}?text=${encodeURIComponent(mensaje)}`;

        window.open(enlace, "_blank");

        modal.style.display = "none";

        document.getElementById("nombre").value = "";
        document.getElementById("telefono").value = "";
        document.getElementById("ciudad").value = "";
        document.getElementById("metodoPago").value = "";

        await cargarReservas();

    });

    // ==========================
    // CANCELAR
    // ==========================

    btnCancelar.addEventListener("click", () => {

        modal.style.display = "none";

    });

    // ==========================
    // LISTADO
    // ==========================

    function actualizarListado() {

        listaCompras.innerHTML = "";

        vendidos.forEach(item => {

            let fila =
                document.createElement("tr");

            fila.innerHTML = `
    <td>${item.numero}</td>
    <td>${item.nombre}</td>
    <td>${item.ciudad}</td>
    <td>${item.metodopago}</td>

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

    // ==========================
    // LIBERAR
    // ==========================

    window.liberarNumero = async function(numero) {

        let clave =
            prompt(
                "Ingrese clave de administrador"
            );

        if (clave !== "Rifa2026") {

            alert("Clave incorrecta");
            return;

        }

        const { error } =
            await supabase
                .from("vendidos")
                .delete()
                .eq("numero", numero);

        if (error) {

            alert("Error al liberar");
            console.error(error);
            return;

        }

        alert(
            `Número ${numero} liberado`
        );

        await cargarReservas();

    };

    // ==========================
    // ESTADÍSTICAS
    // ==========================

    function actualizarEstadisticas() {

        document.getElementById(
            "vendidos"
        ).textContent =
            vendidos.length;

        document.getElementById(
            "disponibles"
        ).textContent =
            100 - vendidos.length;

    }
function exportarExcel(){

    const datos = vendidos.map(item => ({

        Numero: item.numero,
        Nombre: item.nombre,
        Telefono: item.telefono,
        Ciudad: item.ciudad,
        MetodoPago: item.metodopago,
        EstadoPago: ""

    }));

    const hoja =
        XLSX.utils.json_to_sheet(datos);

    const libro =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        libro,
        hoja,
        "Reservas"
    );

    XLSX.writeFile(
        libro,
        "Rifa_Mochila_2026.xlsx"
    );

}
});