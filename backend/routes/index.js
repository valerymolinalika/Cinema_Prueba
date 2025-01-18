var express = require('express');
var router = express.Router();

/* GET home page. */
/**
 * Description
 * Defines a router for handling requests to the root URL ('/') of the application.
 * When a GET request is made to the root URL, it renders the 'index' view with the title set to 'Express'.
 * 
 * Dependencies
 * This function depends on the 'express' module to create a router.
 * 
 * Parameters
 * - `req`: The HTTP request object.
 * - `res`: The HTTP response object.
 * - `next`: The next middleware function in the middleware stack.
 * 
 * Responses
 * - If a GET request is made to the root URL, it renders the 'index' view with the title set to 'Express'.
 * 
 */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;