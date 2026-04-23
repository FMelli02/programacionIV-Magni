import { Participante } from '../models/Participante'
import { useParticipantes } from '../context/ParticipantesContext'

interface ParticipanteCardProps {
  participante: Participante
}

const colorFondoNivel = (nivel: string): string => {
  switch (nivel) {
    case 'Principiante': return 'bg-green-100'
    case 'Intermedio':   return 'bg-yellow-100'
    case 'Avanzado':     return 'bg-red-100'
    default:             return 'bg-white'
  }
}

const colorTextoNivel = (nivel: string): string => {
  switch (nivel) {
    case 'Principiante': return 'text-green-700'
    case 'Intermedio':   return 'text-yellow-700'
    case 'Avanzado':     return 'text-red-700'
    default:             return 'text-gray-700'
  }
}

export function ParticipanteCard({ participante }: ParticipanteCardProps) {
  const { eliminar, seleccionarParaEditar, participanteEnEdicion } = useParticipantes()

  // Marca visualmente la card que está siendo editada
  const estaEnEdicion = participanteEnEdicion?.id === participante.id

  return (
    <div
      className={`${colorFondoNivel(participante.nivel)} rounded shadow p-4 hover:shadow-lg transition ${
        estaEnEdicion ? 'ring-2 ring-yellow-400' : ''
      }`}
    >
      <h3 className="font-bold text-lg mb-2">{participante.nombre}</h3>
      <p className="text-sm text-gray-700 mb-1">{participante.pais}</p>
      <p className="text-sm text-gray-700 mb-1">Modalidad: {participante.modalidad}</p>
      <p className={`text-sm font-semibold mb-2 ${colorTextoNivel(participante.nivel)}`}>
        Nivel: {participante.nivel}
      </p>
      <p className="text-sm text-gray-700 mb-3">
        Tecnologías: {participante.tecnologias.join(' - ')}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => seleccionarParaEditar(participante)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => eliminar(participante.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
