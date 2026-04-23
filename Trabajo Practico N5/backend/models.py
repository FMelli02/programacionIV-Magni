from pydantic import BaseModel
from typing import List, Optional


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


class ParticipanteUpdate(BaseModel):
    """Datos para actualizar un participante existente (PUT). Todos opcionales."""
    nombre: Optional[str] = None
    email: Optional[str] = None
    edad: Optional[int] = None
    pais: Optional[str] = None
    modalidad: Optional[str] = None
    tecnologias: Optional[List[str]] = None
    nivel: Optional[str] = None
    aceptaTerminos: Optional[bool] = None
