# Sistema Universitario - Gestión Frontend

Un sistema de gestión universitaria desarrollado con tecnologías web frontend para administrar datos académicos, personas, instalaciones y más.

## Descripción

Este proyecto es una interfaz de usuario completa para un sistema de gestión universitaria que permite a administradores y usuarios consultar y gestionar información relacionada con entidades académicas. El sistema está dividido en tres interfaces principales: login, panel de administrador y panel de usuario, cada uno con funcionalidades específicas adaptadas a los roles.

## Arquitectura General del Sistema

El sistema universitario completo consta de tres componentes principales:

### 1. Frontend (Este Proyecto)
- **Interfaz Web**: HTML/CSS/JavaScript puro con Bootstrap
- **Autenticación JWT**: Login seguro con tokens
- **Gestión CRUD**: Operaciones completas para administradores
- **Consulta de Datos**: Vista de solo lectura para usuarios
- **Agente de IA**: Interfaz integrada para consultas inteligentes

### 2. Backend API REST
- **Base de Datos**: PostgreSQL con pgvector para IA
- **API RESTful**: Endpoints para todas las entidades
- **Autenticación**: Validación de JWT tokens
- **Consultas SQL**: Generación automática desde lenguaje natural

### 3. Sistema de IA (THANIA IA)
- **Procesamiento de Lenguaje Natural**: Conversión de consultas en SQL
- **Embeddings Vectoriales**: Búsqueda semántica en la base de datos
- **Modelos de IA**: Transformers y Sentence Transformers
- **Integración**: Conexión directa con el backend

## Guía Completa de Instalación y Configuración

### Prerrequisitos del Sistema
- **Python 3.8+**: Para el backend y servidor local
- **PostgreSQL 12+**: Base de datos con extensión pgvector
- **Node.js** (opcional): Para desarrollo avanzado
- **Navegador Moderno**: Chrome 60+, Firefox 55+, Edge 79+

### Paso 1: Preparar el Entorno

#### Instalar Python y Dependencias
```bash
# Verificar Python
python --version

# Instalar dependencias del backend (si tienes el proyecto backend)
pip install -r requirements.txt
```

#### Configurar PostgreSQL
```sql
-- Crear base de datos
CREATE DATABASE universidad_db;

-- Instalar extensión pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Crear usuario para la aplicación
CREATE USER app_user WITH PASSWORD 'tu_password_seguro_aqui';
GRANT ALL PRIVILEGES ON DATABASE universidad_db TO app_user;
```

### Paso 2: Configurar el Backend

#### Clonar y Configurar Backend
```bash
# Clonar el proyecto backend (THANIA IA)
git clone <url-backend-repo>
cd thania-ia-backend

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones de BD y credenciales seguras
```

#### Ejecutar Migraciones de Base de Datos
```bash
# Ejecutar script de inicialización de BD
python scripts/init_database.py

# Verificar instalación
python scripts/verify_versions.py
```

#### Iniciar el Backend
```bash
# Opción 1: Desarrollo
python app.py

# Opción 2: Producción con Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Paso 3: Configurar el Frontend

#### Clonar y Preparar Frontend
```bash
# Clonar este proyecto frontend
git clone <url-frontend-repo>
cd "Fronted 1.2.2"

# Verificar estructura
ls -la
```

#### Configurar Conexión con Backend
```javascript
// En assets/scripts/config.js
const API_PORTS = [8000, 8001, 8002, 8003, 8004]; // Puertos donde corre el backend
const API_HOST = 'http://127.0.0.1';
```

#### Iniciar Servidor Frontend
```bash
# Opción 1: Usando el script incluido
./start_frontend.bat

# Opción 2: Python manual
python -m http.server 3000

# Opción 3: Node.js
npx http-server -p 3000
```

### Paso 4: Verificar Conexiones

#### Probar Backend Independiente
```bash
# Verificar que el backend responde
curl http://localhost:8000/personas/

# Probar autenticación
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"tu_password_admin"}'
```

#### Probar Frontend Independiente
- Abrir `http://localhost:3000/index.html` en el navegador
- Verificar que carga sin errores de red
- Intentar login (debería fallar si backend no está corriendo)

