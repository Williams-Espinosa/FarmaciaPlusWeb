CREATE DATABASE farmacia_db;
USE farmacia_db;

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    rol ENUM('admin', 'empleado', 'cliente') DEFAULT 'cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías para productos
CREATE TABLE IF NOT EXISTS categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    codigo_barras VARCHAR(50) UNIQUE,
    requiere_receta BOOLEAN DEFAULT FALSE,
    imagen_url VARCHAR(255),
    categoria_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE SET NULL
);

-- Índice para buscar por código de barras
CREATE INDEX IF NOT EXISTS idx_codigo_barras ON producto(codigo_barras);

-- Ejemplos de categorías
INSERT INTO categoria (nombre, descripcion) VALUES
('Analgésicos', 'Medicamentos para aliviar el dolor'),
('Antibióticos', 'Medicamentos antibacterianos'),
('Vitaminas', 'Suplementos vitamínicos'),
('Higiene', 'Productos de higiene personal'),
('Equipos Médicos', 'Equipos y material médico');

-- Ejemplo de producto asignado a categoría (categoria_id = 1)
INSERT INTO producto (nombre, descripcion, precio, stock, codigo_barras, requiere_receta, categoria_id) 
VALUES ('Paracetamol 500mg', 'Caja con 20 tabletas', 45.50, 100, '7501234567890', FALSE, 1);

CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('efectivo', 'oxxo') NOT NULL,
    estado_pago ENUM('pendiente', 'pagado', 'cancelado') DEFAULT 'pendiente',
    estado_envio ENUM('en_tienda', 'en_transito', 'entregado') DEFAULT 'en_tienda',
    receta_path VARCHAR(255),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE detalle_pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);

CREATE TABLE pago_oxxo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    referencia VARCHAR(20) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    expiracion DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

CREATE INDEX idx_codigo_barras ON productos(codigo_barras);


INSERT INTO usuario (nombre, email, password, rol) 
VALUES ('Admin Principal', 'admin@farmacia.com', 'password_hash_aqui', 'admin');

INSERT INTO usuario (nombre, email, password, rol) 
VALUES ('Vendedor 1', 'vendedor@farmacia.com', 'password_hash_aqui', 'empleado');

INSERT INTO producto (nombre, descripcion, precio, stock, codigo_barras, requiere_receta) 
VALUES ('Paracetamol 500mg', 'Caja con 20 tabletas', 45.50, 100, '7501234567890', FALSE);

-- Tabla para blog de salud (posts públicos, mostrados en la página principal)
CREATE TABLE blog_post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen_url VARCHAR(255),
    destacado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplos
INSERT INTO blog_post (titulo, descripcion, imagen_url, destacado) VALUES
('Hábitos para un buen sueño', 'Pequeños consejos para mejorar la calidad del sueño.', NULL, TRUE),
('Alimentación balanceada', 'Qué incluir en tu dieta diaria para sentirte mejor', NULL, FALSE);

-- Tabla para tokens de restablecimiento de contraseña
CREATE TABLE IF NOT EXISTS password_reset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    expiracion DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabla de promociones
CREATE TABLE IF NOT EXISTS promocion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('porcentaje', '2x1', 'combo', 'precio_fijo') DEFAULT 'porcentaje',
    descuento DECIMAL(5,2) DEFAULT 0,
    producto_id INT,
    categoria_id INT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    notificado BOOLEAN DEFAULT FALSE,
    imagen_url VARCHAR(255),
    codigo_descuento VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE SET NULL,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE SET NULL
);

-- Tabla de suscriptores al newsletter
CREATE TABLE IF NOT EXISTS suscriptor_newsletter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    nombre VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejemplos de suscriptores
INSERT INTO suscriptor_newsletter (email, nombre) VALUES
('cliente1@email.com', 'Juan Pérez'),
('cliente2@email.com', 'María García');
