// Configuración básica del API base con detección automática
let API_BASE = null;
const API_PORTS = [8000, 8001, 8002, 8003, 8004];
const API_HOST = 'http://127.0.0.1';

// Función para detectar automáticamente el puerto disponible
async function detectApiPort() {
    if (API_BASE) return API_BASE;

    // Verificar si se abre desde file:// (problema de CORS)
    if (window.location.protocol === 'file:') {
        console.warn(' ADVERTENCIA: Este archivo debe abrirse desde un servidor HTTP (http://localhost:8080), no directamente desde el explorador de archivos (file://).');
        const alertMsg = document.createElement('div');
        alertMsg.style.cssText = 'position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: #f87171; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-weight: bold;';
        alertMsg.textContent = ' Abre esta página desde un servidor HTTP (http://localhost:8080), no como archivo local';
        document.body.appendChild(alertMsg);
        return null;
    }

    // Buscar puerto disponible
    for (const port of API_PORTS) {
        try {
            const response = await fetch(`${API_HOST}:${port}/personas/`, {
                method: 'GET',
                cache: 'no-store'
            });
            if (response.ok) {
                API_BASE = `${API_HOST}:${port}`;
                console.log(`✓ API detectada en: ${API_BASE}`);
                return API_BASE;
            }
        } catch (error) {
            continue;
        }
    }

    console.error('✗ No se encontró API en los puertos 8000-8004');
    return null;
}


// Endpoints de la BD universitaria
const API_ENDPOINTS = {
    // Entidades principales (CRUD completo)
    personas: 'personas',           // Estudiantes, docentes, administrativos
    materias: 'materias',           // Asignaturas
    programas: 'programas',         // Carreras académicas
    instalaciones: 'instalaciones', // Aulas, laboratorios
    campus: 'campus',               // Sedes universitarias
    roles: 'roles',                 // Tipos de usuario
    bloques: 'bloques',             // Bloques/edificios
    areas_funcionales: 'areas_funcionales', // áreas funcionales
    horarios_instalacion: 'horarios_instalacion', // Horarios de instalaciones
    estado_instalacion: 'estado_instalacion', // Estados de instalaciones

    // Tablas puente (relaciones muchos a muchos)
    persona_rol: 'persona_rol',                 // Asignación de roles a personas
    programa_materia: 'programa_materia',       // Materias por programa
    asignacion_instalaciones: 'asignacion_instalaciones'  // Instalaciones por campus
};

// CAMPOS DE CADA TABLA (según tu esquema PostgreSQL)
// PERSONAS: estudiantes, docentes, administrativos
const PERSONAS_FIELDS = {
    nombre: 'nombre',           // varchar(100)
    documento: 'documento',     // varchar(20) - UNIQUE
    correo: 'correo',           // varchar(100)
    telefono: 'telefono',       // varchar(20)
    estado: 'estado'            // boolean
};

// MATERIAS: asignaturas
const MATERIAS_FIELDS = {
    nombre: 'nombre',           // varchar(100)
    creditos: 'creditos',       // integer
    descripcion: 'descripcion', // text
    estado: 'estado'            // boolean
};

// PROGRAMAS: carreras académicas
const PROGRAMAS_FIELDS = {
    nombre: 'nombre',           // varchar(100)
    tipo_programa: 'tipo_programa', // varchar(50)
    duracion_semestres: 'duracion_semestres', // integer
    estado: 'estado'            // boolean
};

// INSTALACIONES: aulas, laboratorios
const INSTALACIONES_FIELDS = {
    nombre: 'nombre',                       // varchar(100), NOT NULL
    tipo_instalacion: 'tipo_instalacion',  // varchar(50)
    piso: 'piso',                           // integer
    capacidad: 'capacidad',                 // integer
    id_bloque: 'id_bloque',                 // integer (FK)
    id_area: 'id_area',                     // integer (FK)
    id_estado: 'id_estado'                  // integer (FK)
};

// CAMPUS: sedes universitarias
const CAMPUS_FIELDS = {
    nombre: 'nombre',           // varchar(100), NOT NULL
    direccion: 'direccion',     // varchar(150)
    descripcion: 'descripcion', // text
    estado: 'estado'            // boolean
};

// ROLES: tipos de usuario
const ROLES_FIELDS = {
    nombre_rol: 'nombre_rol',   // varchar(50), NOT NULL
    descripcion: 'descripcion', // text
    estado: 'estado'            // boolean
};

// PERSONA_ROL: asignación de roles a personas
const PERSONA_ROL_FIELDS = {
    id_persona: 'id_persona',           // integer, FK a personas
    id_rol: 'id_rol'                    // integer, FK a roles
    // fecha_asignacion eliminado: no existe en la BD
};

// PROGRAMA_MATERIA: asignación de materias a programas
const PROGRAMA_MATERIA_FIELDS = {
    id_programa: 'id_programa',         // integer, FK a programas
    id_materia: 'id_materia',           // integer, FK a materias
    estado: 'estado'                    // boolean
};

// ASIGNACION_INSTALACIONES: asignación de instalaciones a campus
const ASIGNACION_INSTALACIONES_FIELDS = {
    id_instalacion: 'id_instalacion',   // integer, FK a instalaciones
    id_materia: 'id_materia',           // integer, FK a materias
    dia_semana: 'dia_semana',           // varchar(20)
    id_persona: 'id_persona',           // integer, FK a personas
    estado: 'estado'                    // boolean
};

// BLOQUES: bloques/edificios
const BLOQUES_FIELDS = {
    nombre: 'nombre',           // varchar(100), NOT NULL
    descripcion: 'descripcion', // text
    id_campus: 'id_campus',     // integer, FK a campus
    estado: 'estado'            // boolean
};

// AREAS_FUNCIONALES: áreas funcionales
const AREAS_FUNCIONALES_FIELDS = {
    nombre_area: 'nombre_area',   // varchar(100), NOT NULL
    descripcion: 'descripcion',   // text
    estado: 'estado'              // boolean
};

// HORARIOS_INSTALACION: horarios de instalaciones
const HORARIOS_INSTALACION_FIELDS = {
    id_instalacion: 'id_instalacion', // integer, FK a instalaciones
    dia_semana: 'dia_semana',         // varchar(20)
    hora_apertura: 'hora_apertura',   // time
    hora_cierre: 'hora_cierre',       // time
    estado: 'estado'                  // boolean
};

// ESTADO_INSTALACION: estados de instalaciones
const ESTADO_INSTALACION_FIELDS = {
    nombre_estado: 'nombre_estado',     // varchar(50), NOT NULL
    descripcion: 'descripcion',         // text
    estado: 'estado'                    // boolean
    // color eliminado: no existe en la BD
};

// CONSTANTES ADICIONALES
// Tipos de programa posibles
const TIPO_PROGRAMA_OPTIONS = [
    { value: 'pregrado', label: 'Pregrado' },
    { value: 'posgrado', label: 'Posgrado' },
    { value: 'diplomado', label: 'Diplomado' },
    { value: 'curso', label: 'Curso' }
];

// Tipos de instalación posibles
const TIPO_INSTALACION_OPTIONS = [
    { value: 'aula', label: 'Aula' },
    { value: 'laboratorio', label: 'Laboratorio' },
    { value: 'auditorio', label: 'Auditorio' },
    { value: 'biblioteca', label: 'Biblioteca' },
    { value: 'oficina', label: 'Oficina' }
];

// Estados de instalación posibles (si tienes tabla estado_instalacion)
const ESTADO_INSTALACION_OPTIONS = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'mantenimiento', label: 'Mantenimiento' }
];