#### Probar Integración Completa
1. **Backend corriendo** en puerto 8000
2. **Frontend corriendo** en puerto 3000
3. **Abrir** `http://localhost:3000/index.html`
4. **Login exitoso** → Redirección automática según rol
5. **Funciones CRUD** → Operaciones en base de datos
6. **Agente IA** → Consultas en lenguaje natural

### Paso 5: Configurar el Sistema de IA

#### Preparar Modelos de IA
```bash
# El backend debería descargar modelos automáticamente
# Verificar en logs del backend:
# - sentence-transformers modelo cargado
# - Ollama disponible (opcional)
```

#### Probar Consultas de IA
```bash
# Desde el frontend: acceder a aiagent.html
# Probar consultas como:
# "Mostrar todas las personas"
# "Cuántos estudiantes hay por programa"
# "Profesores con más horas de clase"
```

## Funcionamiento Integrado del Sistema

### Flujo de Datos Completo

1. **Usuario accede** → `http://localhost:3000/index.html`
2. **Login** → Frontend envía credenciales al backend
3. **Backend valida** → Consulta PostgreSQL con hash bcrypt
4. **JWT generado** → Token devuelto al frontend
5. **Sesión activa** → Frontend almacena token en localStorage
6. **Navegación** → Auth-guard verifica token en cada página
7. **Operaciones CRUD** → Frontend ↔ Backend ↔ PostgreSQL
8. **Consultas IA** → Lenguaje natural → SQL → Resultados

### Roles y Permisos

- **Administrador** (`admin`):
  - Acceso completo a CRUD
  - Gestión de usuarios y roles
  - Configuración del sistema
  - Panel: `admin.html`

- **Usuario** (`user`):
  - Solo lectura de datos
  - Consultas limitadas
  - Panel: `user.html`

- **Agente IA** (`aiagent`):
  - Consultas inteligentes
  - Generación automática de SQL
  - Panel: `aiagent.html`

### Seguridad y Credenciales

**⚠️ IMPORTANTE**: Antes de usar el sistema en producción:

1. **Cambia todas las contraseñas por defecto** en la base de datos
2. **Configura variables de entorno** para credenciales sensibles
3. **Usa contraseñas fuertes** para usuarios admin
4. **Configura HTTPS** en producción
5. **Revisa permisos de base de datos** según el principio de menor privilegio

**Ejemplo de usuarios iniciales** (cambiar contraseñas):
- `admin` / `tu_password_seguro_admin`
- `user` / `tu_password_seguro_user`
- `aiagent` / `tu_password_seguro_aiagent`

## Funcionamiento del Sistema

### Flujo de Usuario
1. **Autenticación**: El usuario accede a `index.html` y selecciona su rol (Administrador o Usuario)
2. **Redirección**: Según el rol, se redirige a `admin.html` o `user.html`
3. **Interacción**:
   - Administradores pueden crear, leer, actualizar y eliminar (CRUD) datos
   - Usuarios solo pueden consultar datos (solo lectura)
4. **API Communication**: Todas las operaciones se realizan mediante llamadas HTTP a un backend REST API

### Arquitectura
- **Frontend Puro**: HTML, CSS, JavaScript sin frameworks de JS (excepto Bootstrap para estilos)
- **Separación de Concerns**: HTML para estructura, CSS para estilos, JS para lógica
- **Modularidad**: Cada entidad tiene su propio archivo JS
- **Responsividad**: Diseño adaptativo usando Bootstrap Grid System

## Características Detalladas

### Panel de Administrador (admin.html)
- **Gestión CRUD Completa**: Crear, editar, eliminar registros de todas las entidades
- **Estadísticas en Tiempo Real**: Contadores dinámicos que se actualizan al cargar datos
- **Interfaz con Pestañas**: Navegación organizada por módulos usando Bootstrap Tabs
- **Formularios Modales**: Diálogos emergentes para operaciones de creación/edición
- **Validación de Datos**: Verificación básica en formularios antes de envío
- **Feedback Visual**: Mensajes de éxito/error, indicadores de carga

### Panel de Usuario (user.html)
- **Consulta de Solo Lectura**: Visualización completa de datos sin posibilidad de modificación
- **Estadísticas de Resumen**: Vista general de conteos por entidad
- **Navegación por Pestañas**: Acceso organizado a diferentes secciones de datos
- **Búsqueda y Filtrado**: Funcionalidades básicas de consulta (implementadas en algunos módulos)

