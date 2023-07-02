const express = require('express');

const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes/authRoutes');
const { createUserDetails } = require('./create-userDetails'); // Import the createUserDetails function

const app = express();
const port = 8081;

app.use(express.json());
app.use(bodyParser.json());

// Configure session middleware
app.use(
  session({
    secret: 'shreerama',
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/', routes);

app.listen(port, (err) => {
  if (err) {
    console.error('Error starting the server:', err);
  } else {
    console.log('Server started successfully on port', port);
  }
});
