# Integración con Backend - ContabiliSync

## Configuración actualizada para tu Backend

### URL Base del API

```typescript
const API_URL = "http://localhost:5000/api"; // Cambiar por la URL de tu backend
```

### Endpoints implementados

#### Usuarios

- `GET /api/usuarios` - Listar todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/contadores` - Listar contadores disponibles
- `GET /api/usuarios/portipo/{tipo}` - Usuarios por tipo
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

#### Autenticación

- `POST /api/auth/login` - Iniciar sesión (pendiente de implementar en backend)

### Estructura de datos

#### Usuario

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string; // Solo para registro/actualización
  tipo: TipoUsuario;
  telefono?: string;
  especialidad?: string; // Solo para contadores
  numeroLicencia?: string; // Solo para contadores
}
```

#### Tipos de Usuario

```typescript
enum TipoUsuario {
  CONTRIBUYENTE = "contribuyente",
  CONTADOR = "contador",
  ADMINISTRADOR = "administrador",
}
```

### Servicios actualizados

1. **UsuarioService**: Maneja todas las operaciones CRUD de usuarios
2. **AuthService**: Maneja autenticación y gestión de sesiones

### Componentes actualizados

1. **LoginComponent**: Usa AuthService para autenticación
2. **RegisterComponent**: Usa AuthService para registro de nuevos usuarios

### Interceptores configurados

1. **AuthInterceptor**: Añade el token Bearer a las requests automáticamente
2. **ErrorInterceptor**: Maneja errores de API globalmente
3. **LoadingInterceptor**: Gestiona estados de carga

### Configuración necesaria en el Backend

Para que el frontend funcione correctamente, el backend necesita:

1. **Endpoint de autenticación**: `POST /api/auth/login`

   ```json
   // Request
   {
     "email": "usuario@ejemplo.com",
     "password": "password123"
   }

   // Response
   {
     "token": "jwt_token_aqui",
     "usuario": {
       "id": 1,
       "nombre": "Usuario Test",
       "email": "usuario@ejemplo.com",
       "tipo": "contribuyente"
     }
   }
   ```

2. **CORS configurado** para permitir requests desde el frontend

3. **Validación de JWT** en endpoints protegidos

4. **Middleware de autenticación** que valide el token Bearer

### Variables de entorno

Crear un archivo `environment.ts` para manejar diferentes URLs:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api",
};
```

### Pruebas de integración

Para probar la integración:

1. Asegurar que el backend esté corriendo en la URL configurada
2. Verificar que los endpoints respondan correctamente
3. Probar el flujo completo de registro → login → acceso a dashboards

### Manejo de errores

Los servicios manejan automáticamente:

- Errores 400: Datos inválidos
- Errores 401: No autorizado / Credenciales incorrectas
- Errores 404: Usuario no encontrado
- Errores 409: Email ya registrado
- Errores 500: Error interno del servidor

### Navegación por roles

Después del login, los usuarios son redirigidos según su tipo:

- **Administrador**: `/admin/dashboard`
- **Contador**: `/contador/dashboard`
- **Contribuyente**: `/contribuyente/dashboard`
