from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

import database
from models import ParticipanteCreate, ParticipanteResponse, ParticipanteUpdate

# ──────────────────────────────────────────────
# Inicialización de la app y la base de datos
# ──────────────────────────────────────────────
app = FastAPI(
    title="API Participantes — TP4",
    description="Backend para el sistema de registro de participantes (UTN - Programación IV)",
    version="1.0.0",
)

# Crear la tabla si no existe al arrancar el servidor
database.init_db()

# ──────────────────────────────────────────────
# CORS: permite que el frontend React (localhost:5173)
# pueda hacer peticiones al backend (localhost:8000)
# ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ──────────────────────────────────────────────
# Endpoints
# ──────────────────────────────────────────────

@app.get("/participantes", response_model=List[ParticipanteResponse])
def get_participantes():
    """Retorna la lista completa de participantes."""
    return database.get_all()


@app.post("/participantes", response_model=ParticipanteResponse, status_code=201)
def create_participante(participante: ParticipanteCreate):
    """Crea un nuevo participante y lo guarda en la base de datos."""
    return database.create(participante)


@app.delete("/participantes/{participante_id}", status_code=204)
def delete_participante(participante_id: int):
    """Elimina un participante por ID."""
    eliminado = database.delete(participante_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Participante no encontrado")


@app.delete("/participantes", status_code=204)
def delete_all_participantes():
    """Elimina todos los participantes (usado por el botón Resetear)."""
    database.delete_all()


@app.put("/participantes/{participante_id}", response_model=ParticipanteResponse)
def update_participante(participante_id: int, datos: ParticipanteUpdate):
    """Actualiza un participante existente por ID."""
    actualizado = database.update(participante_id, datos)
    if not actualizado:
        raise HTTPException(status_code=404, detail="Participante no encontrado")
    return actualizado
