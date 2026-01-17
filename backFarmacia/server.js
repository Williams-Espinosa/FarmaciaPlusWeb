const express = require('express');
const cors = require('cors');
const appConfig = require('./configs/appConfig');
const { AuthMiddleware } = require('./configs/authMiddleware');

const app = express();

app.use(cors());

// IMPORTANTE: Para webhooks de Stripe, necesitamos el body RAW
// Esto debe ir ANTES de express.json()
app.use('/api/pagos/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use('/uploads', express.static('uploads')); 

// Obtener las rutas ya configuradas
const routes = appConfig.getRoutes();

// Registrar las rutas en la app
app.use('/api/usuarios', routes.usuarios);
app.use('/api/productos', routes.productos);
app.use('/api/pedidos', routes.pedidos);
app.use('/api/categorias', routes.categorias);
app.use('/api/promociones', routes.promociones);
app.use('/api/newsletter', routes.newsletter);
app.use('/api/blogs', routes.blogs);
app.use('/api/estadisticas', routes.estadisticas);

// Rutas de pagos con Stripe
const pagoRoutes = require('./routes/pagoRoutes');
app.use('/api/pagos', pagoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Farmacia corriendo en el puerto ${PORT}`);
});