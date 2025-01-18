const express = require('express');
const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

// Configuración de middlewares globales
app.use(express.json()); // Esto es equivalente a bodyParser.json() en versiones modernas de Express.
app.use(express.urlencoded({ extended: true })); // Para analizar datos codificados en URL.

// Configuración de rutas
app.use('/', indexRouter); // Ruta raíz.
app.use('/users', usersRouter); // Usuarios.
app.use('/movies', moviesRouter); // Películas.

// Manejo de errores
app.use(function (req, res, next) {
    next(createError(404)); // Crea un error 404 y pasa al manejador de errores.
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message; // Mensaje de error.
    res.locals.error = req.app.get('env') === 'development' ? err : {}; // Mostrar detalles solo en desarrollo.
    res.status(err.status || 500); // Código de estado HTTP.
    res.render('error'); // Renderizar página de error.
});

module.exports = app;
