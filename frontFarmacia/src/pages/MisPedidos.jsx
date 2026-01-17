import { useEffect, useState } from 'react';
import api from '../services/api';

const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const cargarPedidos = async () => {
            try {
                const res = await api.get('/pedidos/mis-pedidos');
                setPedidos(res.data);
            } catch (err) {
                console.error(err); 
                alert("Error: Credenciales inválidas");
            }
        };
        cargarPedidos();
    }, []);

    // Función para definir el color del estatus de envío
    const getStatusColor = (status) => {
        switch(status) {
            case 'entregado': return '#27ae60';
            case 'en_transito': return '#2980b9';
            default: return '#f39c12';
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>📋 Mi Historial de Compras</h2>
            {pedidos.map(pedido => (
                <div key={pedido.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>Orden #{pedido.id}</strong> - {new Date(pedido.fecha).toLocaleDateString()}</span>
                        <span style={{ color: getStatusColor(pedido.estado_envio), fontWeight: 'bold' }}>
                            {pedido.estado_envio.toUpperCase()}
                        </span>
                    </div>
                    
                    <p>Total: <strong>${pedido.total}</strong></p>

                    {pedido.metodo_pago === 'oxxo' && pedido.estado_pago === 'pendiente' && (
                        <div style={{ background: '#fff9e6', padding: '10px', borderLeft: '5px solid #f1c40f', marginTop: '10px' }}>
                            <p style={{ margin: 0 }}>🏪 <strong>Ficha Oxxo Pay activa:</strong></p>
                            <p style={{ fontSize: '1.2em', letterSpacing: '2px', margin: '5px 0' }}>{pedido.referencia}</p>
                            <small>Pagar antes de: {new Date(pedido.expiracion).toLocaleString()}</small>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MisPedidos;