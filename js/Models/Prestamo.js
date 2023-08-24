class Prestamo {

    constructor(monto, tasa, plazo) {
        this.monto = monto;
        this.tasa = tasa;
        this.plazo = plazo;
        this.cuotaMensual = this.CalcularCuotaMensual(this.plazo);
        this.pagos = [];
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

}
export default Prestamo; // Exporta la clase Prestamo por defecto
