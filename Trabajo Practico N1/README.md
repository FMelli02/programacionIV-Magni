# TP Nro 1 - Programacion IV

Solucion completa con:
- Base de datos: MySQL
- Backend: Python (Flask + mysql-connector-python)
- Frontend: HTML + JavaScript nativo + CSS

## Estructura

- `db/01_create_database.sql`
- `db/02_schema_and_seed.sql`
- `backend/app.py`
- `backend/.env.example`
- `frontend/login.html`
- `frontend/lista.html`

## Paso a Paso Para Levantarlo En Otra PC

## 1) Clonar o copiar el proyecto

Deja el proyecto en cualquier ruta local de tu PC.

## 2) Crear base de datos en MySQL

Opcion A: usando MySQL CLI

1. Abre una terminal en la carpeta del proyecto.
2. Entra a MySQL:

```bash
mysql -u root -p
```

3. Dentro de MySQL ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS utn_db;
USE utn_db;
SOURCE db/02_schema_and_seed.sql;
SELECT id, usuario, bloqueado, apellido, nombre FROM usuarios_utn;
```

Opcion B: usando MySQL Workbench

1. Crea el schema `utn_db`.
2. Abre y ejecuta el archivo `db/02_schema_and_seed.sql`.
3. Verifica que la tabla `usuarios_utn` tenga datos.

## 3) Configurar backend Python

1. En terminal, entra a la carpeta backend:

```powershell
cd backend
```

2. Crear entorno virtual:

```powershell
python -m venv .venv
```

3. Activar entorno virtual (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

4. Instalar dependencias:

```powershell
pip install -r requirements.txt
```

## 4) Configurar archivo .env

1. Copia `.env.example` a `.env`.
2. Edita `backend/.env` con tus datos reales de MySQL.

Ejemplo sin password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=utn_db
DB_USER=root
DB_PASSWORD=
APP_PORT=8080
```

Ejemplo con password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=utn_db
DB_USER=root
DB_PASSWORD=tu_password
APP_PORT=8080
```

## 5) Iniciar la aplicacion

Desde la carpeta `backend` y con `.venv` activo:

```powershell
python app.py
```

Abrir en navegador:

- http://localhost:8080/login.html

## 6) Credenciales de prueba

- usuario: `mjmartinez`
- clave: `123456`

## Problemas comunes

- `Access denied for user`:
  Revisa `DB_USER` y `DB_PASSWORD` en `backend/.env`.
- `Can't connect to MySQL server`:
  Verifica que el servicio MySQL este iniciado y el puerto sea `3306`.
- Error de import en Python:
  Asegurate de activar `.venv` y ejecutar `pip install -r requirements.txt`.
- Si `mysql` no existe como comando:
  Usa MySQL Workbench o MySQL Command Line Client.

## Endpoints

- `GET /tp1/login.php?user=...&pass=...`
- `GET /tp/lista.php?action=BUSCAR`
- `GET /tp/lista.php?action=BUSCAR&usuario=texto`
- `GET /tp/lista.php?action=BLOQUEAR&idUser=XXXX&estado=Y`
- `GET /tp/lista.php?action=BLOQUEAR&idUser=XXXX&estado=N`
