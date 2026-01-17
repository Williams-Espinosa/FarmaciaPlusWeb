const express = require('express');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

class PromocionRoutes {
    constructor(promocionController) {
        this.router = express.Router();
        this.promocionController = promocionController;
        this.initRoutes();
    }

    initRoutes() {
        // GET /api/promociones - Obtener todas las promociones
        this.router.get('/', this.promocionController.obtenerTodas.bind(this.promocionController));
        
        // GET /api/promociones/activas - Obtener solo promociones activas
        this.router.get('/activas', this.promocionController.obtenerActivas.bind(this.promocionController));
        
        // GET /api/promociones/:id - Obtener una promoción por ID
        this.router.get('/:id', this.promocionController.obtenerPorId.bind(this.promocionController));
        
        // POST /api/promociones - Crear una nueva promoción
        this.router.post('/', upload.single('imagen'), this.promocionController.crear.bind(this.promocionController));
        
        // PUT /api/promociones/:id - Actualizar una promoción
        this.router.put('/:id', upload.single('imagen'), this.promocionController.actualizar.bind(this.promocionController));
        
        // DELETE /api/promociones/:id - Eliminar una promoción
        this.router.delete('/:id', this.promocionController.eliminar.bind(this.promocionController));
        
        // POST /api/promociones/:id/notificar - Notificar a suscriptores sobre esta promoción
        this.router.post('/:id/notificar', this.promocionController.notificarSuscriptores.bind(this.promocionController));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = PromocionRoutes;
