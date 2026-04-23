import sqlite3
import json
from typing import List
from models import ParticipanteCreate, ParticipanteResponse

DB_PATH = "participantes.db"


def get_connection() -> sqlite3.Connection:
    """Retorna una conexión a la base de datos SQLite."""
    conn = sqlite3.connect(DB_PATH)
    # Row factory para acceder a columnas por nombre
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Crea la tabla participantes si no existe. Se llama al iniciar la app."""
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS participantes (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre        TEXT    NOT NULL,
                email         TEXT    NOT NULL,
                edad          INTEGER NOT NULL,
                pais          TEXT    NOT NULL,
                modalidad     TEXT    NOT NULL,
                tecnologias   TEXT    NOT NULL,
                nivel         TEXT    NOT NULL,
                aceptaTerminos INTEGER NOT NULL
            )
        """)
        conn.commit()


def row_to_participante(row: sqlite3.Row) -> ParticipanteResponse:
    """Convierte una fila de SQLite al modelo Pydantic de respuesta."""
    return ParticipanteResponse(
        id=row["id"],
        nombre=row["nombre"],
        email=row["email"],
        edad=row["edad"],
        pais=row["pais"],
        modalidad=row["modalidad"],
        # tecnologias se guarda como JSON string en SQLite
        tecnologias=json.loads(row["tecnologias"]),
        nivel=row["nivel"],
        aceptaTerminos=bool(row["aceptaTerminos"]),
    )


def get_all() -> List[ParticipanteResponse]:
    """Retorna todos los participantes."""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM participantes").fetchall()
        return [row_to_participante(r) for r in rows]


def create(participante: ParticipanteCreate) -> ParticipanteResponse:
    """Inserta un nuevo participante y retorna el registro con su ID generado."""
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO participantes
                (nombre, email, edad, pais, modalidad, tecnologias, nivel, aceptaTerminos)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                participante.nombre,
                participante.email,
                participante.edad,
                participante.pais,
                participante.modalidad,
                # Lista de tecnologías se serializa como JSON string
                json.dumps(participante.tecnologias),
                participante.nivel,
                int(participante.aceptaTerminos),
            ),
        )
        conn.commit()
        new_id = cursor.lastrowid
        row = conn.execute("SELECT * FROM participantes WHERE id = ?", (new_id,)).fetchone()
        return row_to_participante(row)


def delete(participante_id: int) -> bool:
    """Elimina un participante por ID. Retorna True si existía, False si no."""
    with get_connection() as conn:
        cursor = conn.execute(
            "DELETE FROM participantes WHERE id = ?", (participante_id,)
        )
        conn.commit()
        return cursor.rowcount > 0


def delete_all() -> int:
    """Elimina todos los participantes. Retorna cuántos fueron eliminados."""
    with get_connection() as conn:
        cursor = conn.execute("DELETE FROM participantes")
        conn.commit()
        return cursor.rowcount
