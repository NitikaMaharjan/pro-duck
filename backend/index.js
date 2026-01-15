require('dotenv').config();
const connectToMongo = require('./db'); // importing connectToMongo() function from db.js file
const express = require('express'); // importing express.js to create my own web server
const cors = require('cors');

connectToMongo(); // calling connectToMongo() function to establish connection with database mongoDB

const app = express(); // creating my web server app (Express application object)
const port = process.env.PORT || 5000; // defining port address(number) of my web server app where it will listen for incoming requests

app.use(express.json()); // it tells my web server app to automatically convert the incoming JSON string into JavaScript object so that my web server can easily access it using req.body
app.use(cors());

// Available routes
app.use('/api/auth', require('./routes/auth')); // loads your router from routes/auth.js, mounts it at /api/auth, so any route inside auth.js like: router.post('/', ...) becomes accessible at: POST http://localhost:5000/api/auth/
app.use('/api/notes', require('./routes/notes')); // if the request starts with '/api/notes', forward it to './routes/notes.js' to handle note related CRUD operation

//starting my web server app and listening on the specified port 5000, once my web server is running, logging a msg in the console
app.listen(port, () => {
  console.log(`My web server app is listening on port ${port}`);
});