### Página de Login (index.html)
- **Autenticación por Roles**: Selección entre Administrador y Usuario
- **Interfaz Minimalista**: Diseño centrado en la usabilidad
- **Validación Básica**: Campos requeridos y formato de entrada
- **Redirección Automática**: Navegación directa al panel correspondiente

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica con elementos como `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`
- **CSS3**: Estilos personalizados con variables CSS, flexbox y grid
- **Bootstrap 5.3.8**: Framework CSS para componentes responsivos, utilidades y JavaScript plugins
- **JavaScript (ES6+)**:
  - Funciones asíncronas con `async/await`
  - Fetch API para llamadas HTTP
  - Manipulación del DOM
  - Event listeners y delegación de eventos
- **Font Awesome/Icons**: Iconografía integrada (posiblemente vía Bootstrap o enlaces externos)

## Estructura Completa del Proyecto

```
Fronted 1.2.2/
├── README.md                    # Documentación del proyecto
├── .env.example                 # Variables de entorno (plantilla)
├── .gitignore                   # Archivos a ignorar en Git
├── admin.html                   # Panel principal de administración
├── index.html                   # Página de inicio y login
├── user.html                    # Panel de consulta para usuarios
├── aiagent.html                 # Panel de agente de IA (opcional)
├── start_frontend.bat           # Script para iniciar servidor local
└── assets/
    ├── docs/                    # Documentación adicional
    ├── Images/
    │   ├── favicon.png          # Icono del sitio web
    │   └── [otras imágenes]     # Imágenes del proyecto
    ├── scripts/
    │   ├── _TEMPLATE.js         # Plantilla para nuevos scripts
    │   ├── aiagent.js           # Funciones del agente de IA
    │   ├── areas_funcionales.js # Gestión de áreas funcionales
    │   ├── asignacion_instalaciones.js # Asignaciones de instalaciones
    │   ├── auth-guard.js        # Protección de rutas con autenticación
    │   ├── auth.js              # Servicio de autenticación JWT
    │   ├── bloques.js           # Gestión de bloques del campus
    │   ├── campus-admin-fix.js  # Correcciones específicas del campus
    │   ├── campus.js            # Gestión de campus
    │   ├── components.js        # Componentes reutilizables
    │   ├── config.js            # Configuración global (URLs API, constantes)
    │   ├── estado_instalacion.js # Estados de instalaciones
    │   ├── horarios_instalacion.js # Horarios de instalaciones
    │   ├── instalaciones.js     # Gestión de instalaciones
    │   ├── login.js             # Lógica de autenticación y login
    │   ├── main.js              # Funciones principales y utilitarias
    │   ├── materias.js          # Gestión de materias académicas
    │   ├── persona_rol.js       # Asignación de roles a personas
    │   ├── personas.js          # Gestión de personas (estudiantes, docentes)
    │   ├── programa_materia.js  # Asignación de materias a programas
    │   ├── programas.js         # Gestión de programas académicos
    │   ├── roles.js             # Gestión de roles del sistema
    │   ├── user.js              # Funciones específicas del panel usuario
    │   └── utils.js             # Utilidades generales
    ├── styles/
    │   ├── aiagent.css          # Estilos específicos del agente de IA
    │   └── styles.css           # Estilos personalizados
    └── video/                   # Archivos multimedia (videos)
```

## Funciones de los Archivos JavaScript

### Archivos Core
- **`config.js`**: Contiene la configuración base del sistema
  - URLs de la API backend
  - Constantes globales
  - Configuración de endpoints

- **`main.js`**: Funciones principales del sistema
  - Inicialización de componentes
  - Funciones de utilidad compartidas
  - Manejo de eventos globales

- **`utils.js`**: Utilidades generales
  - Funciones helper para manipulación de DOM
  - Validaciones comunes
  - Formateo de datos

- **`login.js`**: Manejo de la autenticación
  - Validación de formularios de login
  - Redirección según rol seleccionado
  - Gestión de estado de sesión básico

### Autenticación y Seguridad
- **`auth.js`**: Servicio de autenticación JWT
  - Login contra backend
  - Gestión de tokens JWT
  - Verificación de validez de sesión

- **`auth-guard.js`**: Protección de rutas
  - Verificación de autenticación al acceder a páginas
  - Redirección automática si no hay sesión válida
  - Validación de tokens en backend

