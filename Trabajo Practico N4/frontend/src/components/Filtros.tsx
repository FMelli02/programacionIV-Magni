interface FiltrosState {
  nombre: string
  modalidad: string
  nivel: string
}

interface FiltrosProps {
  filtros: FiltrosState
  setFiltro: (filtros: FiltrosState) => void
  onLimpiar: () => void
}

const modalidades = ['Presencial', 'Virtual', 'Híbrido']
const niveles = ['Principiante', 'Intermedio', 'Avanzado']

export function Filtros({ filtros, setFiltro, onLimpiar }: FiltrosProps) {
  return (
    <div className="bg-white rounded shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Filtros de Búsqueda</h2>
        <button
          onClick={onLimpiar}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition text-sm"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buscar por nombre */}
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={(e) => setFiltro({ ...filtros, nombre: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />

        {/* Filtrar por modalidad */}
        <select
          value={filtros.modalidad}
          onChange={(e) => setFiltro({ ...filtros, modalidad: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="Todas">Todas</option>
          {modalidades.map(mod => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>

        {/* Filtrar por nivel */}
        <select
          value={filtros.nivel}
          onChange={(e) => setFiltro({ ...filtros, nivel: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        >
          <option value="Todos">Todos</option>
          {niveles.map(nivel => (
            <option key={nivel} value={nivel}>{nivel}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
