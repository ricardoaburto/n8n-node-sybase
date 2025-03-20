# n8n-nodes-sybase

Este paquete permite conectar **Sybase** con **n8n** para ejecutar consultas SQL y obtener información de la base de datos. 

## 📌 Características
- 📡 **Ejecutar consultas SQL** en Sybase
- 📋 **Obtener definición de tablas**
- 📂 **Listar esquemas y tablas** disponibles
- 🔒 **Autenticación con credenciales Sybase**

## 🚀 Instalación

### 1️⃣ Clonar el repositorio
```bash
cd ~/.n8n/custom-nodes
git clone https://github.com/ricardoaburto/n8n-node-sybase.git
cd n8n-node-sybase
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Compilar el código TypeScript
```bash
npm run build
```

### 4️⃣ Vincular el nodo con n8n
```bash
npm link
```

### 5️⃣ Verificar si el nodo está registrado en n8n
```bash
n8n list
```
Si el nodo aparece en la lista, la instalación fue exitosa. 🎉

## ⚙️ Uso en n8n
### 1️⃣ Agregar el nodo **Sybase** a un workflow
- Busca **"Sybase"** en la barra de búsqueda de n8n y agrégalo a tu flujo de trabajo.

### 2️⃣ Configurar las credenciales
- 📌 En la pestaña **Credentials**, ingresa:
  - **Host**: Dirección del servidor Sybase
  - **Port**: Puerto de conexión (por defecto 5000)
  - **Database**: Nombre de la base de datos
  - **Username**: Usuario de conexión
  - **Password**: Contraseña

### 3️⃣ Seleccionar la operación
- **Execute Query** → Ejecuta una consulta SQL personalizada
- **Get Table Definition** → Obtiene la estructura de una tabla
- **Get Schema and Tables List** → Lista todos los esquemas y tablas disponibles

### 4️⃣ Ejecutar el workflow
- Presiona **Execute Node** para ejecutar la consulta.

## 📌 Configuración manual de `N8N_CUSTOM_EXTENSIONS`
Si `n8n` no detecta el nodo, intenta agregar la siguiente variable de entorno:

```bash
set N8N_CUSTOM_EXTENSIONS=C:\Users\<user>\.n8n\custom-nodes
```

Luego, reinicia n8n:
```bash
n8n stop
n8n start
```

## 🐳 Configuración con Docker Compose

Para correr **n8n** junto con **PostgreSQL** y **Redis**, usa el siguiente `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_postgres_password
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 10

  n8n:
    context: .
    dockerfile: Dockerfile
    restart: always
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=postgres
      - DB_POSTGRESDB_PASSWORD=your_postgres_password
      - QUEUE_BULL_REDIS_HOST=redis
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - N8N_ENCRYPTION_KEY=your-secure-key
      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true
      - N8N_RELEASE_DATE=2025-03-17T12:00:00Z
      - N8N_REINSTALL_MISSING_PACKAGES=true
      - N8N_RUNNERS_ENABLED=true
      - NODE_TLS_REJECT_UNAUTHORIZED=0
      - N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  postgres_data:
  redis_data:
  n8n_data:
```

## 🛠️ Solución de Problemas
### ❌ "require(...).Sybase is not a constructor"
💡 **Causa:** `n8n` no está reconociendo correctamente el nodo.
✅ **Solución:** Asegúrate de haber ejecutado `npm link` y haber reiniciado `n8n`.

### ❌ "Error ejecutando consulta: ..."
💡 **Causa:** Problema de conexión o credenciales incorrectas.
✅ **Solución:** Revisa que los datos en **Credentials** sean correctos.

## 📜 Licencia
Este proyecto está bajo la licencia **MIT**.

---
**Autor:** Ricardo Aburto  
📧 r.ricardo.aburtojara@gmail.com
**Autor:** Patricio Palma 
📧 patricio.r.palma.m@gmail.com