### Archivos por Entidad (Admin)
Cada archivo maneja una entidad específica con operaciones CRUD:

- **`personas.js`**: Gestión de personas
  - Cargar, crear, editar, eliminar personas
  - Validación de datos personales
  - Interfaz de tabla con acciones

- **`materias.js`**: Gestión de materias académicas
  - CRUD de asignaturas
  - Gestión de créditos y descripciones
  - Asociación con programas

- **`programas.js`**: Gestión de programas de estudio
  - Administración de programas académicos
  - Configuración de duración y tipo

- **`instalaciones.js`**: Gestión de instalaciones físicas
  - CRUD de aulas, laboratorios, etc.
  - Asociación con bloques y áreas

- **`campus.js`**: Gestión de campus universitarios
  - Administración de sedes
  - Información de ubicación y descripción

- **`roles.js`**: Gestión de roles del sistema
  - Definición de roles (admin, docente, estudiante)
  - Permisos asociados

### Archivos de Relaciones (Puente)
- **`persona_rol.js`**: Asignación de roles a personas
  - Asociación many-to-many entre personas y roles

- **`programa_materia.js`**: Asignación de materias a programas
  - Asociación many-to-many entre programas y materias

- **`asignacion_instalaciones.js`**: Asignaciones complejas
  - Asociación de instalaciones con materias, horarios y personas
  - Gestión de horarios académicos

### Archivos de Catálogos
- **`bloques.js`**: Gestión de bloques físicos
  - Organización de instalaciones por bloques
  - Asociación con campus

- **`areas_funcionales.js`**: Áreas funcionales
  - Clasificación de espacios (aulas, laboratorios, oficinas)

- **`horarios_instalacion.js`**: Horarios de instalaciones
  - Definición de horarios de apertura/cierre
  - Asociación con instalaciones específicas

- **`estado_instalacion.js`**: Estados de instalaciones
  - Estados posibles (disponible, mantenimiento, ocupado)

### Archivos Específicos
- **`campus-admin-fix.js`**: Correcciones específicas para el módulo campus
  - Soluciones a bugs particulares
  - Funcionalidades adicionales

- **`user.js`**: Funciones del panel usuario
  - Carga de datos en modo solo lectura
  - Navegación y filtros para usuarios

- **`aiagent.js`**: Funciones del agente de IA
  - Interfaz de conversación con IA
  - Procesamiento de consultas

- **`components.js`**: Componentes reutilizables
  - Elementos UI compartidos
  - Funciones de renderizado

- **`_TEMPLATE.js`**: Plantilla para nuevos módulos
  - Estructura base para implementar nuevas entidades
  - Ejemplo de buenas prácticas

## Instalación y Configuración

### Prerrequisitos
- Navegador web moderno con soporte ES6+ (Chrome 60+, Firefox 55+, Safari 11+, Edge 79+)
- Servidor web local para evitar restricciones CORS
- Backend API corriendo (ver sección API)

### Pasos de Instalación

1. **Clona o descarga el proyecto:**
   ```bash
   git clone <url-del-repositorio>
   cd "Fronted 1.2.2"
   ```

2. **Configura el backend:**
   - Verifica que el backend esté ejecutándose
   - Actualiza `assets/scripts/config.js` con la URL correcta del API
   - Asegura compatibilidad de endpoints

3. **Sirve los archivos estáticos:**
   ```bash
   # Opción 1: Python (recomendado)
   python -m http.server 3000

   # Opción 2: Node.js con http-server
   npx http-server -p 3000

   # Opción 3: PHP
   php -S localhost:3000
   ```

4. **Accede al sistema:**
   - Abre `http://localhost:3000/index.html` en tu navegador

## Uso del Sistema

### Para Administradores
1. **Login**: Selecciona "Iniciar como Administrador"
2. **Navegación**: Usa las pestañas superiores para cambiar entre módulos
3. **Operaciones CRUD**:
   - **Crear**: Botón "Agregar [Entidad]" → Llena el formulario modal
   - **Leer**: Datos se cargan automáticamente en tablas
   - **Actualizar**: Botón "Editar" en fila correspondiente
   - **Eliminar**: Botón "Eliminar" con confirmación
4. **Estadísticas**: Revisa los contadores en la parte superior

