import { Participante } from '../models/Participante'

// ──────────────────────────────────────────────
// Definición de acciones (union discriminada)
// Cada acción tiene un `type` único y un `payload` tipado.
// ──────────────────────────────────────────────
export type Action =
  | { type: 'GETPARTICIPANTES'; payload: Participante[] }
  | { type: 'AGREGAR';          payload: Participante }
  | { type: 'ELIMINAR';         payload: number }
  | { type: 'RESET';            payload: Participante[] }
  | { type: 'EDITAR';           payload: Participante }
  | { type: 'SET';              payload: Participante[] }

// ──────────────────────────────────────────────
// Estado del reducer
// ──────────────────────────────────────────────
export interface ParticipantesState {
  participantes: Participante[]
}

export const estadoInicial: ParticipantesState = {
  participantes: [],
}

// ──────────────────────────────────────────────
// Reducer: función pura que decide cómo cambia
// el estado en función de la acción recibida.
// Recibe estado actual + acción → devuelve nuevo estado.
// NUNCA modifica el estado directamente (inmutabilidad).
// ──────────────────────────────────────────────
export function participantesReducer(
  state: ParticipantesState,
  action: Action,
): ParticipantesState {
  switch (action.type) {
    // Carga inicial desde la API
    case 'GETPARTICIPANTES':
      return { ...state, participantes: action.payload }

    // Agrega un participante al final de la lista
    case 'AGREGAR':
      return { ...state, participantes: [...state.participantes, action.payload] }

    // Filtra el participante con ese ID (lo elimina)
    case 'ELIMINAR':
      return {
        ...state,
        participantes: state.participantes.filter(p => p.id !== action.payload),
      }

    // Reemplaza toda la lista (e.g. después de un reset desde la API)
    case 'RESET':
      return { ...state, participantes: action.payload }

    // Reemplaza el participante editado por el actualizado
    case 'EDITAR':
      return {
        ...state,
        participantes: state.participantes.map(p =>
          p.id === action.payload.id ? action.payload : p,
        ),
      }

    // Setea la lista completa (uso genérico)
    case 'SET':
      return { ...state, participantes: action.payload }

    default:
      return state
  }
}
