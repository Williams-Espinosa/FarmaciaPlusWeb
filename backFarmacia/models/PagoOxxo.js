class PagoOxxo {
    constructor({ id, pedido_id, referencia, monto, expiracion }) {
        this.id = id;
        this.pedido_id = pedido_id;
        this.referencia = referencia; 
        this.monto = monto;
        this.expiracion = expiracion;
    }
}

module.exports = PagoOxxo;