import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [bicis, setBicis] = useState([])
  const [historialClientes, setHistorialClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [nuevaBici, setNuevaBici] = useState({ nombre: '', telefono: '', trabajo: '' })
  const [biciLista, setBiciLista] = useState(null)
  const [desglose, setDesglose] = useState([{ concepto: '', precio: '' }])
  const [confirmarEliminar, setConfirmarEliminar] = useState(null)
  const [vistaActual, setVistaActual] = useState('curso')
  const [cargando, setCargando] = useState(true)
  const [historialCliente, setHistorialCliente] = useState(null)
  const [editandoBici, setEditandoBici] = useState(null)
  const [desgloseFinal, setDesgloseFinal] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargando(true)
    const { data: bicisData } = await supabase.from('bicis').select('*').order('fecha', { ascending: true })
    const { data: historialData } = await supabase.from('historial_clientes').select('*')
    if (bicisData) setBicis(bicisData)
    if (historialData) setHistorialClientes(historialData)
    setCargando(false)
  }

  const bicisEnCurso = bicis.filter(b => b.estado === 'curso')
  const bicisFinalizadas = bicis.filter(b => b.estado === 'finalizada')

  const bicisFiltradas = (vistaActual === 'curso' ? bicisEnCurso : bicisFinalizadas)
    .filter(bici =>
      bici.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      bici.telefono.includes(busqueda)
    )

  const limpiarTelefono = (tel) => {
    let limpio = tel.replace(/[\s\-\+\(\)]/g, '')
    if (limpio.startsWith('34') && limpio.length > 9) {
      limpio = limpio.substring(2)
    }
    return limpio
  }

  const handleTelefonoChange = (telefono) => {
    setNuevaBici(prev => ({ ...prev, telefono }))
    const telefonoLimpio = limpiarTelefono(telefono)
    const clienteExistente = historialClientes.find(h => limpiarTelefono(h.telefono) === telefonoLimpio)
    if (clienteExistente) {
      setNuevaBici(prev => ({ ...prev, nombre: clienteExistente.nombre, telefono }))
    }
  }

  const agregarBici = async () => {
    if (!nuevaBici.nombre || !nuevaBici.telefono || !nuevaBici.trabajo) return

    const { data, error } = await supabase.from('bicis').insert([
      { nombre: nuevaBici.nombre, telefono: nuevaBici.telefono, trabajo: nuevaBici.trabajo, estado: 'curso' }
    ]).select()

    if (data) {
      setBicis([...bicis, data[0]])
    }

    const telefonoLimpio = limpiarTelefono(nuevaBici.telefono)
    const existe = historialClientes.find(h => limpiarTelefono(h.telefono) === telefonoLimpio)
    if (!existe) {
      await supabase.from('historial_clientes').insert([
        { nombre: nuevaBici.nombre, telefono: nuevaBici.telefono }
      ])
      setHistorialClientes([...historialClientes, { nombre: nuevaBici.nombre, telefono: nuevaBici.telefono }])
    }

    setNuevaBici({ nombre: '', telefono: '', trabajo: '' })
    setMostrarFormulario(false)
  }

  const marcarLista = (bici) => {
    setBiciLista(bici)
    setDesglose([{ concepto: '', precio: '' }])
  }

  const agregarLinea = () => {
    setDesglose([...desglose, { concepto: '', precio: '' }])
  }

  const eliminarLinea = (index) => {
    if (desglose.length > 1) {
      setDesglose(desglose.filter((_, i) => i !== index))
    }
  }

  const actualizarDesglose = (index, campo, valor) => {
    const nuevo = [...desglose]
    nuevo[index][campo] = valor
    setDesglose(nuevo)
  }

  const calcularTotal = (items) => {
    return items.reduce((sum, item) => sum + (parseFloat(item.precio) || 0), 0).toFixed(2)
  }

  const enviarWhatsApp = async () => {
    const desgloseValido = desglose.filter(d => d.concepto && d.precio)
    if (desgloseValido.length === 0) return

    const telefonoLimpio = limpiarTelefono(biciLista.telefono)
    const total = calcularTotal(desgloseValido)
    const desgloseTexto = desgloseValido.map(d => `• ${d.concepto}: ${d.precio}€`).join('\n')

    await supabase.from('bicis').update({
      estado: 'finalizada',
      precio: total,
      desglose: JSON.stringify(desgloseValido),
      fecha_fin: new Date().toISOString()
    }).eq('id', biciLista.id)

    setBicis(bicis.map(b =>
      b.id === biciLista.id
        ? { ...b, estado: 'finalizada', precio: total, desglose: JSON.stringify(desgloseValido), fecha_fin: new Date().toISOString() }
        : b
    ))

    const mensaje = `¡Hola! Tu bici ya está lista para recoger en Bicicletas Manrubia 🚲

Detalle:
${desgloseTexto}

TOTAL: ${total}€

⚠️ Por favor, no respondas a este mensaje. Para cualquier duda, llámanos al 964 667 035.`

    const url = `https://wa.me/34${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')

    setBiciLista(null)
    setDesglose([{ concepto: '', precio: '' }])
  }

  const eliminarBici = async (id) => {
    await supabase.from('bicis').delete().eq('id', id)
    setBicis(bicis.filter(b => b.id !== id))
    setConfirmarEliminar(null)
  }

  const verHistorialCliente = (bici) => {
    const telefonoLimpio = limpiarTelefono(bici.telefono)
    const reparaciones = bicis.filter(b => limpiarTelefono(b.telefono) === telefonoLimpio)
    setHistorialCliente({ nombre: bici.nombre, telefono: bici.telefono, reparaciones })
  }

  const editarBici = (bici) => {
    const desgloseGuardado = bici.desglose ? JSON.parse(bici.desglose) : [{ concepto: '', precio: bici.precio || '' }]
    setEditandoBici(bici)
    setDesgloseFinal(desgloseGuardado)
  }

  const guardarEdicion = async () => {
    const desgloseValido = desgloseFinal.filter(d => d.concepto && d.precio)
    const total = calcularTotal(desgloseValido)

    await supabase.from('bicis').update({
      trabajo: editandoBici.trabajo,
      precio: total,
      desglose: JSON.stringify(desgloseValido)
    }).eq('id', editandoBici.id)

    setBicis(bicis.map(b =>
      b.id === editandoBici.id
        ? { ...b, trabajo: editandoBici.trabajo, precio: total, desglose: JSON.stringify(desgloseValido) }
        : b
    ))

    setEditandoBici(null)
    setDesgloseFinal([])
  }

  const diasEnTaller = (fecha) => {
    const hoy = new Date()
    const entrada = new Date(fecha)
    const diff = Math.floor((hoy - entrada) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Hoy'
    if (diff === 1) return '1 día'
    return `${diff} días`
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🚲</div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-orange-500 text-white p-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-bold">M</div>
            <div>
              <h1 className="text-xl font-bold">Bicicletas Manrubia</h1>
              <p className="text-orange-100 text-sm">Panel del taller</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-xl p-6 shadow-md mb-4 text-center">
          <p className="text-gray-600">Tienes</p>
          <p className="text-5xl font-bold text-orange-500">{bicisEnCurso.length}</p>
          <p className="text-gray-600">{bicisEnCurso.length === 1 ? 'bici en el taller' : 'bicis en el taller'}</p>
        </div>

        <div className="flex mb-4 bg-white rounded-xl p-1 shadow-md">
          <button
            onClick={() => setVistaActual('curso')}
            className={`flex-1 py-3 rounded-lg font-bold transition ${vistaActual === 'curso' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            🔧 En curso ({bicisEnCurso.length})
          </button>
          <button
            onClick={() => setVistaActual('finalizada')}
            className={`flex-1 py-3 rounded-lg font-bold transition ${vistaActual === 'finalizada' ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            ✓ Finalizadas ({bicisFinalizadas.length})
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o teléfono..."
            className="flex-1 p-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {vistaActual === 'curso' && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition"
            >
              + Nueva
            </button>
          )}
        </div>

        {mostrarFormulario && (
          <div className="bg-white rounded-xl p-4 shadow-md mb-4">
            <h2 className="font-bold text-lg mb-3 text-gray-800">Nueva bici</h2>
            <div className="space-y-3">
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                value={nuevaBici.telefono}
                onChange={(e) => handleTelefonoChange(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nombre"
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                value={nuevaBici.nombre}
                onChange={(e) => setNuevaBici({ ...nuevaBici, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="¿Qué hay que hacerle?"
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                value={nuevaBici.trabajo}
                onChange={(e) => setNuevaBici({ ...nuevaBici, trabajo: e.target.value })}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setMostrarFormulario(false)}
                  className="flex-1 p-3 rounded-lg border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarBici}
                  className="flex-1 bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {biciLista && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="font-bold text-lg mb-2 text-gray-800">¡Bici lista!</h2>
              <p className="text-gray-600 mb-4">{biciLista.nombre} - {biciLista.trabajo}</p>
              
              <p className="font-bold text-gray-700 mb-2">Desglose:</p>
              {desglose.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Concepto"
                    className="flex-1 p-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    value={item.concepto}
                    onChange={(e) => actualizarDesglose(index, 'concepto', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="€"
                    className="w-20 p-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-center"
                    value={item.precio}
                    onChange={(e) => actualizarDesglose(index, 'precio', e.target.value)}
                  />
                  {desglose.length > 1 && (
                    <button onClick={() => eliminarLinea(index)} className="text-red-500 px-2">✕</button>
                  )}
                </div>
              ))}
              
              <button onClick={agregarLinea} className="text-orange-500 font-bold mb-4">+ Añadir línea</button>
              
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="text-right font-bold text-xl">TOTAL: {calcularTotal(desglose)}€</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setBiciLista(null)}
                  className="flex-1 p-3 rounded-lg border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarWhatsApp}
                  className="flex-1 bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600 transition"
                >
                  📱 Enviar WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        {historialCliente && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="font-bold text-lg mb-1 text-gray-800">Historial de {historialCliente.nombre}</h2>
              <p className="text-gray-500 text-sm mb-4">{historialCliente.telefono}</p>
              
              <p className="text-gray-600 mb-3">{historialCliente.reparaciones.length} reparación(es)</p>
              
              <div className="space-y-3 mb-4">
                {historialCliente.reparaciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).map((rep, i) => (
                  <div key={i} className={`p-3 rounded-lg border-l-4 ${rep.estado === 'curso' ? 'bg-yellow-50 border-yellow-400' : 'bg-green-50 border-green-400'}`}>
                    <p className="font-bold text-gray-800">{rep.trabajo}</p>
                    <p className="text-sm text-gray-500">{formatearFecha(rep.fecha)}</p>
                    {rep.estado === 'finalizada' && rep.desglose && (
                      <div className="mt-2 text-sm">
                        {JSON.parse(rep.desglose).map((d, j) => (
                          <p key={j} className="text-gray-600">• {d.concepto}: {d.precio}€</p>
                        ))}
                        <p className="font-bold text-green-600 mt-1">Total: {rep.precio}€</p>
                      </div>
                    )}
                    {rep.estado === 'finalizada' && !rep.desglose && rep.precio && (
                      <p className="font-bold text-green-600 mt-1">Total: {rep.precio}€</p>
                    )}
                    {rep.estado === 'curso' && (
                      <p className="text-yellow-600 text-sm mt-1">⏱ En curso</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => setHistorialCliente(null)}
                className="w-full p-3 rounded-lg border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {editandoBici && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="font-bold text-lg mb-2 text-gray-800">Editar reparación</h2>
              <p className="text-gray-600 mb-4">{editandoBici.nombre}</p>
              
              <input
                type="text"
                placeholder="Trabajo realizado"
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none mb-4"
                value={editandoBici.trabajo}
                onChange={(e) => setEditandoBici({ ...editandoBici, trabajo: e.target.value })}
              />
              
              <p className="font-bold text-gray-700 mb-2">Desglose:</p>
              {desgloseFinal.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Concepto"
                    className="flex-1 p-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                    value={item.concepto}
                    onChange={(e) => {
                      const nuevo = [...desgloseFinal]
                      nuevo[index].concepto = e.target.value
                      setDesgloseFinal(nuevo)
                    }}
                  />
                  <input
                    type="number"
                    placeholder="€"
                    className="w-20 p-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-center"
                    value={item.precio}
                    onChange={(e) => {
                      const nuevo = [...desgloseFinal]
                      nuevo[index].precio = e.target.value
                      setDesgloseFinal(nuevo)
                    }}
                  />
                  {desgloseFinal.length > 1 && (
                    <button onClick={() => setDesgloseFinal(desgloseFinal.filter((_, i) => i !== index))} className="text-red-500 px-2">✕</button>
                  )}
                </div>
              ))}
              
              <button onClick={() => setDesgloseFinal([...desgloseFinal, { concepto: '', precio: '' }])} className="text-orange-500 font-bold mb-4">+ Añadir línea</button>
              
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <p className="text-right font-bold text-xl">TOTAL: {calcularTotal(desgloseFinal)}€</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditandoBici(null)}
                  className="flex-1 p-3 rounded-lg border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarEdicion}
                  className="flex-1 bg-orange-500 text-white p-3 rounded-lg font-bold hover:bg-orange-600 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmarEliminar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
              <h2 className="font-bold text-lg mb-2 text-gray-800">¿Eliminar bici?</h2>
              <p className="text-gray-600 mb-4">{confirmarEliminar.nombre} - {confirmarEliminar.trabajo}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmarEliminar(null)}
                  className="flex-1 p-3 rounded-lg border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => eliminarBici(confirmarEliminar.id)}
                  className="flex-1 bg-red-500 text-white p-3 rounded-lg font-bold hover:bg-red-600 transition"
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {bicisFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              {busqueda ? 'No se encontró ninguna bici' : vistaActual === 'curso' ? 'No hay bicis en el taller' : 'No hay bicis finalizadas'}
            </div>
          ) : (
            bicisFiltradas.map(bici => (
              <div key={bici.id} className={`bg-white rounded-xl p-4 shadow-md ${bici.estado === 'finalizada' ? 'border-l-4 border-green-500' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1" onClick={() => verHistorialCliente(bici)} style={{ cursor: 'pointer' }}>
                    <p className="font-bold text-gray-800">{bici.nombre}</p>
                    <p className="text-gray-500 text-sm">{bici.telefono}</p>
                    <p className="text-orange-600 mt-1">{bici.trabajo}</p>
                    {bici.estado === 'curso' ? (
                      <p className="text-gray-400 text-xs mt-1">⏱ {diasEnTaller(bici.fecha)}</p>
                    ) : (
                      <div className="mt-1">
                        {bici.desglose && JSON.parse(bici.desglose).map((d, i) => (
                          <p key={i} className="text-gray-500 text-xs">• {d.concepto}: {d.precio}€</p>
                        ))}
                        <p className="text-green-600 text-sm font-bold">Total: {bici.precio}€ · {formatearFecha(bici.fecha_fin)}</p>
                      </div>
                    )}
                    <p className="text-blue-500 text-xs mt-1">👆 Toca para ver historial</p>
                  </div>
                  <div className="flex gap-2">
                    {bici.estado === 'finalizada' && (
                      <button
                        onClick={() => editarBici(bici)}
                        className="text-blue-500 hover:text-blue-700 p-2 transition"
                        title="Editar"
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      onClick={() => setConfirmarEliminar(bici)}
                      className="text-gray-400 hover:text-red-500 p-2 transition"
                      title="Eliminar"
                    >
                      🗑
                    </button>
                    {bici.estado === 'curso' && (
                      <button
                        onClick={() => marcarLista(bici)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        ✓ Lista
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
