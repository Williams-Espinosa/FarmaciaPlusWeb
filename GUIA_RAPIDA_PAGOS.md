# Guía Rápida - Ejecutar Migración y Probar Pagos

## 1. Ejecutar Migración SQL

### Opción A: Desde MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu servidor local
3. Abre el archivo `stripe.sql`
4. Ejecuta todo el script (⚡ botón Execute)

### Opción B: Desde línea de comandos

```bash
# En PowerShell o CMD
mysql -u root -p farmacia_db < stripe.sql
# Te pedirá la contraseña de MySQL
```

### Opción C: Manual

```sql
-- Conéctate a MySQL y ejecuta estos comandos:
USE farmacia_db;

-- Actualizar metodo_pago para incluir tarjeta
ALTER TABLE pedido MODIFY COLUMN metodo_pago ENUM('efectivo', 'tarjeta', 'oxxo') NOT NULL;

-- Renombrar pago_oxxo a pago_externo y agregar campos
ALTER TABLE pago_oxxo DROP FOREIGN KEY pago_oxxo_ibfk_1;
RENAME TABLE pago_oxxo TO pago_externo;

ALTER TABLE pago_externo
    ADD COLUMN tipo_pago ENUM('oxxo', 'tarjeta') DEFAULT 'oxxo' AFTER id,
    ADD COLUMN stripe_payment_intent_id VARCHAR(100) AFTER tipo_pago,
    ADD COLUMN stripe_charge_id VARCHAR(100) AFTER stripe_payment_intent_id,
    ADD COLUMN estado ENUM('pendiente', 'pagado', 'expirado', 'cancelado') DEFAULT 'pendiente' AFTER monto,
    ADD COLUMN metadata JSON AFTER estado,
    MODIFY COLUMN referencia VARCHAR(100);

ALTER TABLE pago_externo ADD CONSTRAINT fk_pago_externo_pedido FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE;

-- Crear tabla pago_tarjeta
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

-- Agregar transaction_id a pedido
ALTER TABLE pedido ADD COLUMN transaction_id VARCHAR(100) AFTER estado_pago;

-- Crear índices
CREATE INDEX idx_pedido_metodo_pago ON pedido(metodo_pago);
CREATE INDEX idx_pedido_estado_pago ON pedido(estado_pago);
CREATE INDEX idx_pago_externo_payment_intent ON pago_externo(stripe_payment_intent_id);
CREATE INDEX idx_transaction_id ON pedido(transaction_id);
```

## 2. Verificar Migración

```sql
-- Verificar que las tablas se crearon correctamente
DESC pedido;  -- Debe tener transaction_id y metodo_pago con 'tarjeta'
DESC pago_externo;  -- Nueva tabla renombrada
DESC pago_tarjeta;  -- Nueva tabla creada
SHOW INDEXES FROM pedido;  -- Ver índices
```

## 3. Reiniciar Servidor Backend

```bash
cd backFarmacia
npm run dev
```

Deberías ver:

```
Servidor de Farmacia corriendo en el puerto 3000
```

## 4. Probar Pagos (Modo Test)

### A. Pago con Tarjeta de Prueba

1. Ve al frontend (http://localhost:5173)
2. Agrega productos al carrito
3. Ve a Checkout
4. Selecciona "Tarjeta Bancaria"
5. Usa estos datos de prueba:
   - **Número:** 4242 4242 4242 4242
   - **Fecha:** 12/25 (cualquier fecha futura)
   - **CVC:** 123 (cualquier 3 dígitos)
   - **Nombre:** Test User
6. Haz clic en "Pagar"
7. ✅ Deberías ver la pantalla de éxito

**Verificar en base de datos:**

```sql
SELECT * FROM pedido ORDER BY id DESC LIMIT 1;
-- estado_pago debe ser 'pagado'

SELECT * FROM pago_tarjeta ORDER BY id DESC LIMIT 1;
-- estado debe ser 'exitoso'
```

### B. Pago con OXXO

1. En Checkout, selecciona "OXXO Pay"
2. Se generará una ficha con:
   - Número de referencia
   - Código de barras (link a Stripe)
   - Monto
   - Fecha de expiración
3. ✅ Puedes descargar/imprimir la ficha

**Verificar en base de datos:**

```sql
SELECT * FROM pedido ORDER BY id DESC LIMIT 1;
-- estado_pago debe ser 'pendiente'

SELECT * FROM pago_externo ORDER BY id DESC LIMIT 1;
-- estado debe ser 'pendiente'
-- referencia debe tener un número
```

### C. Simular Pago OXXO (Opcional)

Para simular que alguien pagó en OXXO, necesitas Stripe CLI:

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Simular webhook de pago exitoso
stripe trigger payment_intent.succeeded
```

Esto actualizará el pedido a "pagado" automáticamente.

## 5. Errores Comunes y Soluciones

### Error: "STRIPE_SECRET_KEY is not defined"

- Verifica que el archivo `.env` existe en `backFarmacia`
- Verifica que tiene la línea: `STRIPE_SECRET_KEY=sk_test_...`
- Reinicia el servidor

### Error: "Table 'pago_externo' doesn't exist"

- Ejecuta la migración SQL nuevamente
- Verifica que estés en la base de datos correcta: `USE farmacia_db;`

### Error: "Duplicate column name 'transaction_id'"

- La columna ya existe, ignora este error
- O ejecuta: `ALTER TABLE pedido DROP COLUMN transaction_id;` y vuelve a intentar

### Error en Frontend: "VITE_STRIPE_PUBLISHABLE_KEY"

- Verifica que el archivo `.env` existe en `frontFarmacia`
- Debe tener: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- Reinicia el servidor de desarrollo (Vite)

## 6. Próximos Pasos

Una vez que todo funcione:

1. ✅ Configurar webhooks para producción
2. ✅ Obtener claves de Stripe en modo Live
3. ✅ Actualizar `.env` con claves de producción
4. ✅ Habilitar HTTPS en el servidor
5. ✅ Monitorear transacciones en Stripe Dashboard

---

## Recursos

- **Stripe Dashboard:** https://dashboard.stripe.com/test/payments
- **Tarjetas de prueba:** https://stripe.com/docs/testing
- **Documentación Stripe:** https://stripe.com/docs/api
- **Webhook testing:** https://stripe.com/docs/webhooks/test
