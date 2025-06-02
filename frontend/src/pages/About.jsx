import { Link } from "react-router-dom";
import { Users, MapPin, Calendar, Heart, Shield, Lightbulb, Mail, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        {/* Nuestra Misión con imagen */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <h2 className="text-3xl font-bold text-sky-900 mb-6">Nuestra Misión</h2>
              <p className="text-lg text-gray-600 mb-6">
                En JoinUp creemos que las mejores experiencias se viven en compañía. Nuestra plataforma 
                facilita la creación y descubrimiento de planes sociales, fomentando conexiones auténticas 
                entre personas con intereses similares.
              </p>
              <p className="text-gray-600 mb-6">
                Queremos romper las barreras que impiden que las personas se conecten, creando un espacio 
                seguro y acogedor donde cada encuentro sea una oportunidad de crecimiento personal y 
                diversión compartida.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition"
              >
                Descubre Eventos
                <Users className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Imagen vertical */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src="/img/happy-people.webp"
                  alt="Personas felices conectando en JoinUp"
                  className="rounded-2xl shadow-xl max-w-sm w-full h-auto object-cover"
                />
                {/* Overlay decorativo */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Características */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">¿Qué hace especial a JoinUp?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fácil de usar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Simple e Intuitivo</h3>
              <p className="text-gray-600">
                Crear y unirse a planes nunca ha sido tan fácil. Una interfaz clara y sin complicaciones 
                para que te centres en lo importante: disfrutar.
              </p>
            </div>

            {/* Comunidad */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comunidad Activa</h3>
              <p className="text-gray-600">
                Conecta con personas que comparten tus intereses. Desde tapeo hasta senderismo, 
                siempre hay alguien con quien compartir la experiencia.
              </p>
            </div>

            {/* Geolocalización */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Eventos Cercanos</h3>
              <p className="text-gray-600">
                Descubre planes cerca de ti o explora nuevas zonas. Nuestro sistema de geolocalización 
                te ayuda a encontrar la actividad perfecta.
              </p>
            </div>

            </div>

  
        </section>

        {/* Cómo Funciona */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-sky-900 text-center mb-12">¿Cómo Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Regístrate</h3>
              <p className="text-gray-600">
                Crea tu cuenta en segundos y personaliza tu perfil para que otros puedan conocerte mejor.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Explora o Crea</h3>
              <p className="text-gray-600">
                Busca planes que te interesen o crea tu propio evento y compártelo con la comunidad.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">¡Disfruta!</h3>
              <p className="text-gray-600">
                Únete a los planes que te gusten y conoce personas increíbles mientras vives nuevas experiencias.
              </p>
            </div>
          </div>
        </section>


        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-3xl font-bold text-sky-900 mb-4">
              ¿Listo para Unirte a la Comunidad?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Miles de personas ya están creando conexiones reales y viviendo experiencias 
              inolvidables. ¡Es tu turno de formar parte de algo especial!
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition"
              >
                Crear Cuenta Gratuita
              </Link>
              <Link
                to="/events"
                className="bg-white hover:bg-gray-50 text-sky-700 font-semibold px-8 py-4 rounded-xl shadow-lg border border-sky-200 transition"
              >
                Explorar Eventos
              </Link>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-sky-900 mb-6">¿Tienes Preguntas?</h2>
          <p className="text-gray-600 mb-6">
            Estamos aquí para ayudarte. No dudes en contactarnos si necesitas soporte o tienes alguna sugerencia.
          </p>
          <div className="flex items-center justify-center gap-2 text-sky-600">
            <Mail className="w-5 h-5" />
            <a 
              href="mailto:info@joinup.com" 
              className="hover:text-sky-800 transition-colors font-medium"
            >
              info@joinup.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;