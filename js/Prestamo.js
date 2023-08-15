class Prestamo {

    constructor(monto, tasa, plazo) {
        this.monto = monto;
        this.tasa = tasa;
        this.plazo = plazo;
        this.cuotaMensual = this.CalcularCuotaMensual(this.plazo);
        this.pagos = [];
    }

    /**
     * Se realiza el calclo de los intereses del prestamo
     * @returns Intereses
     */
    // CalcularIntereses() {
    //     return this.monto * this.tasa * this.plazo;
    // }

    /**
     * Se realiza el calculo total del prestamo
     * @returns Monto Total
     */
    // CalcularTotal() {
    //     let suma = 0;

    //     for (let i = 1; i <= this.plazo; i++) {
    //         const pagoMensual = this.CalcularCuotaMensual(i);
    //         suma += pagoMensual
    //     }
    //     return (parseFloat(this.monto) + suma).toFixed(2);
    // }

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
    // CalcularPagoAutomatico() {
    //     const pagos = [];
    //     for (let i = 1; i <= this.plazo; i++) {
    //         const pagoMensual = this.CalcularCuotaMensual(i);
    //         pagos.push(pagoMensual);
    //     }
    //     return pagos;
    // }

    /**
     * @param {*} condicion 
     * @returns Filtra el pago segun la condicion indicada.
     */
    FiltrarPago(condicion) {
        return this.CalcularPagoAutomatico().filter(condicion);
    }

}
export default Prestamo; // Exporta la clase Prestamo por defecto
