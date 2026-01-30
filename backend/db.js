const mongoose = require('mongoose'); // importing library to work with mongoDB inside node.js
require('dotenv').config();
const mongoURI = process.env.MONGO_URI; // connection string that tells mongoose exactly how to find and connect to database

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to database successfully');
  } catch (error) {
    console.log('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectToMongo; // this makes the connectToMongo() function available to other files using require()