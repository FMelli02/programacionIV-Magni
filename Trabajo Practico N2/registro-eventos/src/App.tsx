import { useState, useEffect } from 'react'
import './App.css'

class Participante {
  id: number
  nombre: string
  email: string
  edad: number
  pais: string
  modalidad: string
  tecnologias: string[]
  nivel: string
  aceptaTerminos: boolean

  constructor(
    id: number,
    nombre: string,
    email: string,
    edad: number,
    pais: string,
    modalidad: string,
    tecnologias: string[],
    nivel: string,
    aceptaTerminos: boolean
  ) {
    this.id = id
    this.nombre = nombre
    this.email = email
    this.edad = edad
    this.pais = pais
    this.modalidad = modalidad
    this.tecnologias = tecnologias
    this.nivel = nivel
    this.aceptaTerminos = aceptaTerminos
  }
}

// Función para inicializar desde localStorage
const obtenerParticipantesIniciales = (): Participante[] => {
  const guardados = localStorage.getItem('participantes')
  return guardados ? JSON.parse(guardados) : []
}

function App() {
  const [participantes, setParticipantes] = useState<Participante[]>(obtenerParticipantesIniciales())
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    edad: '',
    pais: 'Argentina',
    modalidad: 'Presencial',
    tecnologias: [] as string[],
    nivel: 'Principiante',
    aceptaTerminos: false,
  })

  const [filtros, setFiltros] = useState({
    nombre: '',
    modalidad: 'Todas',
    nivel: 'Todos',
  })

  const tecnologiasDisponibles = ['React', 'Angular', 'Vue', 'Node', 'Python', 'Java']
  const paises = ['Argentina', 'Chile', 'Uruguay', 'México', 'España']
  const niveles = ['Principiante', 'Intermedio', 'Avanzado']
  const modalidades = ['Presencial', 'Virtual', 'Híbrido']

  // Guardar en LocalStorage cada vez que cambian los participantes
  useEffect(() => {
    localStorage.setItem('participantes', JSON.stringify(participantes))
  }, [participantes])

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

    setParticipantes([...participantes, nuevoParticipante])

    setFormData({
      nombre: '',
      email: '',
      edad: '',
      pais: 'Argentina',
      modalidad: 'Presencial',
      tecnologias: [],
      nivel: 'Principiante',
      aceptaTerminos: false,
    })
  }

  const handleEliminar = (id: number) => {
    setParticipantes(participantes.filter(p => p.id !== id))
  }

  const participantesFiltrados = participantes.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
    const coincideModalidad = filtros.modalidad === 'Todas' || p.modalidad === filtros.modalidad
    const coincideNivel = filtros.nivel === 'Todos' || p.nivel === filtros.nivel

    return coincideNombre && coincideModalidad && coincideNivel
  })

  const obtenerColorNivel = (nivel: string): string => {
    switch (nivel) {
      case 'Principiante':
        return 'bg-green-100'
      case 'Intermedio':
        return 'bg-yellow-100'
      case 'Avanzado':
        return 'bg-red-100'
      default:
        return 'bg-white'
    }
  }

  const obtenerColorTextoNivel = (nivel: string): string => {
    switch (nivel) {
      case 'Principiante':
        return 'text-green-700'
      case 'Intermedio':
        return 'text-yellow-700'
      case 'Avanzado':
        return 'text-red-700'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-500 text-white p-6 text-center">
        <h1 className="text-2xl font-bold">Registro de Participantes</h1>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Contador de participantes */}
        <div className="mb-6 text-lg font-semibold text-gray-700">
          Participantes registrados: {participantes.length}
        </div>

        {/* Formulario */}
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

        {/* Filtros */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Filtros de Búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buscar por nombre */}
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={filtros.nombre}
              onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />

            {/* Filtrar por modalidad */}
            <select
              value={filtros.modalidad}
              onChange={(e) => setFiltros({ ...filtros, modalidad: e.target.value })}
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
              onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="Todos">Todos</option>
              {niveles.map(nivel => (
                <option key={nivel} value={nivel}>{nivel}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Participantes */}
        <div>
          <h2 className="text-xl font-bold mb-6">Participantes Registrados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {participantesFiltrados.map(participante => (
              <div
                key={participante.id}
                className={`${obtenerColorNivel(participante.nivel)} rounded shadow p-4 hover:shadow-lg transition`}
              >
                <h3 className="font-bold text-lg mb-2">{participante.nombre}</h3>
                <p className="text-sm text-gray-700 mb-1">{participante.pais}</p>
                <p className="text-sm text-gray-700 mb-1">Modalidad: {participante.modalidad}</p>
                <p className={`text-sm font-semibold mb-2 ${obtenerColorTextoNivel(participante.nivel)}`}>
                  Nivel: {participante.nivel}
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  Tecnologías: {participante.tecnologias.join(' - ')}
                </p>
                <button
                  onClick={() => handleEliminar(participante.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          {participantesFiltrados.length === 0 && (
            <p className="text-center text-gray-500 text-lg">No hay participantes que coincidan con los filtros</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
