var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
const upload = require('./upload');
const { uploadToS3 } = require('./s3Upload');
const axios = require('axios');

var router = express.Router();

const { pool, connect } = require('./db_pool_connect');


//get all movies
router.get('/', async function (req, res, next) {
    try {
        const getMoviesQuery = `
            SELECT id, title, synopsis, rating, image_url, genre
            FROM movies
            WHERE available = true
        `;
        const movies = await pool.query(getMoviesQuery);
        res.status(200).json(movies.rows);
    } catch (error) {
        console.error('Error while fetching movies:', error);
        res.status(500).send('Internal Server Error');
    }
});

//get movie by id
router.get('/:id', async function (req, res, next) {
    try {
        const { id } = req.params;
        const getMovieQuery = `
            SELECT id, title, synopsis, rating, image_url, genre
            FROM movies
            WHERE id = $1
        `;
        const movie = await pool.query(getMovieQuery, [id]);

        if (movie.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }

        res.status(200).json(movie.rows[0]);
    } catch (error) {
        console.error('Error while fetching movie:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para agregar una nueva película
router.post('/add', async function (req, res, next) {
    try {
        const { title, synopsis, rating, image_url, available, genre, administrator_id } = req.body;

        if (!title || !synopsis || !rating || !administrator_id) {
            return res.status(400).send('Missing required fields: title, synopsis, rating, administrator_id');
        }

        const adminCheckQuery = `SELECT id FROM administrator WHERE id = $1`;
        const adminResult = await pool.query(adminCheckQuery, [administrator_id]);

        if (adminResult.rows.length === 0) {
            return res.status(404).send('Administrator not found');
        }

        const imageResponse = await axios.get(image_url, { responseType: 'stream' });

        const fileName = `images/${Date.now()}-${title}.jpg`; // Nombre único para cada archivo
        const s3Result = await uploadToS3(imageResponse.data, fileName);

        const insertMovieQuery = `
            INSERT INTO movies (title, synopsis, rating, image_url, available, genre, administrator_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const newMovie = await pool.query(insertMovieQuery, [title, synopsis, rating, s3Result, available, genre, administrator_id]);

        res.status(201).json({
            message: 'Movie added successfully',
            movie: newMovie.rows[0],
        });
    } catch (error) {
        console.error('Error while adding movie:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para editar una película
router.put('/edit/:id', async function (req, res, next) {
    try {
        const { id } = req.params; // ID de la película a editar
        const { title, synopsis, rating, image_url,available, genre } = req.body;

        const movieCheckQuery = `SELECT * FROM movies WHERE id = $1`;
        const movieResult = await pool.query(movieCheckQuery, [id]);

        if (movieResult.rows.length === 0) {
            return res.status(404).send('Movie not found');
        }

        let updatedImageUrl = movieResult.rows[0].image_url; // Mantener la URL actual si no se pasa una nueva

        if (image_url) {
            const imageResponse = await axios.get(image_url, { responseType: 'stream' });

            const fileName = `images/${Date.now()}-${title}.jpg`; 
            const s3Result = await uploadToS3(imageResponse.data, fileName);
            updatedImageUrl = s3Result;
        }

        const updateMovieQuery = `
            UPDATE movies
            SET
                title = COALESCE($1, title),
                synopsis = COALESCE($2, synopsis),
                rating = COALESCE($3, rating),
                image_url = $4,
                available = COALESCE($5, available),
                genre = COALESCE($6, genre)
            WHERE id = $7
            RETURNING *;
        `;

        const updatedMovie = await pool.query(updateMovieQuery, [
            title,
            synopsis,
            rating,
            updatedImageUrl,
            available,
            genre,
            id,
        ]);

        res.status(200).json({
            message: 'Movie updated successfully',
            movie: updatedMovie.rows[0],
        });
    } catch (error) {
        console.error('Error while updating movie:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;