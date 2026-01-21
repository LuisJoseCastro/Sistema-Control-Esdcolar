# ACADEMIC-backend

Backend centralizado para el sistema de control escolar, desarrollado en **NestJS**, **TypeScript** y **PostgreSQL**.
Este sistema gestiona la lógica de negocio para los roles de **Administrador**, **Docente** y **Alumno**, además de la gestión de suscripciones SaaS (Tenants).

---

## 🚀 1. Inicio Rápido para Desarrolladores

Sigue estos pasos estrictamente para levantar el entorno de desarrollo.

### Prerrequisitos
* **Node.js:** v18 o superior.
* **Docker Desktop:** Debe estar instalado y corriendo.
* **Git:** Configurado correctamente.

### Pasos de Instalación

1.  **Clona el repositorio y ubícate en la rama base:**
    ```bash
    git clone <URL_DEL_REPO>
    cd ACADEMIC-backend
    git checkout develop
    git pull origin develop
    ```

2.  **Crea tu rama de trabajo (NUNCA trabajes directo en develop):**
    Usa la nomenclatura `feature/<rol>/<funcionalidad>`.
    * *Ejemplo Admin:* `git checkout -b feature/admin/dashboard`
    * *Ejemplo Docente:* `git checkout -b feature/teacher/grades`
    * *Ejemplo Alumno:* `git checkout -b feature/student/profile`

3.  **Configura las Variables de Entorno:**
    El archivo `.env` no se sube al repositorio por seguridad.
    * Copia el archivo de ejemplo:
      ```bash
      cp .env.example .env
      ```
    * (Opcional) Edita `.env` si necesitas credenciales diferentes a las por defecto (`admin`/`root`).

4.  **Instala dependencias:**
    ```bash
    npm install
    ```

5.  **Levanta la Base de Datos (Docker):**
    Esto descargará la imagen de PostgreSQL y PGAdmin.
    ```bash
    docker-compose up -d
    ```

6.  **Inicia el Servidor (Modo Desarrollo):**
    ```bash
    npm run start:dev
    ```
    *El servidor correrá en: `http://localhost:3000`*

---

## 🐳 2. Solución de Problemas Comunes con Docker

Si tienes problemas al levantar los contenedores, revisa esta lista antes de pedir ayuda.

### 🔴 Error: "Port 5432 is already allocated"
**Causa:** Tienes instalado PostgreSQL localmente en tu computadora y está ocupando el puerto.
**Solución:**
* **Opción A (Recomendada):** Detén tu servicio local de Postgres.
  * *Windows:* `Services.msc` -> Buscar PostgreSQL -> Stop.
  * *Linux/Mac:* `sudo service postgresql stop`.
* **Opción B:** Cambia el puerto en `docker-compose.yml` (ej. `"5433:5432"`) y actualiza tu `.env`.

### 🔴 Error: "Connection refused" al conectar NestJS con la DB
**Causa:** El contenedor no ha terminado de iniciar o las credenciales en `.env` no coinciden.
**Solución:**
1. Revisa que el contenedor esté corriendo: `docker ps`.
2. Revisa los logs de la base de datos: `docker logs academic_db`.
3. Verifica que `DB_HOST=localhost` en tu `.env`.

### 🧹 Reinicio Limpio (Borrón y Cuenta Nueva)
Si corrompiste la base de datos y quieres empezar desde cero:
```bash
# Baja los contenedores y BORRA los volúmenes de datos
docker-compose down -v

# Vuelve a levantar todo limpio
docker-compose up -d