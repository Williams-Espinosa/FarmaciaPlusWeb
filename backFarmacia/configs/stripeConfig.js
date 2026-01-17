const Stripe = require('stripe');
require('dotenv').config();

// Inicializar Stripe con la clave secreta del .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
