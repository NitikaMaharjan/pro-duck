require('dotenv').config();
const connectToMongo = require('./db'); // importing connectToMongo() function from db.js file
const express = require('express'); // importing express.js to create my own web server
// const cors = require('cors');

const app = express(); // creating my web server app (Express application object)
const frontend_url = process.env.FRONTEND_URL;

// use of cors library
// app.use(cors());

// manual cors setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', frontend_url);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,authtoken');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

connectToMongo(); // calling connectToMongo() function to establish connection with database mongoDB

app.use(express.json()); // it tells my web server app to automatically convert the incoming JSON string into JavaScript object so that my web server can easily access it using req.body

// Available routes
app.use('/api/auth', require('./routes/auth')); // loads your router from routes/auth.js, mounts it at /api/auth, so any route inside auth.js like: router.post('/', ...) becomes accessible at: POST http://localhost:5000/api/auth/
app.use('/api/notes', require('./routes/notes')); // if the request starts with '/api/notes', forward it to './routes/notes.js' to handle note related CRUD operation

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT; // defining port address(number) of my web server app where it will listen for incoming requests
  //starting my web server app and listening on the specified port 5000, once my web server is running, logging a msg in the console
  app.listen(port, () => {
    console.log(`My web server app is listening on port ${port}`);
  });
}

module.exports = app;