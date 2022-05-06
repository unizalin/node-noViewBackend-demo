var express = require('express');
var router = express.Router();
const userControl = require("../controllers/user.controller")

// create and save a new post
router.post('/addUser', userControl.create)


// retrieve all user from db

router.get('/allUser', userControl.findAll);

module.exports = router;
