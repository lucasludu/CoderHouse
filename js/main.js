class Prestamos {
    constructor(monto, tasa, plazo) {
        this.monto = monto;
        this.tasa = tasa;
        this.plazo = plazo;
    }

    /**
     * Se realiza el calclo de los intereses del prestamo
     * @returns Intereses
     */
    CalcularIntereses() {
        return this.monto * this.tasa * this.plazo;
    }

    /**
     * Se realiza el calculo total del prestamo
     * @returns Monto Total
     */
    CalcularTotal() {
        let suma = 0;

        for (let i = 1; i <= this.plazo; i++) {
            const pagoMensual = this.CalcularCuotaMensual(i);
            suma += pagoMensual
        }
        return (parseFloat(this.monto) + suma).toFixed(2);
    }

    /**
     * Se realiza la cuenta de la cuota mensual
     * @param {*} p 
     * @returns Valor de cada cuota
     */
    CalcularCuotaMensual(p) {
        const r = this.tasa / p;
        const montoMensual = (this.monto * r) / (1 - Math.pow(1 + r, -this.plazo));
        return parseFloat(montoMensual.toFixed(2));
    }

    /**
     * 
     * @returns Pago Automatico
     */
    CalcularPagoAutomatico() {
        const pagos = [];
        for (let i = 1; i <= this.plazo; i++) {
            const pagoMensual = this.CalcularCuotaMensual(i);
            pagos.push(pagoMensual);
        }
        return pagos;
    }

    /**
     * 
     * @param {*} condicion 
     * @returns Filtra el pago segun la condicion indicada.
     */
    FiltrarPago(condicion) {
        return this.CalcularPagoAutomatico().filter(condicion);
    }

}

/************************************************************************************************************/
/************************************************************************************************************/

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
function AgregarPrestamo(tasa) {
    let monto = parseFloat(prompt("Ingrese monto del prestamo: "));

    const plazo = [3, 6, 9, 12];
    let cantidadCuotas = GetRandomCuota(plazo);
    return new Prestamos(monto, tasa, cantidadCuotas);
}


function Main() {
    let prestamo = AgregarPrestamo(0.05);

    var cuotas = prestamo.CalcularPagoAutomatico();

    console.log("Prestamo: " + prestamo.monto);
    cuotas.forEach((pago, index) => {
        const i = index + 1;
        console.log(`Cuota ${i}: ${pago.toFixed(2)}`);
    })
    console.log("Monto total a pagar: " + prestamo.CalcularTotal());


    // Ejemplo de filtrado: Mostrar el pago de una cuota específica
    const cuotaFiltrada = prestamo.FiltrarPago((pago) => pago < parseFloat(prestamo.monto) / 10);
    if (cuotaFiltrada.length > 0) {
        console.log("\nCuotas menores al 10% del monto del préstamo:");
        cuotaFiltrada.forEach((pago, index) => {
            const i = index + 1;
            console.log(`Cuota ${i}: ${pago.toFixed(2)}`);
        });
    } else {
        console.log("\nNo hay cuotas menores al 10% del monto del préstamo.");
    }

    let busca = parseFloat(prompt("Ingrese cuota a buscar: "));
    const cuotaBuscar = cuotas.filter((pago, index) => index === busca);
    if (cuotaBuscar.length > 0) {
        console.log(`Valor de Cuota ${busca}: ${cuotaBuscar[0].toFixed(2)}`);
    } else {
        console.log(`\nNo se encontró la cuota ${busca}`);
    }

}




Main();
