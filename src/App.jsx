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
        precio: bici.precio,
        desglose: bici.desglose
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

  const marcas = ['Mondraker', 'Specialized', 'S-Works', 'RockShox', 'Maxxis', 'Motul', 'Nutrinovex', 'Eassun', 'Whistle', 'Kross', 'Bike Ahead', 'Garmin', 'Massi', 'Darimo', 'SRAM', 'Shimano', 'Onoff', 'Galfer'];

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
              <p className="text-teal-200 font-semibold mb-2 upp
