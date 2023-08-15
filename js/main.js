/** DECLARACION DE VARIABLES **/
import Pago from './Pago.js'; // Ruta relativa al archivo Prestamo.js
import Prestamo from './Prestamo.js'; // Ruta relativa al archivo Prestamo.js

const plazo = [3, 6, 9, 12];
let prestamo = ObtenerPrestamoGuardado() || null; // Falsy

let filtroCuotas = document.getElementById("inputfiltroCuota");
let pagos = ObtenerPagosGuardados() || null;

// let btnFiltrar = document.getElementById("btnFiltro");
let btnLimpiarFiltro = document.getElementById("btnLimpiarLS");
let btnAgregarPrestamo = document.getElementById("btnAgregarPrestamo");
let btnVerCuotas = document.getElementById("btnVerPrestamo");
let btnGenerarPago = document.getElementById("btnPagos");


/** FUNCIONES **/

/**
 * Guarda los prestamos y el ultimo id del objeto en el localstorage
 */
function GuardarPrestamo() {
    if (prestamo !== null) {
        localStorage.setItem("prestamo", JSON.stringify(prestamo));
    }
}

/**
 * 
 * @returns Prestamos guardados.
 */
function ObtenerPrestamoGuardado() {
    return JSON.parse(localStorage.getItem("prestamo"));
}

/**
 * Devuelve las cuotas segun arreglo ingresado
 * @param {*} cuotas 
 * @returns Cantidad de cuotas
 */
function GetRandomCuota(cuotas) {
    const index = Math.floor(Math.random() * cuotas.length);
    return cuotas[index];
}

/**
 * Se agrega prestamo.
 * @param {*} monto 
 * @param {*} tasa 
 * @param {*} plazo 
 */
function AgregarPrestamo(monto, tasa, cuotas) {
    prestamo = new Prestamo(monto, tasa, cuotas);
    GuardarPrestamo();
}

/**
 * Funcion que muestra como van a ser los pagos con sus intereses.
 * @returns Arreglo de Pago
 */
function GeneraPago() {
    const p = [];
    let saldoRestante = prestamo.monto;
    for (let numPago = 1; numPago <= prestamo.plazo; numPago++) {
        const interesMensual = saldoRestante * (prestamo.tasa / 100) / 12;
        const montoMensual = prestamo.cuotaMensual + interesMensual * prestamo.cuotaMensual;
        (numPago === prestamo.plazo)
            ? saldoRestante = 0
            : saldoRestante -= prestamo.cuotaMensual;
        p.push(new Pago(numPago, interesMensual.toFixed(2), saldoRestante.toFixed(2), montoMensual.toFixed(2)));
    }
    return p;
}

/**
 * Guardo
 * @param {*} p 
 */
function GuardarPagosLS(p) {
    const pagosJson = JSON.stringify(p);
    localStorage.setItem("listaPagos", pagosJson);
}

function ObtenerPagosGuardados() {
    const pagosJSON = localStorage.getItem('listaPagos');
    return JSON.parse(pagosJSON) || [];
}

function GeneraTablaPago(pagos) {
    let tablaHtml = "";
    tablaHtml += `
        <div>
            <label>Cuota: </label>
            <input type="number" id="inputfiltroCuota">
            <label class="labelFiltro">Presione enter para el filtro</label>
        </div>
    `;
    tablaHtml += `
        <table class="table">
            <thead class="table-light">
                <tr>
                    <th>Cuota</th>
                    <th>Interes</th>
                    <th>Monto Mensual</th>
                    <th>Saldo Restante</th>
                </tr>
            </thead>
    `;
    let pagoTotal = 0;
    pagos.forEach(pago => {
        tablaHtml += `
        <tbody>
            <tr>
                <td>${pago.numPago}</td>
                <td>${pago.interesMensual}</td>
                <td>${pago.pagoMensual}</td>
                <td>${pago.saldoRestante}</td>
            </tr>
        </tbody>
    `;
        pagoTotal += parseFloat(pago.pagoMensual);
    });
    tablaHtml += "</table>";
    tablaHtml += `
        <h6>Total: ${pagoTotal.toFixed(2)}</h6>
    `;
    return tablaHtml;
}

function GenerarTablaPrestamo(prestamo) {
    let tablaHtml = "";
    tablaHtml += `
        <table class="table">
            <thead class="table-light">
                <tr>
                    <th>Monto</th>
                    <th>Tasa</th>
                    <th>Plazo</th>
                </tr>
            </thead>
        `;
    tablaHtml += `
        <tbody>
            <tr>
                <td>$${prestamo.monto}</td>
                <td>${prestamo.tasa * 100}%</td>
                <td>${prestamo.plazo} cuotas</td>
                
            </tr>
        </tbody>
    `;
    tablaHtml += "</table>";
    return tablaHtml;
}



/** EVENTOS DE BOTONES */

document.addEventListener('DOMContentLoaded', function () {

    btnAgregarPrestamo.addEventListener("click", async function () {
        const { value: montoIngresado } = await Swal.fire({
            title: 'Ingresar monto del préstamo',
            input: 'number',
            inputLabel: 'Monto del préstamo',
            inputPlaceholder: 'Ingrese el monto del préstamo',
            inputValidator: (value) => {
                if (!value) {
                    return "Por favor, ingrese un monto.";
                }
                if (isNaN(value)) {
                    return "Por favor, ingrese un numero numerico vaido.";
                }
                if(value <= 0) {
                    return "Por favor, ingrese un numero positivo.";
                }
            }
        });
        if (montoIngresado !== undefined) {
            const cuotas = GetRandomCuota(plazo);
            if (ObtenerPrestamoGuardado()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: 'Ya hay un préstamo guardado anteriormente.',
                });
            } else {
                Swal.fire({
                    title: 'Confirmar',
                    text: `¿Deseas agregar un préstamo con un monto de $${montoIngresado}?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Agregar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        AgregarPrestamo(parseFloat(montoIngresado), 0.05, cuotas);
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: 'Se ha ingresado exitosamente.',
                        });
                    }
                });
            }
        }
    });

    btnVerCuotas.addEventListener("click", function () {
        if (prestamo !== null) {
            const tablaHtml = GenerarTablaPrestamo(prestamo);
            Swal.fire({
                title: 'Detalle del Préstamo',
                html: tablaHtml,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            })
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'No hay prestamo cargado.'
            });
        }
    });

    btnGenerarPago.addEventListener("click", function () {
        if (prestamo === null) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'No hay prestamo cargado.'
            })
        }
        else {
            const arrPago = GeneraPago();
            GuardarPagosLS(arrPago);
            const tablaHtml = GeneraTablaPago(arrPago);
            Swal.fire({
                title: 'Detalle de Pagos',
                html: tablaHtml,
                confirmButtonText: 'Cerrar'
            });
        }
    })

    document.addEventListener('change', function (event) {
        if (event.target && event.target.id === 'inputfiltroCuota') {
            const filtroCuota = parseInt(event.target.value);
            const pagosFiltrados = filtroCuota > 0 ? pagos.filter(p => p.numPago === filtroCuota) : pagos;
            const tablaHtml = GeneraTablaPago(pagosFiltrados);
            Swal.fire({
                title: 'Detalle de Pagos',
                html: tablaHtml,
                confirmButtonText: 'Cerrar',
            });
        }
    });

    btnLimpiarFiltro.addEventListener("click", () => {
        localStorage.removeItem("prestamo");
        localStorage.removeItem("listaPagos");
    });


})
