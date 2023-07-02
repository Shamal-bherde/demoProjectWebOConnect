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
    cb(null, file.originalname);
  }
});

const upload = multer({ storage }).single('profilepic');

// Middleware function to handle file upload
// exports.uploadMiddleware = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send({ error: err.message });
//       return;
//     }
//     next(); // Proceed to the next middleware or route handler
//   });
// };

exports.uploadMiddleware = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ error: err.message });
      return;
    }

    try {
      const { profilepic, path } = req.file;
      const userId = req.body.id; // Assuming you have a field in the request body for the user ID

      // Update the profilepic field for the user
      await UsersDetails.update({ profilepic: path }, { where: { id: userId } });

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: error.message });
    }
  });
};