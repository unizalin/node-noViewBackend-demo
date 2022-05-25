var express = require('express');
var router = express.Router();
const userController = require("../controllers/user.controller")

// create and save a new post
router.post('/addUser', userController.create)

// retrieve all user from db
router.get('/allUser', userController.findAll);

// find a single user by id
router.post('/getUserInfo/:id' , userController.findOne)

// update user by id
router.patch("/updateUser/:id", userController.updateUser);

// delete a user by id
router.delete("/deleteUser/:id", userController.deleteOne);

// delete all user
router.delete("/deleteAllUsers", userController.deleteAll);

module.exports = router;
