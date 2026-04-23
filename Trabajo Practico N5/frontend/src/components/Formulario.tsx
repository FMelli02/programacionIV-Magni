import { useState, useEffect } from 'react'
import { Participante } from '../models/Participante'
import { useParticipantes } from '../context/ParticipantesContext'

const tecnologiasDisponibles = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java']
const paises = ['Argentina', 'Chile', 'Uruguay', 'México', 'España']
const niveles = ['Principiante', 'Intermedio', 'Avanzado']
const modalidades = ['Presencial', 'Virtual', 'Híbrido']

const estadoInicial = {
  nombre: '',
  email: '',
  edad: '',
  pais: 'Argentina',
  modalidad: 'Presencial',
  tecnologias: [] as string[],
  nivel: 'Principiante',
  aceptaTerminos: false,
}

export function Formulario() {
  const { agregar, editar, participanteEnEdicion, cancelarEdicion } = useParticipantes()
  const [formData, setFormData] = useState(estadoInicial)

  // Cuando cambia participanteEnEdicion, pre-cargamos el formulario
  // Si es null (modo creación), reseteamos al estado inicial
  useEffect(() => {
    if (participanteEnEdicion) {
      setFormData({
        nombre: participanteEnEdicion.nombre,
        email: participanteEnEdicion.email,
        edad: String(participanteEnEdicion.edad),
        pais: participanteEnEdicion.pais,
        modalidad: participanteEnEdicion.modalidad,
        tecnologias: participanteEnEdicion.tecnologias,
        nivel: participanteEnEdicion.nivel,
        aceptaTerminos: participanteEnEdicion.aceptaTerminos,
      })
    } else {
      setFormData(estadoInicial)
    }
  }, [participanteEnEdicion])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const input = e.target as HTMLInputElement
      if (name === 'aceptaTerminos') {
        setFormData({ ...formData, aceptaTerminos: input.checked })
      } else if (name === 'tecnologias') {
        setFormData({
          ...formData,
          tecnologias: input.checked
            ? [...formData.tecnologias, value]
            : formData.tecnologias.filter(t => t !== value),
        })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleRadioChange = (value: string) => {
    setFormData({ ...formData, modalidad: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.aceptaTerminos) {
      alert('Debe aceptar los términos y condiciones')
      return
    }

    if (!formData.nombre || !formData.email) {
      alert('Complete los campos requeridos')
      return
    }

    if (participanteEnEdicion) {
      // Modo edición: enviamos el participante completo con su ID
      const participanteEditado: Participante = {
        id: participanteEnEdicion.id,
        nombre: formData.nombre,
        email: formData.email,
        edad: parseInt(formData.edad),
        pais: formData.pais,
        modalidad: formData.modalidad,
        tecnologias: formData.tecnologias,
        nivel: formData.nivel,
        aceptaTerminos: formData.aceptaTerminos,
      }
      await editar(participanteEditado)
      // editar() ya limpia participanteEnEdicion internamente
    } else {
      // Modo creación: sin ID (el backend lo asigna)
      const nuevoParticipante: Omit<Participante, 'id'> = {
        nombre: formData.nombre,
        email: formData.email,
        edad: parseInt(formData.edad),
        pais: formData.pais,
        modalidad: formData.modalidad,
        tecnologias: formData.tecnologias,
        nivel: formData.nivel,
        aceptaTerminos: formData.aceptaTerminos,
      }
      await agregar(nuevoParticipante)
      setFormData(estadoInicial)
    }
  }

  const modoEdicion = participanteEnEdicion !== null

  return (
    <div className="bg-white rounded shadow p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {modoEdicion
            ? `Editando: ${participanteEnEdicion.nombre}`
            : 'Registrar Nuevo Participante'}
        </h2>
        {modoEdicion && (
          <button
            type="button"
            onClick={cancelarEdicion}
            className="text-sm text-gray-500 hover:text-red-500 underline transition"
          >
            Cancelar edición
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Grid para formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Edad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              placeholder="Edad"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
            <select
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              {paises.map(pais => (
                <option key={pais} value={pais}>{pais}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modalidad */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Modalidad</label>
          <div className="flex gap-4">
            {modalidades.map(mod => (
              <label key={mod} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="modalidad"
                  value={mod}
                  checked={formData.modalidad === mod}
                  onChange={() => handleRadioChange(mod)}
                  className="mr-2"
                />
                {mod}
              </label>
            ))}
          </div>
        </div>

        {/* Tecnologías */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Tecnologías</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tecnologiasDisponibles.map(tech => (
              <label key={tech} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="tecnologias"
                  value={tech}
                  checked={formData.tecnologias.includes(tech)}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {tech}
              </label>
            ))}
          </div>
        </div>

        {/* Nivel de experiencia */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de experiencia</label>
          <select
            name="nivel"
            value={formData.nivel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          >
            {niveles.map(nivel => (
              <option key={nivel} value={nivel}>{nivel}</option>
            ))}
          </select>
        </div>

        {/* Acepta términos */}
        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Acepto los términos y condiciones del evento</span>
          </label>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <button
            type="submit"
            className={`text-white px-4 py-2 rounded transition ${
              modoEdicion
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {modoEdicion ? 'Actualizar Participante' : 'Registrar Participante'}
          </button>

          {modoEdicion && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
