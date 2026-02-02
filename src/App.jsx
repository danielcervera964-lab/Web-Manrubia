import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [telefono, setTelefono] = useState('')
  const [biciEncontrada, setBiciEncontrada] = useState(null)
  const [buscando, setBuscando] = useState(false)

  async function buscarBici() {
    if (!telefono) {
      alert('Introduce tu teléfono')
      return
    }

    setBuscando(true)
    const { data } = await supabase
      .from('bicis')
      .select('*')
      .eq('telefono', telefono)
      .eq('estado', 'finalizada')
      .order('fecha_fin', { ascending: false })
      .limit(1)

    setBuscando(false)
    
    if (data && data.length > 0) {
      setBiciEncontrada(data[0])
    } else {
      setBiciEncontrada('no-encontrada')
    }
  }

  const marcas = [
    { nombre: 'Mondraker', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Mondraker_logo.svg/1200px-Mondraker_logo.svg.png' },
    { nombre: 'Specialized', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Specialized_Bicycle_Components_logo.svg/2560px-Specialized_Bicycle_Components_logo.svg.png' },
    { nombre: 'RockShox', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/RockShox_logo.svg/2560px-RockShox_logo.svg.png' },
    { nombre: 'Maxxis', logo: 'https://seeklogo.com/images/M/maxxis-logo-0C5F6F7F8A-seeklogo.com.png' },
    { nombre: 'Motul', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Motul_logo.svg/2560px-Motul_logo.svg.png' },
    { nombre: 'Nutrinovex', logo: 'https://nutrinovex.com/wp-content/uploads/2021/06/logo-nutrinovex.png' },
    { nombre: 'Eassun', logo: 'https://eassun.com/wp-content/uploads/2023/01/logo-eassun-negro.png' },
    { nombre: 'Whistle', logo: 'https://www.whistlebikes.com/wp-content/uploads/2020/03/logo-whistle.png' },
    { nombre: 'Kross', logo: 'https://www.kross.pl/img/logo.svg' },
    { nombre: 'Garmin', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Garmin_logo.svg/2560px-Garmin_logo.svg.png' },
    { nombre: 'Massi', logo: 'https://massibikes.com/wp-content/uploads/2020/01/logo-massi.png' },
    { nombre: 'SRAM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/SRAM_LLC_logo.svg/2560px-SRAM_LLC_logo.svg.png' },
    { nombre: 'Shimano', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Shimano_logo.svg/2560px-Shimano_logo.svg.png' },
    { nombre: 'Galfer', logo: 'https://galfer.eu/wp-content/uploads/2021/04/logo-galfer.png' }
  ]

  const fotos = [
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600',
    'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=600',
    'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=600',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600',
    'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=600',
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 to-orange-800 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <div className="mb-8">
            <h1 className="text-8xl font-black text-orange-400 mb-2" style={{ textShadow: '4px 4px 0px #000, 8px 8px 20px rgba(0,0,0,0.5)' }}>
              M
            </h1>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6">Bicicletas Manrubia</h2>
          <p className="text-2xl md:text-3xl font-light mb-8">Entra andando, sal pedaleando</p>
          <a 
            href="#consulta" 
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-orange-100 transition transform hover:scale-105"
          >
            Consulta tu bici
          </a>
        </div>
      </section>

      {/* Consulta tu bici */}
      <section id="consulta" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">¿Tu bici está lista?</h2>
          
          <div className="bg-orange-50 rounded-2xl p-8 shadow-xl">
            <p className="text-center text-gray-700 mb-6">Introduce tu teléfono para consultar el estado</p>
            
            <div className="flex gap-4 max-w-md mx-auto">
              <input
                type="tel"
                placeholder="666777888"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && buscarBici()}
                className="flex-1 px-6 py-4 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-lg"
              />
              <button
                onClick={buscarBici}
                disabled={buscando}
                className="px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition disabled:opacity-50"
              >
                {buscando ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {biciEncontrada && biciEncontrada !== 'no-encontrada' && (
              <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">{biciEncontrada.nombre}</h3>
                  <span className="px-6 py-2 rounded-full font-semibold bg-green-100 text-green-700">
                    ✓ Lista para recoger
                  </span>
                </div>

                {biciEncontrada.desglose && (
                  <div className="bg-orange-50 rounded-xl p-6 mb-6">
                    <p className="font-semibold text-gray-700 mb-4 text-lg">Desglose de trabajos:</p>
                    <div className="space-y-3">
                      {biciEncontrada.desglose.split('\n').map((linea, i) => {
                        const [concepto, precio] = linea.split(': ')
                        return (
                          <div key={i} className="flex justify-between items-center border-b border-orange-200 pb-2">
                            <span className="text-gray-700">{concepto}</span>
                            <span className="font-semibold text-orange-600">{precio}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-orange-300 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-3xl font-bold text-orange-600">{biciEncontrada.precio}€</span>
                    </div>
                  </div>
                )}

                {!biciEncontrada.desglose && biciEncontrada.precio && (
                  <div className="text-center mb-6">
                    <p className="text-gray-600 mb-2">Total</p>
                    <p className="text-4xl font-bold text-orange-600">{biciEncontrada.precio}€</p>
                  </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 text-center">
                    💡 <strong>Horario de recogida:</strong><br/>
                    L-V: 10:00-14:00 y 17:00-20:00<br/>
                    Sábados: 11:00-13:00
                  </p>
                </div>
              </div>
            )}

            {biciEncontrada === 'no-encontrada' && (
              <div className="mt-8 p-6 bg-yellow-50 rounded-xl text-center">
                <p className="text-gray-700">
                  No encontramos tu bici en estado "lista".<br/>
                  Puede que aún esté en reparación o el teléfono no coincida.<br/>
                  Llámanos al <strong className="text-orange-600">964 667 035</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Galería de Fotos */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Nuestros Trabajos</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Bicis espectaculares montadas para nuestros clientes</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fotos.map((foto, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer transform transition hover:scale-105">
                <img 
                  src={foto} 
                  alt={`Bici ${i + 1}`}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a 
              href="https://www.instagram.com/bicicletasmanrubia" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Síguenos en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Marcas con las que trabajamos</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Las mejores marcas del mercado</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {marcas.map((marca, i) => (
              <div key={i} className="flex items-center justify-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition transform hover:scale-105">
                <img 
                  src={marca.logo} 
                  alt={marca.nombre}
                  className="max-h-16 w-auto object-contain grayscale hover:grayscale-0 transition"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <span className="text-xl font-bold text-gray-700 hidden">{marca.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Nuestros Servicios</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Reparaciones</h3>
              <p className="text-gray-600">Servicio técnico especializado para todo tipo de bicicletas</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🚴</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Venta</h3>
              <p className="text-gray-600">Amplio catálogo de bicis nuevas y de ocasión</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Puesta a punto</h3>
              <p className="text-gray-600">Ajuste y mantenimiento completo</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Wallapop</h3>
              <p className="text-gray-600">Compra/venta de bicis de segunda mano</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">👕</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Punto Vinted</h3>
              <p className="text-gray-600">Envíos y recepciones disponibles</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Equipo MTB</h3>
              <p className="text-gray-600">Patrocinamos al equipo MTB Manrubia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Encuéntranos</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Horario</h3>
              <p className="mb-2">Lunes a Viernes: 10:00-14:00 y 17:00-20:00</p>
              <p>Sábados: 11:00-13:00</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-400">Contacto</h3>
              <p className="mb-2">📞 964 667 035</p>
              <p className="mb-2">📍 Carrer n'Octavi Ten i Orenga, 51</p>
              <p>12600 La Vall d'Uixó, Castellón</p>
            </div>
          </div>

          <div className="mb-8">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3087.076147305679!2d-0.22834668464810673!3d39.81299997944631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5ffe8c8888888b%3A0x8888888888888888!2sCarrer%20n&#39;Octavi%20Ten%20i%20Orenga%2C%2051%2C%2012600%20la%20Vall%20d&#39;Uix%C3%B3%2C%20Castell%C3%B3!5e0!3m2!1ses!2ses!4v1234567890123!5m2!1ses!2ses" 
              width="100%" 
              height="400" 
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>

          <div className="flex justify-center gap-6">
            <a 
              href="https://www.instagram.com/bicicletasmanrubia" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl hover:text-orange-400 transition"
            >
              📷
            </a>
            <a 
              href="https://www.wallapop.com/user/gabrielm-419024603" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl hover:text-orange-400 transition"
            >
              🛍️
            </a>
          </div>

          <p className="mt-12 text-gray-400">
            Tienda hermana: <span className="text-orange-400 font-semibold">Manrubia Bikes Sagunto</span> (Paco Manrubia)
          </p>
        </div>
      </section>

    </div>
  )
}
