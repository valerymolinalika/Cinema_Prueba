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
        const checkMovieQuery = `
            SELECT available 
            FROM movies 
            WHERE id = $1;
        `;
        const movieResult = await pool.query(checkMovieQuery, [movie_id]);

        if (movieResult.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }
        if (!movieResult.rows[0].available) {
            return res.status(400).send('Movie is not available');
        }

        const insertQuery = `
            INSERT INTO movie_function (movie_id, date_function, time_function, room_number, available_seats)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [movie_id, date_function, time_function, room_number, available_seats];

        const result = await pool.query(insertQuery, values);

        res.status(201).json({
            message: 'Movie function added successfully',
            function: result.rows[0],
        });
    } catch (error) {
        console.error('Error while adding movie function:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para obtener todas las funciones de una película por su ID
router.get('/movie/:movie_id', async (req, res) => {
    const { movie_id } = req.params;

    if (!movie_id) {
        return res.status(400).send('Missing required parameter: movie_id');
    }
    try {
        const getFunctionsQuery = `
            SELECT * 
            FROM movie_function 
            WHERE movie_id = $1;
        `;

        const result = await pool.query(getFunctionsQuery, [movie_id]);

        if (result.rows.length === 0) {
            return res.status(404).send('No functions found for the given movie ID');
        }

        res.status(200).json({
            message: 'Functions retrieved successfully',
            functions: result.rows,
        });
    } catch (error) {
        console.error('Error while fetching movie functions:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;