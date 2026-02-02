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
                    <p className="font-semibold text-gray-700 mb-4 text-lg">Desglose:</p>
                    <div className="space-y-3">
                      {biciEncontrada.desglose.split('\n').map((linea, i) => {
                        const [concepto, precio] = linea.split(': ')
                        return (
                          <div key={i} className="flex justify-between items-center">
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
                    💡 <strong>Recuerda:</strong> Horario L-V 10:00-14:00 y 17:00-20:00 | Sábados 11:00-13:00
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

      {/* Wallapop */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-6xl mb-6">🛍️</div>
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Compra/Venta en Wallapop</h2>
          <p className="text-xl text-gray-600 mb-8">
            Encuentra bicis de segunda mano en perfecto estado
          </p>
          <a 
            href="https://www.wallapop.com/user/gabrielm-419024603" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-700 transition transform hover:scale-105"
          >
            Ver en Wallapop
          </a>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Nuestros Servicios</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Reparaciones</h3>
              <p className="text-gray-600">Servicio técnico especializado para todo tipo de bicicletas</p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">🚴</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Venta</h3>
              <p className="text-gray-600">Amplio catálogo de bicis nuevas y de ocasión</p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Puesta a punto</h3>
              <p className="text-gray-600">Ajuste y mantenimiento completo de tu bicicleta</p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Equipo MTB</h3>
              <p className="text-gray-600">Patrocinamos al equipo MTB Manrubia. ¡Síguenos en las carreras!</p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">👕</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Punto Vinted</h3>
              <p className="text-gray-600">Envíos y recepciones de paquetes Vinted disponibles</p>
            </div>
            
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Servicio Oficial</h3>
              <p className="text-gray-600">Servicio Oficial Specialized</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Marcas con las que trabajamos</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {['Mondraker', 'Specialized', 'S-Works', 'RockShox', 'Maxxis', 'Motul', 'Nutrinovex', 'Eassun', 'Whistle', 'Kross', 'Bike Ahead', 'Garmin', 'Massi', 'Darimo', 'SRAM', 'Shimano', 'Onoff', 'Galfer'].map((marca, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition text-center">
                <p className="text-lg font-semibold text-gray-700">{marca}</p>
              </div>
            ))}
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

          <div className="flex justify-center gap-6 mb-8">
            <a 
              href="https://www.instagram.com/bicicletasmanrubia" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl hover:text-orange-400 transition"
            >
              📷
            </a>
          </div>

          <p className="mt-8 text-gray-400">
            Tienda hermana: <span className="text-orange-400 font-semibold">Manrubia Bikes Sagunto</span> (Paco Manrubia)
          </p>
        </div>
      </section>

    </div>
  )
}
