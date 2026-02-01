import { useState, useEffect } from 'react';

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

  const buscarBici = () => {
    if (!telefono) return;
    setBuscando(true);
    setTimeout(() => {
      setResultado({ encontrada: true, estado: 'curso', trabajo: 'Revisión completa' });
      setBuscando(false);
    }, 1000);
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

  const marcas = ['Mondraker', 'Specialized', 'S-Works', '
