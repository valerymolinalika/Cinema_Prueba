var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require("nodemailer");
const { pool } = require('./db_pool_connect');

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: "cinema202501@gmail.com",
    pass: process.env.GMAIL_ACCSESS,
  },
});


async function sendConfirmationEmail(userEmail, invoice_id, total_price, seats, function_id) {
  try {
    const info = await transporter.sendMail({
      from: 'cinema202501@gmail.com', 
      to: userEmail,
      subject: "Order Confirmation", 
      text: ``, 
      html: `
        <b>Your order is confirmed!</b><br><br>
        <b>Invoice ID:</b> ${invoice_id}<br>
        <b>Total Price:</b> $${total_price}<br>
        <b>Seats:</b> ${seats.join(", ")}<br>
      `,
    });
    console.log("Confirmation email sent: %s", userEmail);
  } catch (error) {
    console.error('Error while sending confirmation email:', error);
  }
}

// Ruta para comprar un ticket y generar una factura
router.post('/buy-ticket', async (req, res) => {
    const { user_id, function_id, seats, price_per_ticket } = req.body;

    if (!user_id || !function_id || !seats || !price_per_ticket) {
        return res.status(400).send('Missing required fields: user_id, function_id, seats, price_per_ticket');
    }

    const current_date = new Date(); // Obtener la fecha actual
    const total_price = price_per_ticket * seats.length; 

    try {
        // Obtener el correo del usuario a partir del user_id
        const userQuery = `SELECT email FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [user_id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        
        const userEmail = userResult.rows[0].email;

        const insertInvoiceQuery = `
            INSERT INTO invoice (total, date_invoice, ticket_count)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const invoiceResult = await pool.query(insertInvoiceQuery, [total_price, current_date, seats.length]);
        const invoice_id = invoiceResult.rows[0].id;

        for (let seat of seats) {
            const insertTicketQuery = `
                INSERT INTO ticket (user_id, function_id, seat, price, invoice_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            await pool.query(insertTicketQuery, [user_id, function_id, seat, price_per_ticket, invoice_id]);
        }

        await sendConfirmationEmail(userEmail, invoice_id, total_price, seats, function_id);

        res.status(201).json({
            message: 'Tickets and invoice created successfully',
            invoice_id,
            tickets: seats,
            total_price,
            date: current_date
        });
    } catch (error) {
        console.error('Error while processing the ticket purchase:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/', async (req, res) => {
  try {
      const query = `
          SELECT 
              i.id AS invoice_id,
              u.id AS user_id,
              u.first_name || ' ' || u.last_name AS user_name,
              t.price AS price_per_ticket,
              i.total AS total_price,
              i.date_invoice AS purchase_date,
              ARRAY_AGG(t.seat) AS seats,
              m.title AS movie_title,
              mf.date_function AS function_date,
              mf.time_function AS function_time
          FROM invoice i
          JOIN ticket t ON t.invoice_id = i.id
          JOIN users u ON u.id = t.user_id
          JOIN movie_function mf ON t.function_id = mf.id
          JOIN movies m ON mf.movie_id = m.id
          GROUP BY 
              i.id, u.id, u.first_name, u.last_name, t.price, i.total, i.date_invoice, m.title, mf.date_function, mf.time_function
          ORDER BY i.date_invoice DESC;
      `;

      const result = await pool.query(query);

      res.status(200).json({
          invoices: result.rows
      });
  } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
