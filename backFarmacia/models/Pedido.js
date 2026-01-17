class Pedido {
    constructor({ id, usuario_id, total, metodo_pago, estado_pago, estado_envio, receta_path, fecha }) {
        this.id = id;
        this.usuario_id = usuario_id;
        this.total = total;
        this.metodo_pago = metodo_pago;
        this.estado_pago = estado_pago;
        this.estado_envio = estado_envio; 
        this.receta_path = receta_path; 
        this.fecha = fecha;
    }
}

module.exports = Pedido;