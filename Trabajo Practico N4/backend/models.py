from pydantic import BaseModel
from typing import List


class ParticipanteCreate(BaseModel):
    """Datos que llegan desde el frontend al crear un participante (POST)."""
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: List[str]
    nivel: str
    aceptaTerminos: bool


class ParticipanteResponse(BaseModel):
    """Datos que devuelve la API al frontend (incluye el ID generado por la BD)."""
    id: int
    nombre: str
    email: str
    edad: int
    pais: str
    modalidad: str
    tecnologias: List[str]
    nivel: str
    aceptaTerminos: bool
