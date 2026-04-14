// FUNCIONES DE UTILIDAD GENERALES
// Funciones de utilidad generales
// Esta función verifica que la API responda
async function checkAPIConnection() {
    try {
        const response = await fetch(`${API_BASE}/${API_ENDPOINTS.personas}/`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Muestra alerta si hay problemas de conexión
async function showAPIStatus() {
    const isConnected = await checkAPIConnection();
    if (!isConnected) {
        alert(`No se puede conectar con la API. Asegúrate de que el servidor esté ejecutándose en ${API_BASE}`);
        console.error('API no disponible');
    }
}

// Utilidad para obtener valor de campo con varios formatos comunes
function getFieldValue(item, fieldName) {
    if (!item) return undefined;
    return item[fieldName];  // Acceso directo - punto.
}

function displayValue(value) {
    if (value === null || value === undefined) return '-';
    if (value === '') return '-';
    return String(value);
}

function findField(item, fieldNames) {
    if (item === null || item === undefined) return undefined;
    if (typeof item !== 'object') return undefined;

    for (const fieldName of fieldNames) {
        if (Object.prototype.hasOwnProperty.call(item, fieldName)) {
            const value = item[fieldName];
            if (value !== undefined && value !== null) {
                return value;
            }
        }
    }

    return undefined;
}

function findFieldBySubstring(item, substrings) {
    if (item === null || item === undefined) return undefined;
    if (typeof item !== 'object') return undefined;

    const lowerKeys = Object.keys(item).map(key => ({ key, lower: key.toLowerCase() }));
    for (const substring of substrings) {
        for (const entry of lowerKeys) {
            if (entry.lower.includes(substring.toLowerCase())) {
                const value = item[entry.key];
                if (value !== undefined && value !== null) {
                    return value;
                }
            }
        }
    }

    return undefined;
}

function hasAnyField(item, fieldNames) {
    if (item === null || item === undefined) return false;
    if (typeof item !== 'object') return false;

    return fieldNames.some(name => item[name] !== undefined && item[name] !== null);
}

function hasCampusAuditFields(item) {
    return hasAnyField(item, [
        'estado', 'id_estado', 'estado_id', 'created_at', 'updated_at', 'created', 'updated',
        'fecha_creacion', 'fechaActualizacion', 'fecha_actualizacion', 'createdAt', 'updatedAt',
        'created_on', 'updated_on'
    ]);
}

function findFieldRecursive(item, fieldNames, substrings = [], visited = new Set(), depth = 5) {
    if (item === null || item === undefined) return undefined;
    if (typeof item !== 'object') return undefined;
    if (visited.has(item)) return undefined;
    visited.add(item);

    const direct = findField(item, fieldNames);
    if (direct !== undefined && direct !== null) {
        return direct;
    }

    const fuzzy = findFieldBySubstring(item, substrings);
    if (fuzzy !== undefined && fuzzy !== null) {
        return fuzzy;
    }

    if (depth <= 0) return undefined;

    if (Array.isArray(item)) {
        for (const child of item) {
            const found = findFieldRecursive(child, fieldNames, substrings, visited, depth - 1);
            if (found !== undefined && found !== null) {
                return found;
            }
        }
    } else {
        for (const key of Object.keys(item)) {
            const child = item[key];
            if (typeof child === 'object' && child !== null) {
                const found = findFieldRecursive(child, fieldNames, substrings, visited, depth - 1);
                if (found !== undefined && found !== null) {
                    return found;
                }
            }
        }
    }

    return undefined;
}

function formatEstado(value) {
    if (value === true || value === 1 || value === '1' || value === 'true') {
        return 'Activo';
    }
    if (value === false || value === 0 || value === '0' || value === 'false') {
        return 'Inactivo';
    }
    return displayValue(value);
}

function getEstado(item) {
    const aliasNames = [
        'estado', 'estado_id', 'estadoId', 'estado_nombre', 'estadoNombre',
        'Estado', 'EstadoId', 'EstadoNombre', 'Estado_Nombre', 'id_estado',
        'estado_campus', 'campus_estado', 'estadoCampus', 'estado_actual',
        'activo', 'is_active', 'active'
    ];
    const aliasSubstrings = ['estado', 'status', 'state', 'activo', 'active'];

    const value = findFieldRecursive(item, aliasNames, aliasSubstrings);
    if (value === undefined || value === null) {
        return displayValue(undefined);
    }

    if (typeof value === 'object') {
        const nested = findFieldRecursive(value, [
            'nombre', 'nombre_estado', 'estado', 'label', 'name', 'id', 'status', 'activo'
        ], ['nombre', 'estado', 'label', 'name', 'status', 'activo']);
        return formatEstado(nested !== undefined && nested !== null ? nested : value);
    }

    return formatEstado(value);
}

function getCreatedAt(item) {
    return displayValue(findFieldRecursive(item, [
        'created_at', 'createdAt', 'CreatedAt', 'created', 'created_on', 'createdOn', 'createdDate',
        'fecha_creacion', 'fechaCreacion', 'created_at_date',
        'fecha_creado', 'fechaCreado', 'fecha_registro', 'fechaRegistro',
        'fecha_creada', 'fechaCreada', 'timestamp'
    ], ['created', 'fecha_creacion', 'fechaCreado', 'fecha', 'creacion', 'registro', 'timestamp', 'time', 'created_on', 'createdon']));
}

function getUpdatedAt(item) {
    return displayValue(findFieldRecursive(item, [
        'updated_at', 'updatedAt', 'UpdatedAt', 'updated', 'updated_on', 'updatedOn', 'updatedDate',
        'fecha_actualizacion', 'fechaActualizacion', 'updated_at_date',
        'fecha_actualizado', 'fechaActualizado', 'fecha_modificacion', 'fechaModificacion', 'modified', 'modificado',
        'timestamp'
    ], ['updated', 'fecha_actualizacion', 'fechaActualizado', 'fecha', 'actualiz', 'modific', 'timestamp', 'time', 'updated_on', 'updatedon']));
}






