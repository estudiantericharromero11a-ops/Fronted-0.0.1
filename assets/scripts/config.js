// Configuración básica del API base
// Cambia la URL si tu servidor corre en otro lugar
const API_BASE = 'http://localhost:8001';  // CAMBIA AL PUERTO DE TU API FASTAPI

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
    telefono: 'telefono'        // varchar(20)
};

// MATERIAS: asignaturas
const MATERIAS_FIELDS = {
    nombre: 'nombre',           // varchar(100)
    creditos: 'creditos',       // integer
    descripcion: 'descripcion'  // text
};

// PROGRAMAS: carreras académicas
const PROGRAMAS_FIELDS = {
    nombre: 'nombre',           // varchar(100)
    tipo_programa: 'tipo_programa', // varchar(50)
    duracion_semestres: 'duracion_semestres' // integer
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
    descripcion: 'descripcion'  // text
};

// ROLES: tipos de usuario
const ROLES_FIELDS = {
    nombre_rol: 'nombre_rol',   // varchar(50), NOT NULL
    descripcion: 'descripcion'  // text
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
    id_materia: 'id_materia'            // integer, FK a materias
    // semestre eliminado: no existe en la BD
};

// ASIGNACION_INSTALACIONES: asignación de instalaciones a campus
const ASIGNACION_INSTALACIONES_FIELDS = {
    id_instalacion: 'id_instalacion',   // integer, FK a instalaciones
    id_materia: 'id_materia',           // integer, FK a materias
    dia_semana: 'dia_semana',           // varchar(20)
    // hora_inicio / hora_fin eliminados: no existen en la base de datos
    id_persona: 'id_persona'            // integer, FK a personas
};

// BLOQUES: bloques/edificios
const BLOQUES_FIELDS = {
    nombre: 'nombre',           // varchar(100), NOT NULL
    descripcion: 'descripcion', // text
    id_campus: 'id_campus'      // integer, FK a campus
};

// AREAS_FUNCIONALES: áreas funcionales
const AREAS_FUNCIONALES_FIELDS = {
    nombre_area: 'nombre_area',   // varchar(100), NOT NULL
    descripcion: 'descripcion'    // text
};

// HORARIOS_INSTALACION: horarios de instalaciones
const HORARIOS_INSTALACION_FIELDS = {
    id_instalacion: 'id_instalacion', // integer, FK a instalaciones
    dia_semana: 'dia_semana',         // varchar(20)
    hora_apertura: 'hora_apertura',   // time
    hora_cierre: 'hora_cierre'        // time
};

// ESTADO_INSTALACION: estados de instalaciones
const ESTADO_INSTALACION_FIELDS = {
    nombre_estado: 'nombre_estado',     // varchar(50), NOT NULL
    descripcion: 'descripcion'          // text
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





