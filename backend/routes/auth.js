const express = require('express'); // importing express.js to use its router feature
const User = require('../models/User'); // importing the User model
const router = express.Router(); // creating a router object from express to define routes

// importing validation utilities from express-validator
// body is used to validate individual fields in the request
// validationResult is used to check the result of those validations
const { body, validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

// importing verifyUserToken middleware
var verifyUserToken = require('../middleware/verifyUserToken');

// Route 1: sign up using POST method, URL '/api/auth/signup' with validation
router.post('/signup', [
  body('name').exists().withMessage('Name must not be empty')
  .isLength({ min: 3, max: 25 }).withMessage('Name must be atleast 3 and cannot be more than 25 characters')
  .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/).withMessage('Name can contain only letters and single consecutive space'),
  
  body('email').exists().withMessage('Email must not be empty')
  .isEmail().withMessage('Enter a valid email')
  .normalizeEmail(),
  
  body('password').exists().withMessage('Password must not be empty')
  .isLength({ min: 5, max: 10 }).withMessage('Password must be atleast 5 and cannot be more than 10 characters')
  .matches(/^[A-Za-z0-9!@#$%^&*()_+\-={};':"|,.<>/?]+$/).withMessage('Password can only contain letters, numbers, and special characters')
], async (req, res) => {
  // checking if the request passed all validation rules
  const errors = validationResult(req);

   // if validation failed, return 400 Bad Request with the error messages
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  try {
    // checking if a user with same email already exists
    const user_exists = await User.findOne({email: req.body.email});

    if (user_exists){// if user exists then no new user is created
      return res.status(409).json({ success: false, error: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // if validation passed and user does not exists already then create a new user with the request data
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    }); 

    const data = {
      user:{
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, jwt_secret);

    // responding with success and authentication token (in JSON format)
    res.status(201).json({ success: true, authtoken });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route 2: log in using POST method, URL '/api/auth/login' with validation
router.post('/login', [
  body('email').exists().withMessage('Email must not be empty')
  .isEmail().withMessage('Enter a valid email')
  .normalizeEmail(),
  
  body('password').exists().withMessage('Password must not be empty')
], async (req, res) => {
  // checking if the request passed all validation rules
  const errors = validationResult(req);

   // if validation failed, return 400 Bad Request with the error messages
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  const {email, password} = req.body;
  
  try {

    // checking if the user exists
    const user_exists = await User.findOne({email});

    if (!user_exists){
      return res.status(400).json({ success: false, error: 'Enter valid credentials.' });
    }

    // checking is the password is correct
    const password_matched = await bcrypt.compare(password, user_exists.password);

    if (!password_matched){
      return res.status(400).json({ success: false, error: 'Enter valid credentials.' });
    }

    const data = {
      user:{
        id: user_exists.id
      }
    }
    const authtoken = jwt.sign(data, jwt_secret);

    // responding with success and authentication token (in JSON format)
    res.status(200).json({ success: true, authtoken });

  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route 3: fetching logged in user details using GET method, URL '/api/auth/fetchuserdetails' after logging in
// verifyUserToken is a middleware which verifies the authtoken, extracts user details
router.get('/fetchuserdetails', verifyUserToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    // fetching user details using user_id
    const user = await User.findById(user_id).select('-password');
    res.status(200).json({ success: true, user});
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//exporting router so it can be used in index.js
module.exports = router;

// Note
// each authtoken is unique per signup/login, even for the same user