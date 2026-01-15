const mongoose = require('mongoose'); // importing library to work with mongoDB inside node.js
const { Schema } = mongoose; // destructuring Schema from mongoose which is used to define the structure of the document

// creating schema(structure) of document for the User Collection
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    }
});

// creating a model named 'user' based on the schema(structure) defined above, mongoose will automatically create a 'user' collection in database
const User = mongoose.model('user', UserSchema);

// exporting User model so that it can be used in other files
module.exports = User;