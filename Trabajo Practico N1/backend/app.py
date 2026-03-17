import os
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory
import mysql.connector
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent / "frontend"

load_dotenv(BASE_DIR / ".env", override=True)


app = Flask(__name__, static_folder=str(FRONTEND_DIR), static_url_path="")


def get_conn():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME", "utn_db"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "root"),
    )


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "login.html")


@app.route("/login.html")
def login_page():
    return send_from_directory(FRONTEND_DIR, "login.html")


@app.route("/lista.html")
def lista_page():
    return send_from_directory(FRONTEND_DIR, "lista.html")


@app.route("/tp1/login.js", methods=["GET"])
def login_api():
    user = (request.args.get("user") or "").strip()
    password = (request.args.get("pass") or "").strip()

    if not user or not password:
        return jsonify(
            {
                "respuesta": "ERROR",
                "mje": "Ingreso Invalido, usuario y/o clave incorrecta",
            }
        )

    try:
        with get_conn() as conn:
            with conn.cursor(dictionary=True) as cur:
                cur.execute(
                    """
                    SELECT usuario, bloqueado
                    FROM usuarios_utn
                    WHERE usuario = %s AND clave = %s
                    LIMIT 1
                    """,
                    (user, password),
                )
                row = cur.fetchone()

        if not row:
            return jsonify(
                {
                    "respuesta": "ERROR",
                    "mje": "Ingreso Invalido, usuario y/o clave incorrecta",
                }
            )

        if row["bloqueado"] == "Y":
            return jsonify(
                {
                    "respuesta": "ERROR",
                    "mje": "Ingreso Invalido, usuario bloqueado",
                }
            )

        return jsonify({"respuesta": "OK", "mje": f"Ingreso Valido. Usuario {row['usuario']}"})
    except Exception as exc:
        return jsonify({"respuesta": "ERROR", "mje": str(exc)})


@app.route("/tp/lista.js", methods=["GET"])
def lista_api():
    action = (request.args.get("action") or "").strip().upper()

    if action == "BUSCAR":
        usuario = (request.args.get("usuario") or "").strip()
        like_value = f"%{usuario}%"

        try:
            with get_conn() as conn:
                with conn.cursor(dictionary=True) as cur:
                    cur.execute(
                        """
                        SELECT id, usuario, bloqueado, apellido, nombre
                        FROM usuarios_utn
                        WHERE LOWER(usuario) LIKE LOWER(%s)
                        ORDER BY id
                        """,
                        (like_value,),
                    )
                    rows = cur.fetchall()

            return jsonify(rows)
        except Exception as exc:
            return jsonify([{"respuesta": "ERROR", "mje": str(exc)}]), 500

    if action == "BLOQUEAR":
        id_user = request.args.get("idUser")
        estado = (request.args.get("estado") or "").strip().upper()

        if not id_user or estado not in {"Y", "N"}:
            return jsonify(
                {
                    "respuesta": "ERROR",
                    "mje": "Parametros invalidos. Use idUser y estado=Y/N",
                }
            )

        try:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "UPDATE usuarios_utn SET bloqueado = %s WHERE id = %s",
                        (estado, id_user),
                    )

                    if cur.rowcount == 0:
                        return jsonify(
                            {
                                "respuesta": "ERROR",
                                "mje": f"No existe usuario con id {id_user}",
                            }
                        )

                    conn.commit()

            return jsonify({"respuesta": "OK", "mje": "Bloqueo Exitoso"})
        except Exception as exc:
            return jsonify({"respuesta": "ERROR", "mje": str(exc)})

    return jsonify({"respuesta": "ERROR", "mje": "Action invalida"}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("APP_PORT", "8080")), debug=True)
