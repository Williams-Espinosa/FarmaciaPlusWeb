import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const Devoluciones = () => {
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
              <RotateCcw className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Política de Devoluciones</h1>
              <p className="text-blue-100 mt-1">Derecho de desistimiento y devoluciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">1. Derecho de Desistimiento</h2>
            <p className="text-gray-700">
              Conforme a la legislación vigente, usted tiene derecho a desistir de la compra en un plazo de <strong className="text-blue-600">14 días naturales</strong> sin necesidad de justificación, salvo en las excepciones previstas por la ley.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">2. Excepciones Legales</h2>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-4">
              <p className="text-orange-800 font-medium mb-2">⚠️ Importante</p>
              <p className="text-gray-700">El derecho de desistimiento no será aplicable en los siguientes casos:</p>
            </div>
            <ul className="list-none space-y-4">
              <li className="bg-gray-50 p-4 rounded-lg">
                <strong className="text-gray-900">Medicamentos:</strong>
                <p className="text-gray-700 mt-1">Por razones de seguridad y salud pública, no se admiten devoluciones de medicamentos una vez entregados, salvo error en el envío o daños en el transporte.</p>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg">
                <strong className="text-gray-900">Productos de Higiene y Salud:</strong>
                <p className="text-gray-700 mt-1">Bienes precintados que no sean aptos para ser devueltos por razones de protección de la salud o de higiene y que hayan sido desprecintados tras la entrega.</p>
              </li>
              <li className="bg-gray-50 p-4 rounded-lg">
                <strong className="text-gray-900">Bienes Perecederos:</strong>
                <p className="text-gray-700 mt-1">Productos que puedan deteriorarse o caducar con rapidez.</p>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">3. Procedimiento de Devolución</h2>
            <p className="mb-4 text-gray-700">Para iniciar un proceso de devolución, el cliente deberá:</p>
            <ol className="list-none space-y-3">
              {[
                'Notificar su decisión vía email a contacto@farmaplus.com indicando el número de pedido.',
                'El producto debe ser devuelto en su embalaje original, precintado y en perfectas condiciones.',
                'En caso de producto defectuoso, la farmacia asumirá los costes de recogida. En caso de desistimiento voluntario, los costes de envío correrán a cargo del cliente.'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">4. Reembolso</h2>
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <p className="text-gray-700">
                Una vez recibida y verificada la mercancía en nuestras instalaciones, procederemos al reembolso del importe íntegro mediante el mismo método de pago utilizado en la compra, en un plazo máximo de <strong className="text-green-700">14 días naturales</strong>.
              </p>
            </div>
          </section>

          <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Esta política se rige por la legislación vigente en materia de protección al consumidor.</p>
            <p className="mt-2">Última actualización: {new Date().toLocaleDateString()}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Devoluciones;
