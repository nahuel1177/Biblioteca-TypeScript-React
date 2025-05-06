# Biblioteca-TypeScript-React

## Descripción de la Aplicación
Esta aplicación es un sistema de gestión de biblioteca desarrollado con TypeScript y React. Permite administrar el catálogo de libros, gestionar préstamos, devoluciones y usuarios. La aplicación facilita la búsqueda de libros por diferentes criterios, el seguimiento de préstamos activos y el mantenimiento de un registro de usuarios.

## Tecnologías Utilizadas
### Frontend
- **Framework**: React
- **Lenguaje**: TypeScript
- **Estilos**: CSS/SCSS
- **Gestión de Estado**: Redux/Context API
- **Enrutamiento**: React Router
- **Estilizado**: Styled Components/Material-UI
- **Construcción**: Webpack/Vite

### Backend
- **Lenguaje**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **ORM**: Sequelize
- **Autenticación**: JWT (JSON Web Tokens)
- **Migraciones**: Sequelize Migrations

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
# Instalar dependencias
npm install

# Migrar datos a la base de datos
# En la carpeta back debe ejecutar el siguiente comando:
cd src && npx migrate up

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build```
