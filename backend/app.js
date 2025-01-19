const express = require('express');
const app = express();
const cors = require('cors');
const createError = require('http-errors');

app.use(
    cors({
        origin: '*',
    })
);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const movieFunctionRouter = require('./routes/movie_function');
const invoiceRouter = require('./routes/invoice');

// Configuración de middlewares globales
app.use(express.json()); // Esto es equivalente a bodyParser.json() en versiones modernas de Express.
app.use(express.urlencoded({ extended: true })); // Para analizar datos codificados en URL.

// Configuración de rutas
app.use('/', indexRouter); // Ruta raíz.
app.use('/users', usersRouter); // Usuarios.
app.use('/movies', moviesRouter); // Películas.
app.use('/movie_function', movieFunctionRouter); // Funciones de películas.
app.use('/invoice', invoiceRouter); // Facturas.

// Middleware para manejar rutas no encontradas
app.use(function (req, res, next) {
    next(createError(404)); // Ahora funcionará correctamente
});

// Middleware para manejar errores
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        error: {
            message: err.message,
            status: err.status || 500,
        },
    });
});

module.exports = app;
