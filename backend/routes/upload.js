const multer = require('multer');

//Multer configuration to handle in-memory file uploads
const storage = multer.memoryStorage(); // Save the file in memory
const upload = multer({ storage });

module.exports = upload;
