import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Trash2, Plus, Check, X } from 'lucide-react'

export default function App() {
  const [bicis, setBicis] = useState([])
  const [historial, setHistorial] = useState([])
  const [tab, setTab] = useState('curso')
  const [buscar, setBuscar] = useState('')
  const [modal, setModal] = useState(false)
  const [modalFinalizar, setModalFinalizar] = useState(null)
  
  // Form nueva bici
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [trabajos, setTrabajos] = useState([])
  const [nuevaTarea, setNuevaTarea] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: b } = await supabase.from('bicis').select('*').order('fecha', { ascending: false })
    const { data: h } = await supabase.from('historial_clientes').select('*')
    setBicis(b || [])
    setHistorial(h || [])
  }

  async function buscarCliente(tel) {
    const cliente = historial.find(c => c.telefono === tel)
    if (cliente) setNombre(cliente.nombre)
  }

  function añadirTarea() {
    if (nuevaTarea.trim()) {
      setTrabajos([...trabajos, { tarea: nuevaTarea, hecho: false }])
      setNuevaTarea('')
    }
  }

  function eliminarTarea(index) {
    setTrabajos(trabajos.filter((_, i) => i !== index))
  }

  function toggleTarea(index) {
    const nuevo = [...trabajos]
    nuevo[index].hecho = !nuevo[index].hecho
    setTrabajos(nuevo)
  }

  async function guardarBici() {
    if (!nombre || !telefono || trabajos.length === 0) {
      alert('Rellena todos los campos y añade al menos una tarea')
      return
    }

    await supabase.from('bicis').insert({
      nombre,
      telefono,
      trabajos: JSON.stringify(trabajos),
      fecha: new Date().toISOString(),
      estado: 'curso'
    })

    const existe = historial.find(c => c.telefono === telefono)
    if (!existe) {
      await supabase.from('historial_clientes').insert({ nombre, telefono })
    }

    setModal(false)
    setNombre('')
    setTelefono('')
    setTrabajos([])
    cargarDatos()
  }

  async function finalizarBici(id, precio) {
    const bici = bicis.find(b => b.id === id)
    
    await supabase.from('bicis')
      .update({ 
        estado: 'finalizada', 
        fecha_fin: new Date().toISOString(),
        precio 
      })
      .eq('id', id)

    const msg = `¡Hola! Tu bici ya está lista para recoger en Bicicletas Manrubia 🚴‍♂️\n\nTotal: ${precio}€\n\nPor favor, no respondas a este mensaje. Para cualquier duda, llámanos al 964 667 035.`
    window.open(`https://wa.me/34${bici.telefono}?text=${encodeURIComponent(msg)}`, '_blank')
    
    setModalFinalizar(null)
    cargarDatos()
  }

  async function eliminarBici(id) {
    if (confirm('¿Seguro que quieres eliminar esta bici?')) {
      await supabase.from('bicis').delete().eq('id', id)
      cargarDatos()
    }
  }

  const filtradas = bicis
    .filter(b => b.estado === tab)
    .filter(b => 
      b.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
      b.telefono.includes(buscar)
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-orange-600">Panel Taller</h1>
              <p className="text-gray-600 mt-2">Bicicletas Manrubia</p>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold text-orange-600">{bicis.filter(b => b.estado === 'curso').length}</p>
              <p className="text-gray-600">bicis en taller</p>
            </div>
          </div>
        </div>

        {/* Tabs y Búsqueda */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTab('curso')}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                tab === 'curso' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              En Curso
            </button>
            <button
              onClick={() => setTab('finalizada')}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                tab === 'finalizada' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Finalizadas
            </button>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
              value={buscar}
              onChange={e => setBuscar(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
            />
            <button
              onClick={() => setModal(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition flex items-center gap-2"
            >
              <Plus size={20} /> Nueva Bici
            </button>
          </div>
        </div>

        {/* Lista de Bicis */}
        <div className="space-y-4">
          {filtradas.map(bici => {
            const trabajosArray = typeof bici.trabajos === 'string' ? JSON.parse(bici.trabajos) : bici.trabajos
            
            return (
              <div key={bici.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{bici.nombre}</h3>
                    <p className="text-gray-600">{bici.telefono}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(bici.fecha).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {tab === 'curso' && (
                      <button
                        onClick={() => setModalFinalizar(bici.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Marcar Lista
                      </button>
                    )}
                    <button
                      onClick={() => eliminarBici(bici.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Lista de Trabajos */}
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-700 mb-2">Trabajos:</p>
                  <ul className="space-y-2">
                    {trabajosArray?.map((t, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {t.hecho ? (
                          <Check className="text-green-600" size={20} />
                        ) : (
                          <div className="w-5 h-5 border-2 border-orange-400 rounded" />
                        )}
                        <span className={t.hecho ? 'line-through text-gray-500' : 'text-gray-800'}>
                          {t.tarea}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {tab === 'finalizada' && bici.precio && (
                  <div className="mt-4 text-right">
                    <span className="text-2xl font-bold text-orange-600">{bici.precio}€</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Modal Nueva Bici */}
        {modal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Nueva Bici</h2>
              
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 focus:border-orange-500 focus:outline-none"
              />
              
              <input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={e => {
                  setTelefono(e.target.value)
                  if (e.target.value.length >= 9) buscarCliente(e.target.value)
                }}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:border-orange-500 focus:outline-none"
              />

              <div className="mb-6">
                <p className="font-semibold mb-3">Trabajos a realizar:</p>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Añadir tarea..."
                    value={nuevaTarea}
                    onChange={e => setNuevaTarea(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && añadirTarea()}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={añadirTarea}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                <ul className="space-y-2">
                  {trabajos.map((t, i) => (
                    <li key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.hecho}
                          onChange={() => toggleTarea(i)}
                          className="w-5 h-5"
                        />
                        <span className={t.hecho ? 'line-through text-gray-500' : ''}>
                          {t.tarea}
                        </span>
                      </div>
                      <button
                        onClick={() => eliminarTarea(i)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarBici}
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Finalizar */}
        {modalFinalizar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">Finalizar Bici</h2>
              
              <input
                type="number"
                placeholder="Precio final (€)"
                id="precio-input"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:border-orange-500 focus:outline-none"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setModalFinalizar(null)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const precio = document.getElementById('precio-input').value
                    if (precio) finalizarBici(modalFinalizar, precio)
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Enviar WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
