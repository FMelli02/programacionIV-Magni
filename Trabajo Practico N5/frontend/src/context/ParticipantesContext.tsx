import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { Participante } from '../models/Participante'
import {
  participantesReducer,
  estadoInicial,
} from '../reducers/participantesReducer'

const API_URL = 'http://localhost:8000'

// ──────────────────────────────────────────────
// Tipos del Contexto
// ──────────────────────────────────────────────
interface ParticipantesContextType {
  participantes: Participante[]
  participanteEnEdicion: Participante | null
  agregar: (p: Omit<Participante, 'id'>) => Promise<void>
  eliminar: (id: number) => Promise<void>
  resetear: () => Promise<void>
  editar: (p: Participante) => Promise<void>
  seleccionarParaEditar: (p: Participante) => void
  cancelarEdicion: () => void
}

// ──────────────────────────────────────────────
// Creación del Contexto
// ──────────────────────────────────────────────
const ParticipantesContext = createContext<ParticipantesContextType | null>(null)

// ──────────────────────────────────────────────
// Provider: ahora usa useReducer en lugar de useState
// para centralizar toda la lógica de participantes.
//
// Flujo:
//   1. Componente llama a agregar/eliminar/editar/etc.
//   2. El método hace la llamada HTTP al backend.
//   3. Con la respuesta, hace dispatch() al reducer.
//   4. El reducer devuelve el nuevo estado puro.
//   5. React re-renderiza.
// ──────────────────────────────────────────────
export function ParticipantesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(participantesReducer, estadoInicial)

  // participanteEnEdicion: estado local de UI — no pertenece al reducer
  // porque no es parte de los datos de dominio, sino de la interacción.
  const [participanteEnEdicion, setParticipanteEnEdicion] = useState<Participante | null>(null)

  // Al montar el Provider, cargamos los participantes desde el backend
  useEffect(() => {
    fetch(`${API_URL}/participantes`)
      .then(res => res.json())
      .then(data => dispatch({ type: 'GETPARTICIPANTES', payload: data }))
      .catch(err => console.error('Error cargando participantes:', err))
  }, [])

  /**
   * Envía un nuevo participante al backend (POST) y despacha AGREGAR al reducer.
   */
  const agregar = async (p: Omit<Participante, 'id'>) => {
    const res = await fetch(`${API_URL}/participantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
    if (!res.ok) throw new Error('Error al crear participante')
    const nuevo: Participante = await res.json()
    dispatch({ type: 'AGREGAR', payload: nuevo })
  }

  /**
   * Elimina un participante por ID en el backend (DELETE) y despacha ELIMINAR.
   */
  const eliminar = async (id: number) => {
    const res = await fetch(`${API_URL}/participantes/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar participante')
    dispatch({ type: 'ELIMINAR', payload: id })
  }

  /**
   * Elimina TODOS los participantes en el backend y despacha RESET.
   */
  const resetear = async () => {
    const res = await fetch(`${API_URL}/participantes`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al resetear participantes')
    dispatch({ type: 'RESET', payload: [] })
  }

  /**
   * Envía los datos actualizados al backend (PUT) y despacha EDITAR al reducer.
   * Tras guardar, limpia el participante en edición.
   */
  const editar = async (p: Participante) => {
    const res = await fetch(`${API_URL}/participantes/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
    if (!res.ok) throw new Error('Error al editar participante')
    const actualizado: Participante = await res.json()
    dispatch({ type: 'EDITAR', payload: actualizado })
    setParticipanteEnEdicion(null)
  }

  /**
   * Carga un participante en el formulario para su edición.
   */
  const seleccionarParaEditar = (p: Participante) => {
    setParticipanteEnEdicion(p)
  }

  /**
   * Cancela la edición en curso y vuelve al modo creación.
   */
  const cancelarEdicion = () => {
    setParticipanteEnEdicion(null)
  }

  return (
    <ParticipantesContext.Provider
      value={{
        participantes: state.participantes,
        participanteEnEdicion,
        agregar,
        eliminar,
        resetear,
        editar,
        seleccionarParaEditar,
        cancelarEdicion,
      }}
    >
      {children}
    </ParticipantesContext.Provider>
  )
}

// ──────────────────────────────────────────────
// Hook personalizado: evita importar el contexto
// y useContext en cada componente que lo consuma.
// ──────────────────────────────────────────────
export function useParticipantes(): ParticipantesContextType {
  const ctx = useContext(ParticipantesContext)
  if (!ctx) {
    throw new Error('useParticipantes debe usarse dentro de <ParticipantesProvider>')
  }
  return ctx
}
