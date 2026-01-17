import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';

const Uso = () => {
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
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Términos de Uso</h1>
              <p className="text-blue-100 mt-1">Condiciones para el uso de nuestra plataforma</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">1. Aceptación de los Términos</h2>
            <p className="text-gray-700">
              Al acceder y utilizar este sitio web de <strong className="text-blue-600">FarmaPlus</strong>, usted acepta estar sujeto a los siguientes términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos que no utilice nuestros servicios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">2. Uso de la Plataforma</h2>
            <p className="mb-4 text-gray-700">
              Este sitio está destinado a la consulta de productos farmacéuticos y servicios relacionados. El usuario se compromete a:
            </p>
            <ul className="list-none space-y-3">
              {['Proporcionar información veraz y exacta en caso de registro.', 'No utilizar el sitio para fines ilícitos o fraudulentos.', 'Respetar la integridad técnica del sitio web.'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">3. Información sobre Productos</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-gray-700">
                La información proporcionada sobre medicamentos y productos de salud es meramente informativa y <strong>no sustituye</strong> el consejo, diagnóstico o tratamiento de un profesional médico. Siempre consulte a su médico o farmacéutico antes de iniciar cualquier tratamiento.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">4. Propiedad Intelectual</h2>
            <p className="text-gray-700">
              Todo el contenido disponible en este sitio, incluyendo textos, gráficos, logotipos e imágenes, es propiedad exclusiva de FarmaPlus o de sus proveedores de contenido y está protegido por las leyes internacionales de derechos de autor.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">5. Limitación de Responsabilidad</h2>
            <p className="text-gray-700">
              FarmaPlus no se hace responsable de los daños derivados del uso indebido de la información contenida en este sitio, ni de posibles interrupciones en el servicio por causas ajenas a nuestra voluntad.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold text-blue-600 mb-4 pb-2 border-b border-blue-100">6. Modificaciones</h2>
            <p className="text-gray-700">
              Nos reservamos el derecho de actualizar o modificar estos términos en cualquier momento sin previo aviso. El uso continuado del sitio tras dichos cambios constituye la aceptación de los nuevos términos.
            </p>
          </section>

          <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Última actualización: {new Date().toLocaleDateString()}</p>
            <p className="mt-2">Si tiene dudas sobre estos términos, por favor contáctenos a través de nuestros canales oficiales.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Uso;
