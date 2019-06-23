const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../../nodemon.env' });
const checkAuth = require('../middleware/check-auth');
const User_Controller = require('../controller/user')

router.post('/signup', User_Controller.create_user)

router.post('/Login', User_Controller.User_Login)

router.delete('/delete/:userId', checkAuth , User_Controller.User_Delete)

router.get('/allUser', checkAuth, User_Controller.list_all_users)
module.exports = router;