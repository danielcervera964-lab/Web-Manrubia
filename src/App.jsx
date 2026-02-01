import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function WebManrubia() {
  const [telefono, setTelefono] = useState('');
  const [resultado, setResultado] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [visible, setVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(v => ({ ...v, [entry.target.id]: true }));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const limpiarTelefono = (tel) => {
    let limpio = tel.replace(/[\s\-\+\(\)]/g, '');
    if (limpio.startsWith('34') && limpio.length > 9) {
      limpio = limpio.substring(2);
    }
    return limpio;
  };

  const buscarBici = async () => {
    if (!telefono) return;
    setBuscando(true);
    setResultado(null);

    const telefonoLimpio = limpiarTelefono(telefono);

    const { data, error } = await supabase
      .from('bicis')
      .select('*')
      .ilike('telefono', `%${telefonoLimpio}%`)
      .order('fecha', { ascending: false });

    if (error) {
      setResultado({ encontrada: false });
    } else if (data && data.length > 0) {
      const bici = data[0];
      setResultado({
        encontrada: true,
        estado: bici.estado,
        trabajo: bici.trabajo,
        precio: bici.precio
      });
    } else {
      setResultado({ encontrada: false });
    }

    setBuscando(false);
  };

  const servicios = [
    { nombre: 'Reparación General', desc: 'Diagnóstico completo y reparación de cualquier avería mecánica o electrónica de tu bicicleta.' },
    { nombre: 'Puesta a Punto', desc: 'Ajuste integral de todos los componentes para un rendimiento óptimo en cada salida.' },
    { nombre: 'Revisión Completa', desc: 'Inspección exhaustiva de frenos, transmisión, dirección y rodamientos.' },
    { nombre: 'Cambio de Cubiertas', desc: 'Montaje y equilibrado de neumáticos con las mejores marcas del mercado.' },
    { nombre: 'Sistema de Frenado', desc: 'Ajuste, sangrado y sustitución de pastillas y discos de freno.' },
    { nombre: 'Transmisión', desc: 'Ajuste de cambios, sustitución de cadena, cassette y platos.' },
    { nombre: 'Centrado de Ruedas', desc: 'Tensado y alineación profesional de radios para un rodaje perfecto.' },
    { nombre: 'Suspensiones', desc: 'Mantenimiento preventivo y reparación de horquillas y amortiguadores.' },
    { nombre: 'E-Bikes', desc: 'Diagnóstico electrónico, actualización de software y reparación de motores.' },
    { nombre: 'Montaje Personalizado', desc: 'Ensamblaje completo de bicicletas a medida según tus especificaciones.' },
    { nombre: 'Servicio Specialized', desc: 'Centro técnico oficial con acceso a piezas originales y garantía de marca.' },
    { nombre: 'Biomecánica', desc: 'Estudio de posición y ajuste ergonómico para máximo confort y rendimiento.' }
  ];

  const marcas = ['Mondraker', 'Specialized', 'S-Works', 'RockShox', 'Maxxis', 'Motul', 'Nutrinovex', 'Oakley'];

  const Logo = ({ size = 'normal', light = false }) => (
    <div className={`relative ${size === 'large' ? 'w-24 h-24' : size === 'hero' ? 'w-40 h-40' : 'w-12 h-12'}`}>
      <div className={`absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 ${size === 'hero' ? 'rounded-3xl' : 'rounded-xl'} shadow-lg transform rotate-3`}></div>
      <div className={`absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 ${size === 'hero' ? 'rounded-3xl' : 'rounded-xl'} shadow-xl flex items-center justify-center`}>
        <span className={`font-black text-white ${size === 'hero' ? 'text-7xl' : size === 'large' ? 'text-5xl' : 'text-2xl'}`} style={{ fontFamily: 'system-ui', letterSpacing: '-0.05em' }}>M</span>
        <div className={`absolute ${size === 'hero' ? 'bottom-3 right-3 w-4 h-4' : 'bottom-1 right-1 w-2 h-2'} bg-white rounded-full opacity-80`}></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('hero')}>
              <Logo />
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900 leading-tight">Bicicletas Manrubia</p>
                <p className="text-xs text-orange-500 font-medium">Servicio Oficial Specialized</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <button onClick={() => scrollTo('consulta')} className="hover:text-orange-500 transition-colors">Estado Bici</button>
              <button onClick={() => scrollTo('servicios')} className="hover:text-orange-500 transition-colors">Servicios</button>
              <button onClick={() => scrollTo('nosotros')} className="hover:text-orange-500 transition-colors">Nosotros</button>
              <button onClick={() => scrollTo('contacto')} className="hover:text-orange-500 transition-colors">Contacto</button>
            </div>
            <a href="tel:964667035" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all">964 667 035</a>
          </div>
        </div>
      </nav>

      <header id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-orange-500/10 to-transparent"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-6 py-32">
          <div className="flex justify-center mb-8"><Logo size="hero" /></div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">BICICLETAS<span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">MANRUBIA</span></h1>
          <p className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-300 mb-12 italic">"Entra andando, <span className="text-orange-400 font-medium">sal pedaleando</span>"</p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full"><p className="text-white font-semibold">Servicio Oficial Specialized</p></div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-full"><p className="text-white font-semibold">+20 años de experiencia</p></div>
            <div className="bg-orange-500/20 backdrop-blur-sm border border-orange-500/40 px-6 py-3 rounded-full"><p className="text-orange-400 font-semibold">Punto Vinted</p></div>
            <a href="https://www.instagram.com/bicicletasmanrubia" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/40 px-6 py-3 rounded-full hover:from-purple-500/40 hover:to-pink-500/40 transition-all"><p className="text-purple-300 font-semibold">@bicicletasmanrubia</p></a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={() => scrollTo('consulta')} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/40 transition-all hover:-translate-y-1">Consultar estado de mi bici</button>
            <button onClick={() => scrollTo('servicios')} className="border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">Ver servicios</button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-white/60">
            <div><p className="text-sm">Teléfono</p><p className="text-white font-bold text-lg">964 667 035</p></div>
            <div className="hidden sm:block w-px h-12 bg-white/20"></div>
            <div><p className="text-sm">Horario L-V</p><p className="text-white font-bold text-lg">10-14 / 17-20</p></div>
            <div className="hidden sm:block w-px h-12 bg-white/20"></div>
            <div><p className="text-sm">Sábados</p><p className="text-white font-bold text-lg">11-13</p></div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2"><div className="w-1.5 h-3 bg-white/50 rounded-full"></div></div>
        </div>
      </header>

      <section id="wallapop" className="py-16 px-6 bg-gradient-to-r from-teal-600 to-teal-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white text-center lg:text-left">
              <p className="text-teal-200 font-semibold mb-2 uppercase tracking-wider">Ofertas exclusivas</p>
              <h2 className="text-3xl sm:text-4xl font-black mb-3">Bicicletas de Segunda Mano</h2>
              <p className="text-teal-100 text-lg max-w-lg">Todas nuestras bicis de ocasión pasan por el taller. Revisadas, garantizadas y a precios increíbles.</p>
            </div>
            <a href="https://www.wallapop.com/user/gabrielm-419024603" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 bg-white text-teal-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-black/20 transition-all hover:-translate-y-1">Ver ofertas en Wallapop</a>
          </div>
        </div>
      </section>

      <section id="consulta" className={`py-24 px-6 bg-gray-50 transition-all duration-700 ${visible.consulta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">Seguimiento en tiempo real</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Está tu bicicleta lista?</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Introduce tu número de teléfono y consulta el estado de tu reparación al instante</p>
          </div>
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl">
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input type="tel" placeholder="Tu número de teléfono" className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              <button onClick={buscarBici} disabled={!telefono || buscando} className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">{buscando ? 'Buscando...' : 'Consultar'}</button>
            </div>
            {resultado && (
              <div className={`mt-8 p-6 rounded-2xl max-w-xl mx-auto ${resultado.encontrada ? (resultado.estado === 'curso' ? 'bg-amber-50 border-2 border-amber-200' : 'bg-green-50 border-2 border-green-200') : 'bg-gray-50 border-2 border-gray-200'}`}>
                {!resultado.encontrada ? (
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0"><span className="text-2xl">🔍</span></div>
                    <div><p className="font-bold text-gray-800 text-lg">No encontramos ninguna bici</p><p className="text-gray-600 mt-1">No hay ninguna bicicleta registrada con este teléfono. Si acabas de dejarla, puede que aún no esté en el sistema.</p></div>
                  </div>
                ) : resultado.estado === 'curso' ? (
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center flex-shrink-0"><div className="w-6 h-6 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>
                    <div><p className="font-bold text-amber-800 text-lg">En proceso</p><p className="text-amber-700 mt-1">Trabajo actual: {resultado.trabajo}</p><p className="text-amber-600 text-sm mt-3">Te notificaremos por WhatsApp cuando esté lista.</p></div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0"><svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    <div><p className="font-bold text-green-800 text-lg">¡Lista para recoger!</p><p className="text-green-700 mt-1">Tu bicicleta está preparada. Total: <strong>{resultado.precio}€</strong></p></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="servicios" className={`py-24 px-6 bg-white transition-all duration-700 ${visible.servicios ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">Servicios profesionales</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Todo lo que tu bici necesita</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Servicio integral con técnicos especializados y piezas de las mejores marcas</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s, i) => (
              <div key={i} className="group bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:bg-white hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:from-orange-500 group-hover:to-orange-600 transition-all"><div className="w-3 h-3 bg-orange-500 rounded-full group-hover:bg-white transition-colors"></div></div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{s.nombre}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div><p className="text-orange-400 font-semibold mb-2">Centro técnico autorizado</p><h3 className="text-2xl sm:text-3xl font-bold mb-3">Servicio Oficial Specialized</h3><p className="text-gray-400 max-w-lg">Técnicos certificados, piezas originales y garantía oficial en todas las reparaciones.</p></div>
              <a href="tel:964667035" className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-orange-500/30 transition-all">Solicitar presupuesto</a>
            </div>
          </div>
        </div>
      </section>

      <section id="nosotros" className={`py-24 px-6 bg-gray-50 transition-all duration-700 ${visible.nosotros ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">Nuestra historia</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Pasión por el ciclismo desde 2003</h2>
              <p className="text-gray-600 mb-6 leading-relaxed"><strong className="text-gray-900">Bicicletas Manrubia</strong> nace del amor por las dos ruedas. José Manrubia, fundador y alma del taller, combina su trabajo diario con la competición en el Equipo MTB cada fin de semana.</p>
              <p className="text-gray-600 mb-6 leading-relaxed">Esta doble faceta nos permite entender las necesidades reales de cada ciclista. No solo reparamos bicicletas, las entendemos.</p>
              <p className="text-gray-600 leading-relaxed">El ciclismo es tradición familiar. <strong className="text-gray-900">Paco Manrubia</strong> dirige Manrubia Bikes en Sagunto, compartiendo los mismos valores de excelencia y servicio.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-3xl"><p className="text-5xl font-black text-orange-400 mb-2">20+</p><p className="text-gray-400 font-medium">Años de experiencia</p></div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl"><p className="text-5xl font-black mb-2">MTB</p><p className="text-orange-100 font-medium">Equipo competición</p></div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-8 rounded-3xl"><p className="text-5xl font-black mb-2">S</p><p className="text-orange-100 font-medium">Specialized Oficial</p></div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-3xl"><p className="text-5xl font-black text-orange-400 mb-2">2</p><p className="text-gray-400 font-medium">Tiendas Manrubia</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="marcas" className={`py-24 px-6 bg-gray-900 transition-all duration-700 ${visible.marcas ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-1 rounded-full text-sm font-semibold mb-4">Partners oficiales</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-white">Marcas que distribuimos</h2>
          <div className="flex flex-wrap justify-center gap-4">{marcas.map((marca, i) => (<div key={i} className="bg-gray-800 px-8 py-4 rounded-xl font-semibold text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 transition-all cursor-pointer">{marca}</div>))}</div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gradient-to-r from-purple-600 to-purple-500">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white text-center lg:text-left"><p className="text-purple-200 font-semibold mb-2 uppercase tracking-wider">Nuevo servicio</p><h2 className="text-3xl sm:text-4xl font-black mb-3">Punto Vinted</h2><p className="text-purple-100 text-lg max-w-lg">Recoge y envía tus paquetes de Vinted en nuestra tienda. Cómodo, rápido y sin complicaciones.</p></div>
            <div className="flex-shrink-0 bg-white/20 backdrop-blur border border-white/30 px-10 py-5 rounded-2xl"><p className="text-white font-bold text-lg">Disponible en tienda</p></div>
          </div>
        </div>
      </section>

      <section id="contacto" className={`py-24 px-6 bg-white transition-all duration-700 ${visible.contacto ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">Visítanos</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">¿Dónde encontrarnos?</h2>
            <p className="text-gray-600">Estamos en el centro de La Vall d'Uixó</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all"><p className="text-sm text-gray-500 font-medium mb-1">Dirección</p><p className="font-bold text-lg">Carrer n'Octavi Ten i Orenga, 51</p><p className="text-gray-600">12600 La Vall d'Uixó, Castellón</p></div>
              <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all"><p className="text-sm text-gray-500 font-medium mb-1">Teléfono</p><a href="tel:964667035" className="text-3xl font-bold text-orange-500 hover:text-orange-600 transition-colors">964 667 035</a></div>
              <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all"><p className="text-sm text-gray-500 font-medium mb-2">Horario</p><div className="space-y-1"><p className="font-semibold">Lunes a Viernes: <span className="text-gray-600 font-normal">10:00-14:00 y 17:00-20:00</span></p><p className="font-semibold">Sábados: <span className="text-gray-600 font-normal">11:00-13:00</span></p></div></div>
              <a href="https://www.instagram.com/bicicletasmanrubia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl text-white hover:shadow-xl transition-all"><div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"><span className="text-2xl font-bold">@</span></div><div><p className="text-sm text-purple-100">Síguenos en Instagram</p><p className="font-bold text-lg">@bicicletasmanrubia</p></div></a>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-xl h-96 lg:h-auto">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3080.8!2d-0.2275!3d39.8283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd600f9a0c3d4a7f%3A0x8f5c7b9a0d3e2c1b!2sCarrer%20n'Octavi%20Ten%20i%20Orenga%2C%2051%2C%2012600%20La%20Vall%20d'Uix%C3%B3%2C%20Castell%C3%B3n!5e0!3m2!1ses!2ses!4v1700000000000" width="100%" height="100%" style={{ border: 0, minHeight: '400px' }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 px-6 bg-orange-50 border-t border-orange-100"><div className="max-w-4xl mx-auto text-center"><p className="text-gray-700">¿Estás más cerca de Sagunto? Visita <strong className="text-orange-600">Manrubia Bikes</strong>, dirigida por Paco Manrubia. Misma familia, misma calidad.</p></div></section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4"><Logo light /><div><p className="font-bold text-lg">Bicicletas Manrubia</p><p className="text-sm text-gray-400">Entra andando, sal pedaleando</p></div></div>
            <div className="flex gap-8 text-sm text-gray-400"><button onClick={() => scrollTo('servicios')} className="hover:text-white transition-colors">Servicios</button><button onClick={() => scrollTo('nosotros')} className="hover:text-white transition-colors">Nosotros</button><button onClick={() => scrollTo('contacto')} className="hover:text-white transition-colors">Contacto</button></div>
            <p className="text-sm text-gray-500">© 2025 Bicicletas Manrubia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
