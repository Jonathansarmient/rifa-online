const talonario =
document.getElementById("talonario");

const listaCompras =
document.getElementById("listaCompras");

let vendidos =
JSON.parse(localStorage.getItem("vendidos")) || [];

crearTalonario();
actualizarListado();
actualizarEstadisticas();

function crearTalonario(){

    talonario.innerHTML="";

    for(let i=0;i<=99;i++){

        let numero =
        i.toString().padStart(2,"0");

        let div =
        document.createElement("div");

        div.classList.add("numero");

        div.innerHTML = numero;

        if(vendidos.includes(numero)){
            div.classList.add("vendido");
        }

        div.addEventListener("click",()=>{

            if(vendidos.includes(numero)){

                alert(
                    "Este número ya no está disponible."
                );

                return;
            }

            let confirmar =
            confirm(
                `¿Desea reservar el número ${numero}?`
            );

            if(confirmar){

                vendidos.push(numero);

                localStorage.setItem(
                    "vendidos",
                    JSON.stringify(vendidos)
                );

                let mensaje =
`Hola.

Deseo reservar el número ${numero}

Rifa Mochila Selección Colombia.

Gracias.`;

                let telefono =
                "573014834578";

                let enlace =
                `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

                window.open(
                    enlace,
                    "_blank"
                );

                crearTalonario();
                actualizarListado();
                actualizarEstadisticas();

            }

        });

        talonario.appendChild(div);

    }

}

function actualizarListado(){

    listaCompras.innerHTML="";

    vendidos.forEach(numero=>{

        let fila =
        document.createElement("tr");

        fila.innerHTML = `
            <td>${numero}</td>
            <td>No Disponible</td>
        `;

        listaCompras.appendChild(fila);

    });

}

function actualizarEstadisticas(){

    document.getElementById("vendidos")
        .innerHTML =
        vendidos.length;

    document.getElementById("disponibles")
        .innerHTML =
        100 - vendidos.length;

}