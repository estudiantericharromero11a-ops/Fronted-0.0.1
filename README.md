# Sistema Universitario - Gestión Frontend

Un sistema de gestión universitaria desarrollado con tecnologías web frontend para administrar datos académicos, personas, instalaciones y más.

## Descripción

Este proyecto es una interfaz de usuario completa para un sistema de gestión universitaria que permite a administradores y usuarios consultar y gestionar información relacionada con entidades académicas. El sistema está dividido en tres interfaces principales: login, panel de administrador y panel de usuario, cada uno con funcionalidades específicas adaptadas a los roles.

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
Fronted 0.01/
├── README.md                    # Documentación del proyecto
├── admin.html                   # Panel principal de administración
├── index.html                   # Página de inicio y login
├── user.html                    # Panel de consulta para usuarios
└── assets/
    ├── docs/                    # Documentación adicional
    ├── Images/
    │   ├── favicon.png          # Icono del sitio web
    │   └── [otras imágenes]     # Imágenes del proyecto
    ├── scripts/
    │   ├── _TEMPLATE.js         # Plantilla para nuevos scripts
    │   ├── areas_funcionales.js # Gestión de áreas funcionales
    │   ├── asignacion_instalaciones.js # Asignaciones de instalaciones
    │   ├── bloques.js           # Gestión de bloques del campus
    │   ├── campus-admin-fix.js  # Correcciones específicas del campus
    │   ├── campus.js            # Gestión de campus
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
   cd "Fronted 0.01"
   ```

2. **Configura el backend:**
   - Verifica que el backend esté ejecutándose
   - Actualiza `assets/scripts/config.js` con la URL correcta del API
   - Asegura compatibilidad de endpoints

3. **Sirve los archivos estáticos:**
   ```bash
   # Opción 1: Python (recomendado)
   python -m http.server 8000

   # Opción 2: Node.js con http-server
   npx http-server -p 8000

   # Opción 3: PHP
   php -S localhost:8000
   ```

4. **Accede al sistema:**
   - Abre `http://localhost:8000/index.html` en tu navegador

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

## API Integration

### Endpoints REST
El sistema se comunica con un backend RESTful API. Endpoints documentados:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
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
- **Autenticación**: Headers personalizados (si implementado en backend)

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