
/********** DECLARACIÓN Y VARIABLES **********
**********************************************/
import Pago from './Models/Pago.js'; // Ruta relativa al archivo Prestamo.js
import Prestamo from './Models/Prestamo.js'; // Ruta relativa al archivo Prestamo.js


const plazo = [3, 6, 9, 12];
let prestamo = ObtenerPrestamoGuardado() || null; // Falsy
let pagos = ObtenerPagosGuardados() || null;
let filtroCuotas = document.getElementById("inputfiltroCuota");
let amount = document.getElementById("amount");
let fromCurrency = document.getElementById("fromCurrency");
let toCurrency = document.getElementById("toCurrency");
let resultConvert = document.getElementById("result");

let btnAgregarPrestamo = document.getElementById("btnAgregarPrestamo");
let btnVerCuotas = document.getElementById("btnVerPrestamo");
let btnGenerarPago = document.getElementById("btnPagos");
let btnLimpiarFiltro = document.getElementById("btnLimpiarLS");
let btnConvertirMoneda = document.getElementById("btnConvert");



/********** FUNCIONES PRESTAMOS **********
******************************************/

function GuardarPrestamo() {
    if (prestamo !== null) {
        localStorage.setItem("prestamo", JSON.stringify(prestamo));
    }
}

function ObtenerPrestamoGuardado() {
    return JSON.parse(localStorage.getItem("prestamo"));
}

function GetRandomCuota(cuotas) {
    const index = Math.floor(Math.random() * cuotas.length);
    return cuotas[index];
}

function AgregarPrestamo(monto, tasa, cuotas) {
    prestamo = new Prestamo(monto, tasa, cuotas);
    GuardarPrestamo();
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

function ObtenerImportePrestamo() {
    return Swal.fire({
        title: 'Ingresar monto del préstamo',
        input: 'number',
        inputLabel: 'Monto del préstamo',
        inputPlaceholder: 'Ingrese el monto del préstamo',
        inputValidator: (value) => {
            if (!value) {
                return "Por favor, ingrese un monto.";
            }
            if (isNaN(value)) {
                return "Por favor, ingrese un número numérico válido.";
            }
            if (value <= 0) {
                return "Por favor, ingrese un número positivo.";
            }
        }
    });
}

function MostrarConfirmacion(monto) {
    return Swal.fire({
        title: 'Confirmar',
        text: `¿Deseas agregar un préstamo con un monto de $${monto}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar'
    });
}


/************ FUNCIONES PAGOS ************
******************************************/

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
            <label class="labelFiltro">Presione enter para el filtro (0 para traer toda la lista)</label>
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
        <h6 class="labelTotal">Total: ${pagoTotal.toFixed(2)}</h6>
    `;
    return tablaHtml;
}

function GeneraPago() {
    return new Promise((resolve) => {
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
        resolve(p);
    });
}

function FiltrarPago(pagos, filtroCuota) {
    return filtroCuota > 0
        ? pagos.filter(p => p.numPago === filtroCuota)
        : pagos;
}


/********** FUNCIONES GENERICAS **********
******************************************/

function MostrarTablaDetalles(title, tablaHtml) {
    Swal.fire({
        title: title,
        html: tablaHtml,
        icon: 'info',
        confirmButtonText: 'Cerrar'
    })
}

function MostrarAlerta(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon
    });
}


/**************** EVENTOS ****************
******************************************/

document.addEventListener('DOMContentLoaded', () => {

    btnAgregarPrestamo.addEventListener("click", async function () {
        const { value: montoIngresado } = await ObtenerImportePrestamo();
        if (montoIngresado !== undefined) {
            const cuotas = GetRandomCuota(plazo);
            if (ObtenerPrestamoGuardado()) {
                MostrarAlerta("Atención", "Ya hay un préstamo guardado anteriormente.", "warning");
            } else {
                const confirmacion = await MostrarConfirmacion(montoIngresado);
                if (confirmacion.isConfirmed) {
                    AgregarPrestamo(parseFloat(montoIngresado), 0.05, cuotas);
                    MostrarAlerta("Éxito", "Se ha ingresado exitosamente..", "success");
                }
            }
        }
    });

    btnVerCuotas.addEventListener("click", function () {
        if (prestamo !== null) {
            const tablaHtml = GenerarTablaPrestamo(prestamo);
            MostrarTablaDetalles("Detalles del Prestamo", tablaHtml);
        } else {
            MostrarAlerta("Warning", "No hay prestamo cargado.", "warning");
        }
    });

    btnGenerarPago.addEventListener("click", function () {
        if (ObtenerPagosGuardados()) {
            GeneraPago()
                .then(arrPago => {
                    GuardarPagosLS(arrPago);
                    pagos = arrPago; // Actualizo la variable de pagos
                    const tablaHtml = GeneraTablaPago(pagos);
                    MostrarTablaDetalles("Detalles del Pago", tablaHtml);
                })
                .catch(error => {
                    MostrarAlerta("Error", error.message, "error");
                })
        } else {
            MostrarAlerta("Error", "No hay pagos prestamo guardado", "error");
        }
    });

    document.addEventListener('change', function (event) {
        if (event.target && event.target.id === 'inputfiltroCuota') {
            const filtroCuota = parseInt(event.target.value);
            const pagosFiltrados = FiltrarPago(pagos, filtroCuota);
            const tablaHtml = GeneraTablaPago(pagosFiltrados);
            MostrarTablaDetalles("Detalle de Pago", tablaHtml);
        }
    });

    btnLimpiarFiltro.addEventListener("click", () => {
        localStorage.removeItem("prestamo");
        localStorage.removeItem("listaPagos");
        localStorage.clear();
        location.reload();
    });

    btnConvertirMoneda.addEventListener("click", function () {
        if (!isNaN(amount.value) && amount.value > 0) {
            fetch("./moneda.json")
                .then((resp) => resp.json())
                .then((data) => {
                    const monedas = data.monedas;
                    const from = monedas.find(c => c.codigo === fromCurrency.value).valor;
                    const to = monedas.find(c => c.codigo === toCurrency.value).valor;
                    const convert = (amount.value * from) / to;

                    resultConvert.textContent = `
                    ${amount.value} ${fromCurrency.value} equivalen a ${convert.toFixed(2)} ${toCurrency.value}
                `;
                })
                .catch(error => {
                    MostrarAlerta("Error", error.message, "error");
                })
        }
    });

});

