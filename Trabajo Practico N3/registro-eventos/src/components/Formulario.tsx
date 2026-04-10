import { useState } from 'react'
import { Participante } from '../models/Participante'

const tecnologiasDisponibles = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java']
const paises = ['Argentina', 'Chile', 'Uruguay', 'México', 'España']
const niveles = ['Principiante', 'Intermedio', 'Avanzado']
const modalidades = ['Presencial', 'Virtual', 'Híbrido']

interface FormularioProps {
  onAgregar: (p: Participante) => void
}

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

export function Formulario({ onAgregar }: FormularioProps) {
  const [formData, setFormData] = useState(estadoInicial)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.aceptaTerminos) {
      alert('Debe aceptar los términos y condiciones')
      return
    }

    if (!formData.nombre || !formData.email) {
      alert('Complete los campos requeridos')
      return
    }

    const nuevoParticipante = new Participante(
      Date.now(),
      formData.nombre,
      formData.email,
      parseInt(formData.edad),
      formData.pais,
      formData.modalidad,
      formData.tecnologias,
      formData.nivel,
      formData.aceptaTerminos
    )

    onAgregar(nuevoParticipante)
    setFormData(estadoInicial)
  }

  return (
    <div className="bg-white rounded shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-6">Registrar Nuevo Participante</h2>

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

        {/* Botón Registrar */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Registrar Participante
        </button>
      </form>
    </div>
  )
}
