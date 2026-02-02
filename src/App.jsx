{biciEncontrada && (
  <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-2xl font-bold text-gray-800">{biciEncontrada.nombre}</h3>
      <span className={`px-6 py-2 rounded-full font-semibold ${
        biciEncontrada.estado === 'finalizada' 
          ? 'bg-green-100 text-green-700' 
          : 'bg-orange-100 text-orange-700'
      }`}>
        {biciEncontrada.estado === 'finalizada' ? '✓ Lista para recoger' : '⏳ En reparación'}
      </span>
    </div>

    <div className="bg-orange-50 rounded-xl p-6 mb-6">
      <p className="font-semibold text-gray-700 mb-4">Trabajos:</p>
      <ul className="space-y-3">
        {(() => {
          const trabajos = typeof biciEncontrada.trabajos === 'string' 
            ? JSON.parse(biciEncontrada.trabajos) 
            : biciEncontrada.trabajos
          
          return trabajos?.map((t, i) => (
            <li key={i} className="flex items-center gap-3">
              {t.hecho ? (
                <>
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-800 text-lg">{t.tarea}</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600 text-lg">{t.tarea}</span>
                </>
              )}
            </li>
          ))
        })()}
      </ul>
    </div>

    {biciEncontrada.estado === 'finalizada' && biciEncontrada.precio && (
      <div className="text-center">
        <p className="text-gray-600 mb-2">Total</p>
        <p className="text-4xl font-bold text-orange-600">{biciEncontrada.precio}€</p>
      </div>
    )}

    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
      <p className="text-sm text-gray-700">
        💡 <strong>Recuerda:</strong> Horario L-V 10:00-14:00 y 17:00-20:00 | Sábados 11:00-13:00
      </p>
    </div>
  </div>
)}
