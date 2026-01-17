const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

// Configurar el storage de Cloudinary para Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Determinar la carpeta según el tipo de archivo
        let folder = 'farmacia/general';
        
        if (req.baseUrl.includes('/productos')) {
            folder = 'farmacia/productos';
        } else if (req.baseUrl.includes('/promociones')) {
            folder = 'farmacia/promociones';
        } else if (req.baseUrl.includes('/blog')) {
            folder = 'farmacia/blog';
        } else if (req.baseUrl.includes('/pedidos')) {
            folder = 'farmacia/recetas';
        }

        return {
            folder: folder,
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        };
    }
});

const upload = multer({ storage: storage });

module.exports = upload;