import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck } from 'lucide-react';

const Envio = () => {
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
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Política de Envío y Entrega</h1>
              <p className="text-blue-100 mt-1">Información sobre nuestros métodos de envío</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">1. Procesamiento de Pedidos</h2>
            <p className="text-gray-700">
              Todos los pedidos recibidos de lunes a viernes antes de las 14:00h se procesarán el mismo día. 
              Los pedidos realizados durante el fin de semana o días festivos se gestionarán el siguiente día hábil.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">2. Métodos y Costes de Envío</h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white rounded-lg overflow-hidden border border-gray-200">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Método</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Plazo Estimado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Coste</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Estándar</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">48-72 horas</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700">$50 MXN</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Gratis {'>'} $500</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Urgente 24h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">24 horas</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700">$100 MXN</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">Express</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">2-4 horas</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-700">$150 MXN</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">3. Seguimiento del Envío</h2>
            <p className="text-gray-700">
              Una vez que su pedido salga de nuestro almacén, recibirá un correo electrónico de confirmación con un número de seguimiento 
              y un enlace para que pueda conocer la ubicación de su paquete en todo momento.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">4. Productos Sensibles</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-gray-700">
                Los productos que requieran conservación en frío se enviarán mediante un servicio de transporte refrigerado especializado 
                para garantizar que la cadena de frío no se rompa en ningún momento, asegurando la eficacia del medicamento.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">5. Incidencias y Reclamaciones</h2>
            <p className="text-gray-700">
              Si el paquete presenta daños visibles en el momento de la entrega, le rogamos que lo haga constar en el albarán del transportista. 
              Para cualquier otra incidencia, dispone de 24 horas para contactar con nuestro servicio de atención al cliente.
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

export default Envio;
