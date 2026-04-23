import { useState } from 'react'
import './index.css'
import { Formulario } from './components/Formulario'
import { Filtros } from './components/Filtros'
import { ParticipanteCard } from './components/ParticipanteCard'
import { useParticipantes } from './context/ParticipantesContext'

const filtrosIniciales = {
  nombre: '',
  modalidad: 'Todas',
  nivel: 'Todos',
}

function App() {
  // El estado de participantes y los métodos vienen del Context,
  // no de este componente. App ya no es responsable de persistir nada.
  const { participantes, resetear } = useParticipantes()

  // Los filtros son estado local de UI — no necesitan persistencia ni contexto global
  const [filtros, setFiltros] = useState(filtrosIniciales)

  const handleLimpiarFiltros = () => {
    setFiltros(filtrosIniciales)
  }

  // Estado derivado: filtrado combinado con AND lógico
  const participantesFiltrados = participantes.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
    const coincideModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad
    const coincideNivel = filtros.nivel === 'Todos' || p.nivel === filtros.nivel
    return coincideNombre && coincideModalidad && coincideNivel
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-500 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">Registro de Participantes</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Contador dinámico */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">
            Mostrando {participantesFiltrados.length} de {participantes.length} participantes
          </span>
          <button
            onClick={resetear}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm"
          >
            Resetear datos
          </button>
        </div>

        {/* Formulario */}
        <Formulario />

        {/* Filtros */}
        <Filtros
          filtros={filtros}
          setFiltro={setFiltros}
          onLimpiar={handleLimpiarFiltros}
        />

        {/* Lista de Participantes */}
        <div>
          <h2 className="text-xl font-bold mb-6">Participantes Registrados</h2>

          {participantesFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 text-lg">No hay participantes</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {participantesFiltrados.map(participante => (
                <ParticipanteCard
                  key={participante.id}
                  participante={participante}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
