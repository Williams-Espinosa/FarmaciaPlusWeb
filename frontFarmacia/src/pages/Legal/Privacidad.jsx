import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const Privacidad = () => {
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
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Política de Privacidad</h1>
              <p className="text-blue-100 mt-1">Protegemos tu información personal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="mb-6 leading-relaxed text-gray-700">
            En <strong className="text-blue-600">FarmaPlus</strong>, nos comprometemos a proteger la privacidad de nuestros usuarios. Esta política detalla cómo tratamos su información personal de acuerdo con el Reglamento General de Protección de Datos (RGPD).
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">1. Responsable del Tratamiento</h2>
            <p className="text-gray-700">
              El responsable del tratamiento de sus datos es FarmaPlus, con domicilio social en Av. Principal #123, Col. Centro. Puede contactar con nuestro delegado de protección de datos en contacto@farmaplus.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">2. Datos Recopilados</h2>
            <ul className="list-none space-y-3">
              {['Datos de identificación (Nombre, apellidos).', 'Información de contacto (Email, teléfono, dirección de envío).', 'Datos de facturación y pago.', 'Información técnica (Dirección IP, cookies).'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">3. Finalidad del Tratamiento</h2>
            <p className="mb-4 text-gray-700">Sus datos serán utilizados para:</p>
            <ul className="list-none space-y-3">
              {['Gestionar sus pedidos y envíos de productos farmacéuticos.', 'Atender sus consultas y soporte al cliente.', 'Cumplir con las obligaciones legales aplicables al sector sanitario.', 'Enviar comunicaciones comerciales (solo si ha otorgado su consentimiento expreso).'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">4. Sus Derechos</h2>
            <p className="text-gray-700">
              Usted tiene derecho a acceder, rectificar, suprimir, limitar u oponerse al tratamiento de sus datos, así como a la portabilidad de los mismos. Para ejercer estos derechos, envíe una comunicación escrita a contacto@farmaplus.com adjuntando copia de su identificación.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">5. Conservación de Datos</h2>
            <p className="text-gray-700">
              Mantendremos sus datos personales únicamente durante el tiempo necesario para las finalidades para las que fueron recogidos o mientras existan obligaciones legales que lo requieran.
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

export default Privacidad;
