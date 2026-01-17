const db = require('./DBconfig');

const UsuarioRepository = require('../repositories/usuarioRepository');
const ProductoRepository = require('../repositories/productoRepository');
const PedidoRepository = require('../repositories/pedidoRepository');
const PagoOxxoRepository = require('../repositories/pagoOxxoRepository');
const CategoriaRepository = require('../repositories/categoriaRepository');
const BlogRepository = require('../repositories/blogRepository');
const PromocionRepository = require('../repositories/promocionRepository');
const NewsletterRepository = require('../repositories/newsletterRepository');
const PasswordResetRepository = require('../repositories/passwordResetRepository');

const UsuarioService = require('../services/usuarioService');
const ProductoService = require('../services/ProductoService');
const PedidoService = require('../services/PedidoService');
const EmailService = require('../services/EmailService');
const OxxoService = require('../services/oxxoService');
const CategoriaService = require('../services/CategoriaService');
const BlogService = require('../services/BlogService');
const PromocionService = require('../services/promocionService');
const NewsletterService = require('../services/newsletterService');
const EstadisticaService = require('../services/estadisticaService');

const UsuarioController = require('../controllers/usuarioController');
const ProductoController = require('../controllers/productoController');
const PedidoController = require('../controllers/pedidoController');
const CategoriaController = require('../controllers/categoriaController');
const BlogController = require('../controllers/blogController');
const PromocionController = require('../controllers/promocionController');
const NewsletterController = require('../controllers/newsletterController');
const EstadisticaController = require('../controllers/estadisticaController');

const UsuarioRoutes = require('../routes/usuarioRoutes');
const ProductoRoutes = require('../routes/productoRoutes');
const PedidoRoutes = require('../routes/pedidoRoutes');
const CategoriaRoutes = require('../routes/categoriaRoutes');
const BlogRoutes = require('../routes/blogRoutes');
const PromocionRoutes = require('../routes/promocionRoutes');
const NewsletterRoutes = require('../routes/newsletterRoutes');
const EstadisticaRoutes = require('../routes/estadisticaRoutes');

const EstadisticaRepository = require('../repositories/estadisticaRepository');

class AppConfig {
    constructor() {
        // 1. Repositories
        this.usuarioRepo = new UsuarioRepository(db);
        this.productoRepo = new ProductoRepository(db);
        this.pedidoRepo = new PedidoRepository(db);
        this.pagoOxxoRepo = new PagoOxxoRepository(db);
        this.passwordResetRepo = new PasswordResetRepository(db);
        this.categoriaRepo = new CategoriaRepository(db);
        this.blogRepo = new BlogRepository(db);
        this.promocionRepo = new PromocionRepository(db);
        this.newsletterRepo = new NewsletterRepository(db);
        this.estadisticaRepo = new EstadisticaRepository(db);

        // 2. Services
        this.emailService = new EmailService();
        this.oxxoService = new OxxoService();

        this.usuarioService = new UsuarioService(this.usuarioRepo, this.emailService, this.passwordResetRepo);
        this.productoService = new ProductoService(this.productoRepo, this.categoriaRepo);
        this.pedidoService = new PedidoService(
            this.pedidoRepo,
            this.productoRepo,
            this.pagoOxxoRepo,
            this.emailService,
            this.oxxoService
        );
        this.categoriaService = new CategoriaService(this.categoriaRepo);
        this.blogService = new BlogService(this.blogRepo);
        this.promocionService = new PromocionService(this.promocionRepo, this.newsletterRepo, this.emailService);
        this.newsletterService = new NewsletterService(this.newsletterRepo, this.emailService);
        this.estadisticaService = new EstadisticaService(this.estadisticaRepo);

        // 3. Controllers
        this.usuarioController = new UsuarioController(this.usuarioService);
        this.productoController = new ProductoController(this.productoService);
        this.pedidoController = new PedidoController(this.pedidoService);
        this.categoriaController = new CategoriaController(this.categoriaService);
        this.blogController = new BlogController(this.blogService);
        this.promocionController = new PromocionController(this.promocionService);
        this.newsletterController = new NewsletterController(this.newsletterService);
        this.estadisticaController = new EstadisticaController(this.estadisticaService);

        // 4. Routes
        this.usuarioRoutes = new UsuarioRoutes(this.usuarioController);
        this.productoRoutes = new ProductoRoutes(this.productoController);
        this.pedidoRoutes = new PedidoRoutes(this.pedidoController);
        this.categoriaRoutes = new CategoriaRoutes(this.categoriaController);
        this.blogRoutes = new BlogRoutes(this.blogController);
        this.promocionRoutes = new PromocionRoutes(this.promocionController);
        this.newsletterRoutes = new NewsletterRoutes(this.newsletterController);
        this.estadisticaRoutes = new EstadisticaRoutes(this.estadisticaController);
    }

    getRoutes() {
        return {
            usuarios: this.usuarioRoutes.getRouter(),
            productos: this.productoRoutes.getRouter(),
            pedidos: this.pedidoRoutes.getRouter(),
            blogs: this.blogRoutes.getRouter(),
            categorias: this.categoriaRoutes.getRouter(),
            promociones: this.promocionRoutes.getRouter(),
            newsletter: this.newsletterRoutes.getRouter(),
            estadisticas: this.estadisticaRoutes.getRouter()
        };
    }
}

module.exports = new AppConfig();