### Para Usuarios
1. **Login**: Selecciona "Iniciar como Usuario"
2. **Consulta**: Navega por pestañas para ver datos
3. **Recarga**: Usa botones "Recargar" para actualizar información
4. **Solo Lectura**: No hay opciones de modificación

## Autenticación JWT

El sistema implementa autenticación basada en JSON Web Tokens (JWT):

- **Login**: Envío de credenciales (username/password) al backend
- **Token Storage**: Almacenamiento seguro en localStorage
- **Verificación**: Validación automática de tokens en páginas protegidas
- **Logout**: Invalidación de sesión y limpieza de datos locales

## API Integration

### Endpoints REST
El sistema se comunica con un backend RESTful API. Endpoints documentados:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/auth/login` | POST | Autenticación de usuarios |
| `/auth/logout` | POST | Cierre de sesión |
| `/auth/verify-header` | GET | Verificación de token |
| `/personas/` | GET, POST, PUT, DELETE | Gestión de personas |
| `/materias/` | GET, POST, PUT, DELETE | Gestión de materias |
| `/programas/` | GET, POST, PUT, DELETE | Gestión de programas |
| `/instalaciones/` | GET, POST, PUT, DELETE | Gestión de instalaciones |
| `/campus/` | GET, POST, PUT, DELETE | Gestión de campus |
| `/roles/` | GET, POST, PUT, DELETE | Gestión de roles |
| `/persona_rol/` | GET, POST, PUT, DELETE | Asignaciones persona-rol |
| `/programa_materia/` | GET, POST, PUT, DELETE | Asignaciones programa-materia |
| `/asignacion_instalaciones/` | GET, POST, PUT, DELETE | Asignaciones complejas |
| `/bloques/` | GET, POST, PUT, DELETE | Gestión de bloques |
| `/areas_funcionales/` | GET, POST, PUT, DELETE | Gestión de áreas |
| `/horarios_instalacion/` | GET, POST, PUT, DELETE | Horarios de instalaciones |
| `/estado_instalacion/` | GET, POST, PUT, DELETE | Estados de instalaciones |

### Formato de Datos
- **Request**: JSON con campos específicos por entidad
- **Response**: JSON con datos o mensajes de error
- **Autenticación**: Bearer token en headers para endpoints protegidos

## Desarrollo y Contribución

### Estructura de Código
- **Convenciones**: camelCase para variables, PascalCase para constructores
- **Modularidad**: Un archivo JS por entidad para mantener organización
- **Comentarios**: Código bien documentado con JSDoc donde aplica
- **Error Handling**: Try-catch en llamadas API, validaciones de entrada

### Agregar Nueva Entidad
1. Crear archivo `nueva_entidad.js` basado en `_TEMPLATE.js`
2. Implementar funciones CRUD
3. Agregar pestaña en HTML correspondiente
4. Actualizar navegación y estilos si necesario

### Debugging
- Usa `console.log()` para debugging
- Revisa Network tab en DevTools para llamadas API
- Verifica CORS headers si hay errores de conexión

## Compatibilidad y Requisitos

### Navegadores Soportados
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Requisitos del Sistema
- Conexión a internet para Bootstrap CDN
- Backend API accesible
- JavaScript habilitado

## Troubleshooting

### Problemas Comunes
1. **Favicon no aparece**: Verificar ruta relativa `assets/Images/favicon.png`
2. **API no responde**: Verificar URL en `config.js` y que backend esté corriendo
3. **Estilos no cargan**: Verificar conexión a internet para Bootstrap CDN
4. **Funciones no funcionan**: Revisar consola del navegador por errores JS

### Logs y Debugging
- Abre DevTools (F12) → Console para errores JavaScript
- Network tab para verificar llamadas API
- Application tab para localStorage/sessionStorage si aplica

## Contribución

**⚠️ SEGURIDAD**: Nunca commiteas archivos `.env` con credenciales reales. Usa `.env.example` como plantilla.

1. Fork el proyecto
2. Crea una rama descriptiva (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza cambios siguiendo las convenciones del código
4. Testea thoroughly en múltiples navegadores
5. Commit con mensajes descriptivos
6. Push y crea Pull Request

## Licencia

© 2026 Richar Romero. Todos los derechos reservados.

## Contacto

Para soporte técnico o consultas sobre el proyecto, contacta al desarrollador principal.</content>
<parameter name="filePath">c:\Users\Richar\Desktop\Fronted 0.01\README.md