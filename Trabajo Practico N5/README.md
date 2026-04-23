# TP4 — Registro de Participantes

Backend Python (FastAPI + SQLite) + Frontend React (Vite + TypeScript + Context API).

---

## Requisitos previos

- **Python** 3.8 o superior
- **Node.js** 18 o superior
- **npm**

---

## 1. Levantar el Backend

Abrí una terminal y ejecutá los siguientes comandos:

```bash
cd backend
```

### Crear y activar el entorno virtual

```bash
python -m venv venv
./venv/Scripts/activate
```

> En Mac/Linux usá `source venv/bin/activate`

### Instalar dependencias

```bash
pip install -r requirements.txt
```

### Iniciar el servidor

```bash
uvicorn main:app --reload
```

El servidor queda corriendo en **http://localhost:8000**

> La base de datos SQLite (`participantes.db`) se crea automáticamente la primera vez que arranca el servidor. No requiere configuración adicional.

📄 Documentación interactiva de la API: **http://localhost:8000/docs**

---

## 2. Levantar el Frontend

Abrí **otra terminal** (dejá el backend corriendo) y ejecutá:

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**

---

## Endpoints disponibles

| Método   | Ruta                       | Descripción                        |
|----------|----------------------------|------------------------------------|
| `GET`    | `/participantes`           | Obtiene la lista de participantes  |
| `POST`   | `/participantes`           | Crea un nuevo participante         |
| `DELETE` | `/participantes/{id}`      | Elimina un participante por ID     |
| `DELETE` | `/participantes`           | Elimina todos los participantes    |

---

## Estructura del proyecto

```
Trabajo Practico N4/
├── backend/
│   ├── main.py           # Endpoints FastAPI
│   ├── database.py       # Operaciones SQLite
│   ├── models.py         # Schemas Pydantic
│   └── requirements.txt
└── frontend/
    └── src/
        ├── context/
        │   └── ParticipantesContext.tsx  # Estado global + llamadas a la API
        ├── components/
        │   ├── Formulario.tsx
        │   ├── ParticipanteCard.tsx
        │   └── Filtros.tsx
        └── App.tsx
```
