import { createContext, useContext, useEffect, useState } from 'react'
import { Participante } from '../models/Participante'

const API_URL = 'http://localhost:8000'

// ──────────────────────────────────────────────
// Tipos del Contexto
// ──────────────────────────────────────────────
interface ParticipantesContextType {
  participantes: Participante[]
  agregar: (p: Omit<Participante, 'id'>) => Promise<void>
  eliminar: (id: number) => Promise<void>
  resetear: () => Promise<void>
}

// ──────────────────────────────────────────────
// Creación del Contexto
// ──────────────────────────────────────────────
const ParticipantesContext = createContext<ParticipantesContextType | null>(null)

// ──────────────────────────────────────────────
// Provider: encapsula el estado y la lógica de
// comunicación con el backend. Todos los componentes
// que estén dentro de <ParticipantesProvider> pueden
// acceder a los datos y métodos sin recibir props.
// ──────────────────────────────────────────────
export function ParticipantesProvider({ children }: { children: React.ReactNode }) {
  const [participantes, setParticipantes] = useState<Participante[]>([])

  // Al montar el Provider, cargamos los participantes desde el backend
  useEffect(() => {
    fetch(`${API_URL}/participantes`)
      .then(res => res.json())
      .then(data => setParticipantes(data))
      .catch(err => console.error('Error cargando participantes:', err))
  }, [])

  /**
   * Envía un nuevo participante al backend (POST) y actualiza el estado local
   * con el objeto que retorna la API (que ya tiene el ID generado por la BD).
   */
  const agregar = async (p: Omit<Participante, 'id'>) => {
    const res = await fetch(`${API_URL}/participantes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
    if (!res.ok) throw new Error('Error al crear participante')
    const nuevo: Participante = await res.json()
    setParticipantes(prev => [...prev, nuevo])
  }

  /**
   * Elimina un participante por ID en el backend (DELETE) y lo quita del estado local.
   */
  const eliminar = async (id: number) => {
    const res = await fetch(`${API_URL}/participantes/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al eliminar participante')
    setParticipantes(prev => prev.filter(p => p.id !== id))
  }

  /**
   * Elimina TODOS los participantes en el backend y vacía el estado local.
   */
  const resetear = async () => {
    const res = await fetch(`${API_URL}/participantes`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Error al resetear participantes')
    setParticipantes([])
  }

  return (
    <ParticipantesContext.Provider value={{ participantes, agregar, eliminar, resetear }}>
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
