-- Migración para soporte de Stripe (Tarjeta + OXXO)
-- Ejecutar: mysql -u root -p farmacia_db < stripe.sql

USE farmacia_db;

-- 1. Actualizar tabla pedido para incluir tarjeta como método de pago
ALTER TABLE pedido 
    MODIFY COLUMN metodo_pago ENUM('efectivo', 'tarjeta', 'oxxo') NOT NULL;

-- 2. Renombrar y actualizar tabla pago_oxxo -> pago_externo
-- Primero eliminar la foreign key antigua si existe
ALTER TABLE pago_oxxo DROP FOREIGN KEY pago_oxxo_ibfk_1;

-- Renombrar tabla
RENAME TABLE pago_oxxo TO pago_externo;

-- Actualizar estructura
ALTER TABLE pago_externo 
    ADD COLUMN tipo_pago ENUM('oxxo', 'tarjeta') DEFAULT 'oxxo' AFTER id,
    ADD COLUMN stripe_payment_intent_id VARCHAR(100) AFTER tipo_pago,
    ADD COLUMN stripe_charge_id VARCHAR(100) AFTER stripe_payment_intent_id,
    ADD COLUMN estado ENUM('pendiente', 'pagado', 'expirado', 'cancelado') DEFAULT 'pendiente' AFTER monto,
    ADD COLUMN metadata JSON AFTER estado,
    MODIFY COLUMN referencia VARCHAR(100);

-- Restaurar foreign key con nombre correcto
ALTER TABLE pago_externo 
    ADD CONSTRAINT fk_pago_externo_pedido 
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE;

-- 3. Crear tabla para pagos con tarjeta
CREATE TABLE IF NOT EXISTS pago_tarjeta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    stripe_payment_intent_id VARCHAR(100) NOT NULL,
    stripe_charge_id VARCHAR(100),
    ultimos_4_digitos VARCHAR(4),
    marca ENUM('visa', 'mastercard', 'amex', 'otro') DEFAULT 'otro',
    estado ENUM('pendiente', 'procesando', 'exitoso', 'fallido', 'cancelado') DEFAULT 'pendiente',
    monto DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    UNIQUE KEY idx_payment_intent (stripe_payment_intent_id)
);

-- 4. Agregar índices para mejor rendimiento
CREATE INDEX idx_pedido_metodo_pago ON pedido(metodo_pago);
CREATE INDEX idx_pedido_estado_pago ON pedido(estado_pago);
CREATE INDEX idx_pago_externo_payment_intent ON pago_externo(stripe_payment_intent_id);

-- 5. Agregar campo de tracking de transacción al pedido
ALTER TABLE pedido 
    ADD COLUMN transaction_id VARCHAR(100) AFTER estado_pago,
    ADD INDEX idx_transaction_id (transaction_id);

-- Resultados
SELECT 'Migración completada exitosamente!' as resultado;
SELECT '✓ Tabla pedido actualizada con método tarjeta' as paso_1;
SELECT '✓ Tabla pago_oxxo renombrada a pago_externo' as paso_2;
SELECT '✓ Tabla pago_tarjeta creada' as paso_3;
SELECT '✓ Índices agregados' as paso_4;
