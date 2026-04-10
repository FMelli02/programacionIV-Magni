import { Participante } from '../models/Participante'

interface ParticipanteCardProps {
  participante: Participante
  onEliminar: (id: number) => void
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

export function ParticipanteCard({ participante, onEliminar }: ParticipanteCardProps) {
  return (
    <div className={`${colorFondoNivel(participante.nivel)} rounded shadow p-4 hover:shadow-lg transition`}>
      <h3 className="font-bold text-lg mb-2">{participante.nombre}</h3>
      <p className="text-sm text-gray-700 mb-1">{participante.pais}</p>
      <p className="text-sm text-gray-700 mb-1">Modalidad: {participante.modalidad}</p>
      <p className={`text-sm font-semibold mb-2 ${colorTextoNivel(participante.nivel)}`}>
        Nivel: {participante.nivel}
      </p>
      <p className="text-sm text-gray-700 mb-3">
        Tecnologías: {participante.tecnologias.join(' - ')}
      </p>
      <button
        onClick={() => onEliminar(participante.id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
      >
        Eliminar
      </button>
    </div>
  )
}
