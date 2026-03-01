# 💊 Farmacia Plus Web

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Pagos-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Solución integral para la gestión de farmacias. Incluye catálogo de productos, carrito de compras, pagos en línea con Stripe (tarjeta y OXXO), control de inventario, gestión de pedidos y repartos, blog, y un panel administrativo completo con múltiples roles de usuario.

---

## 🚀 Características

- 🛒 **Catálogo y carrito** de productos con checkout integrado
- 💳 **Pagos en línea** con Stripe — tarjeta bancaria y OXXO Pay
- 👥 **Tres roles de usuario**: Administrador, Empleado y Cliente
- 📦 **Control de inventario** con registro y seguimiento de productos
- 🚚 **Gestión de pedidos y repartos** con ruta de repartidor
- 🏷️ **Promociones y ofertas** con seguimiento en tiempo real
- 📝 **Blog** administrable desde el panel de admin
- 🔐 **Autenticación** con Firebase Auth + JWT
- 📊 **Historial de ventas y pagos** por rol
- 📄 **Páginas legales**: términos, privacidad, devoluciones, envíos

---

## 🏗️ Arquitectura

```
Cliente (React + Vite)
        │
        │ HTTP / REST API
        ▼
  Backend (Express)          → Autenticación JWT + Firebase
        │
        ▼
     MySQL                   → Base de datos principal
        │
  Stripe API                 → Procesamiento de pagos
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Uso |
|---|---|---|
| **Frontend** | React 18 + Vite | UI declarativa con componentes por rol |
| **Backend** | Node.js + Express | API REST en puerto `3000` |
| **Base de datos** | MySQL 8 | Inventario, pedidos, usuarios, pagos |
| **Autenticación** | Firebase Auth + JWT | Login, registro, reset de contraseña |
| **Pagos** | Stripe | Tarjeta bancaria y OXXO Pay |
| **Lenguaje** | JavaScript ES6+ | Frontend y Backend |

---

## 👥 Roles de Usuario

### 🔴 Administrador
- Dashboard general
- Registro y gestión de productos e inventario
- Control de usuarios (clientes y empleados)
- Gestión de pedidos y repartos
- Creación de promociones
- Historial de ventas y pagos
- Administración del blog

### 🟡 Empleado
- Venta en tienda física y en línea
- Gestión de pedidos asignados
- Ruta de repartidor
- Inventario (consulta)
- Historial de ventas
- Gestión de envíos y clientes

### 🟢 Cliente
- Catálogo de productos y ofertas
- Carrito de compras
- Checkout con pago en línea
- Historial de pedidos
- Seguimiento de promociones
- Perfil personal

---

## 📁 Estructura del Proyecto

```
FarmaciaPlusWeb/
├── backFarmacia/               # API REST con Express
│   ├── routes/                 # Endpoints por módulo
│   ├── controllers/            # Lógica de negocio
│   ├── middlewares/            # Auth JWT, validaciones
│   ├── config/                 # Conexión MySQL, Firebase
│   └── .env                   # Variables de entorno
│
├── frontFarmacia/              # App React + Vite
│   └── src/
│       ├── pages/
│       │   ├── admin/          # Dashboard, inventario, pedidos...
│       │   ├── empleado/       # Ventas, envíos, reportes...
│       │   ├── cliente/        # Catálogo, carrito, historial...
│       │   └── Legal/          # Términos, privacidad, envíos...
│       ├── components/
│       │   ├── admin/          # Layout y sidebar admin
│       │   ├── empleado/       # Layout staff
│       │   ├── cliente/        # Layout cliente
│       │   ├── payment/        # Stripe: tarjeta, OXXO, éxito
│       │   └── common/         # Loading, rutas protegidas
│       ├── context/
│       │   └── CartContext.jsx # Estado global del carrito
│       ├── services/
│       │   └── api.js          # Cliente Axios + interceptor JWT
│       └── firebase.js         # Configuración Firebase
│
├── GUIA_RAPIDA_PAGOS.md        # Guía de integración Stripe
└── labkeepSQL.sql              # Schema de base de datos
```

---

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Williams-Espinosa/FarmaciaPlusWeb.git
cd FarmaciaPlusWeb
```

### 2. Configurar el Backend

```bash
cd backFarmacia
npm install
```

Crea el archivo `.env`:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=farmacia_db
DB_USER=tu_usuario
DB_PASS=tu_contraseña

# JWT
JWT_SECRET=tu_secreto_jwt

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# Firebase Admin (opcional)
FIREBASE_PROJECT_ID=...
```

### 3. Configurar el Frontend

```bash
cd frontFarmacia
npm install
```

Crea el archivo `.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

### 4. Crear la base de datos

```bash
mysql -u root -p farmacia_db < labkeepSQL.sql
```

Para habilitar pagos con Stripe, ejecuta también la migración:

```bash
mysql -u root -p farmacia_db < stripe.sql
```

> Ver `GUIA_RAPIDA_PAGOS.md` para instrucciones detalladas de la integración con Stripe.

### 5. Ejecutar

```bash
# Backend (puerto 3000)
cd backFarmacia
npm run dev

# Frontend (puerto 5173)
cd frontFarmacia
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 💳 Pagos con Stripe

La app integra Stripe en modo test. Puedes probar pagos sin costo real.

### Tarjeta bancaria
```
Número:  4242 4242 4242 4242
Fecha:   cualquier fecha futura (ej. 12/25)
CVC:     cualquier 3 dígitos
Nombre:  Test User
```

### OXXO Pay
Selecciona OXXO en el checkout. Se generará una ficha con número de referencia, código de barras y fecha de expiración lista para imprimir.

> Para configurar webhooks, claves en producción y simular pagos OXXO, consulta `GUIA_RAPIDA_PAGOS.md`.

---

## 🗄️ Base de Datos

```sql
usuario          → clientes, empleados y admins con roles
producto         → inventario con categorías y precios
pedido           → órdenes con estado y método de pago
detalle_pedido   → productos por pedido
pago_externo     → pagos OXXO con referencia Stripe
pago_tarjeta     → pagos con tarjeta, últimos 4 dígitos, marca
promocion        → descuentos y ofertas activas
reparto          → asignación de pedidos a repartidores
blog             → posts administrables
```

---

## 🔎 About

**Farmacia Plus Web** es una plataforma de comercio electrónico especializada para farmacias, con gestión interna completa. Diseñada para operar tanto en tienda física como en línea, con soporte para múltiples métodos de pago y roles diferenciados por tipo de usuario.

### 📦 Versión

| Componente | Versión |
|---|---|
| **Frontend** | 1.0.2 |
| **Backend** | 1.0.2 |

### 🧰 Tecnologías

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 18 · Vite · Firebase Auth |
| **Backend** | Node.js · Express · MySQL · JWT |
| **Pagos** | Stripe (tarjeta + OXXO Pay) |

---

## 📄 Licencia

![Licencia: Privada](https://img.shields.io/badge/Licencia-No_Comercial-red?style=for-the-badge)

Todo el contenido de este repositorio, incluyendo el código fuente y diseño, está protegido por las leyes de propiedad intelectual.

- ✅ **Permitido:** Consulta, aprendizaje y exhibición personal.
- ❌ **Prohibido:** Copia parcial o total para uso comercial, reventa del software.

---

> 💻 *"Crea el presente, codifica el futuro."*
> © 2026 **Williams-Espinosa** — Todos los derechos reservados.
