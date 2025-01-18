var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var router = express.Router();

const { pool, connect } = require('./db_pool_connect');


// Ruta para agregar una nueva función
router.post('/add', async (req, res) => {
    const { movie_id, date_function, time_function, room_number, available_seats } = req.body;

    if (!movie_id || !date_function || !time_function || !room_number || !available_seats) {
        return res.status(400).send('Missing required fields: movie_id, date_function, time_function, room_number, available_seats');
    }

    try {
        // Insertar la nueva función en la base de datos
        const insertQuery = `
            INSERT INTO movie_function (movie_id, date_function, time_function, room_number, available_seats)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        
        const values = [movie_id, date_function, time_function, room_number, available_seats];

        const result = await pool.query(insertQuery, values);

        // Responder con los detalles de la nueva función
        res.status(201).json({
            message: 'Movie function added successfully',
            function: result.rows[0],
        });
    } catch (error) {
        console.error('Error while adding movie function:', error);
        res.status(500).send('Internal Server Error');
    }
});
