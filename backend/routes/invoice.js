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
  secure: true, // true for port 465, false for other ports
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
    const total_price = price_per_ticket * seats.length; // Total de la compra

    try {
        // Obtener el correo del usuario a partir del user_id
        const userQuery = `SELECT email FROM users WHERE id = $1`;
        const userResult = await pool.query(userQuery, [user_id]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        
        const userEmail = userResult.rows[0].email;

        // Insertar la factura
        const insertInvoiceQuery = `
            INSERT INTO invoice (total, date_invoice, ticket_count)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const invoiceResult = await pool.query(insertInvoiceQuery, [total_price, current_date, seats.length]);
        const invoice_id = invoiceResult.rows[0].id;

        // Insertar tickets para cada silla
        for (let seat of seats) {
            const insertTicketQuery = `
                INSERT INTO ticket (user_id, function_id, seat, price, invoice_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `;
            await pool.query(insertTicketQuery, [user_id, function_id, seat, price_per_ticket, invoice_id]);
        }

        // Enviar correo de confirmación al usuario
        await sendConfirmationEmail(userEmail, invoice_id, total_price, seats, function_id);

        // Respuesta exitosa
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

module.exports = router;
