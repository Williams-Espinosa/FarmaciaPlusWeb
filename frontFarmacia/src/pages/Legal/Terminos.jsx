import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Terminos = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center text-blue-100 hover:text-white mb-6 transition">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
              <p className="text-blue-100 mt-1">Condiciones de uso de nuestros servicios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">1. Información General</h2>
            <p className="text-gray-700">
              Bienvenido a <strong className="text-blue-600">FarmaPlus</strong>. Al acceder y utilizar este sitio web, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestro sitio web.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">2. Uso del Sitio</h2>
            <p className="text-gray-700">
              El contenido de las páginas de este sitio web es para su información general y uso exclusivo. Está sujeto a cambios sin previo aviso. El uso de cualquier información o material en este sitio web es bajo su propio riesgo, por lo cual no nos hacemos responsables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">3. Propiedad Intelectual</h2>
            <p className="text-gray-700">
              Este sitio web contiene material que es propiedad nuestra o tiene licencia para nosotros. Este material incluye, pero no se limita a, el diseño, la disposición, el aspecto, la apariencia y los gráficos. La reproducción está prohibida salvo de conformidad con el aviso de copyright.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">4. Compra de Productos</h2>
            <p className="text-gray-700">
              La disponibilidad de los productos está sujeta a cambios. Nos reservamos el derecho de limitar las cantidades de cualquier producto o servicio que ofrecemos. Todas las descripciones de productos o precios de productos están sujetos a cambios en cualquier momento sin previo aviso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">5. Privacidad</h2>
            <p className="text-gray-700">
              Su uso de este sitio web también está regido por nuestra <Link to="/legal/privacidad" className="text-blue-600 hover:underline font-medium">Política de Privacidad</Link>, que se incorpora a estos términos por referencia.
            </p>
          </section>

          <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            Última actualización: {new Date().toLocaleDateString()}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Terminos;
