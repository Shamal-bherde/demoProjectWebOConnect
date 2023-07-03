// uploadMiddleware.js
const UsersDetails = require('../model/UsersDetails')
const multer = require('multer');

// Define the storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination directory for the uploaded files
    cb(null, '../frontend/public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage }).single('profilePic');
console.log(upload);
// Middleware function to handle file upload
exports.uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err.message });
      return;
    }
    next(); // Proceed to the next middleware or route handler
  });
};
