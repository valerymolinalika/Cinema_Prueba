var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');

var router = express.Router();

const { pool, connect } = require('./db_pool_connect');

router.post('/', async function (req, res, next) {
    try {
        const { id, first_name, last_name, email, phone, available, user_password } = req.body;

        if (!id || !first_name || !last_name || !email || !available || !user_password) {
            return res.status(400).send('Missing required fields');
        }

        const checkUserQuery = `SELECT * FROM users WHERE email = $1 OR id = $2`;
        const existingUser = await pool.query(checkUserQuery, [email, id]);

        if (existingUser.rows.length > 0) {
            return res.status(400).send('User with this email or ID already exists');
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);

        const insertUserQuery = `
            INSERT INTO users (id, first_name, last_name, email, phone, available, user_password)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        await pool.query(insertUserQuery, [id, first_name, last_name, email, phone, available, hashedPassword]);

        res.status(201).send('User created successfully');
    } catch (error) {
        console.error('Error while creating user:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Ruta para obtener todos los usuarios excepto la contraseña
router.get('/', async function (req, res, next) {
    try {
        const getUsersQuery = `
            SELECT id, first_name, last_name, email, phone, available
            FROM users
        `;
        const users = await pool.query(getUsersQuery);
        res.status(200).json(users.rows);
    } catch (error) {
        console.error('Error while fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para editar información de un usuario
router.put('/edit/:id', async function (req, res, next) {
    try {
        const { id } = req.params; // ID del usuario a editar
        const { first_name, last_name, email, phone, available } = req.body;

        const userCheckQuery = `SELECT * FROM users WHERE id = $1`;
        const userResult = await pool.query(userCheckQuery, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const updateUserQuery = `
            UPDATE users
            SET
                first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                email = COALESCE($3, email),
                phone = COALESCE($4, phone),
                available = COALESCE($5, available)
            WHERE id = $6
            RETURNING *;
        `;

        const updatedUser = await pool.query(updateUserQuery, [
            first_name,
            last_name,
            email,
            phone,
            available,
            id,
        ]);

        res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser.rows[0],
        });
    } catch (error) {
        console.error('Error while updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ruta para actualizar el estado de 'available' de un usuario
router.put('/available', async function (req, res, next) {
    try {
        const { id, available } = req.body;

        if (!id || available === undefined) {
            return res.status(400).send('Missing required fields: id and available');
        }

        const updateAvailableQuery = `
            UPDATE users
            SET available = $1
            WHERE id = $2
        `;

        const result = await pool.query(updateAvailableQuery, [available, id]);

        if (result.rowCount === 0) {
            return res.status(404).send('User not found');
        }

        res.status(200).send('User availability updated successfully');
    } catch (error) {
        console.error('Error while updating user availability:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Ruta para validar un usuario con email y contraseña, verificando el estado de available
router.post('/login', async function (req, res, next) {
    try {
        const { email, user_password } = req.body;

        if (!email || !user_password) {
            return res.status(400).send('Missing required fields: email and user_password');
        }

        const getUserQuery = `
            SELECT id, first_name, last_name, email, phone, available, user_password
            FROM users
            WHERE email = $1
        `;
        const result = await pool.query(getUserQuery, [email]);

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = result.rows[0];

        if (!user.available) {
            return res.status(403).send('User is not available to log in');
        }

        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid credentials');
        }

        const { id, first_name, last_name, phone } = user;
        res.status(200).json({ id, first_name, last_name, email, phone, available: user.available });
    } catch (error) {
        console.error('Error while validating user:', error);
        res.status(500).send('Internal Server Error');
    }
});



module.exports = router;