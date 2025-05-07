# Biblioteca-TypeScript-React

## Descripción de la Aplicación
Sistema integral de gestión bibliotecaria desarrollado con TypeScript y React, diseñado para optimizar las operaciones diarias de bibliotecas de cualquier tamaño. Esta aplicación proporciona una interfaz moderna e intuitiva que permite a los usuarios del sistema administrar eficientemente el catálogo de libros, socios, préstamos y usuarios del sistema.

### Características Principales
- **Gestión de Catálogo**: Registro completo de libros con información detallada, incluyendo título, autor, ISBN, disponibilidad y
- **Administración de Socios**: Registro y seguimiento de socios, con gestión de sanciones.
- **Sistema de Préstamos**: Control de préstamos internos y externos, con seguimiento de fechas límite y notificaciones de vencimiento en pantalla.
- **Gestión de Usuarios**: Administración de permisos y roles para el personal de la biblioteca.
- **Búsqueda Avanzada**: Localización rápida de libros y socios mediante múltiples criterios de búsqueda.
- **Interfaz Responsiva**: Diseño adaptable para su uso en diferentes dispositivos.

## Tecnologías Utilizadas
### Frontend
- **Framework**: React
- **Lenguaje**: TypeScript
- **Estilos**: CSS/SCSS
- **Gestión de Estado**: Redux/Context API
- **Enrutamiento**: React Router
- **Estilizado**: Material-UI
- **Construcción**: Vite

### Backend
- **Lenguaje**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **ORM**: Mongoose
- **Autenticación**: JWT (JSON Web Tokens)

### Herramientas de Desarrollo
- **Control de Versiones**: Git
- **Linting**: ESLint
- **Formateo de Código**: Prettier

## Datos de Acceso
Para acceder a la aplicación, puedes utilizar las siguientes credenciales:

### Administrador
- **Usuario**: jperez
- **Contraseña**: 123456

### Bibliotecario (usuario regular)
- **Usuario**: cgentili
- **Contraseña**: 123456

## Instalación y Ejecución

```bash
# Clonar el repositorio
git clone https://github.com/nahuel1177/Biblioteca-TypeScript-React.git
cd Biblioteca-TypeScript-React

# Instalar dependencias
npm install

# Migrar datos a la base de datos
# En la carpeta back debe ejecutar el siguiente comando:
cd src && npx migrate up

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build```
