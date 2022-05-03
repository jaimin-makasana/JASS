const express = require('express');
const usersRouter = express.Router();
const userController = require('../controllers/Users.cjs');

usersRouter.get('/', userController.getUsersList); //--
usersRouter.post('/', userController.addUser); //--
usersRouter.get('/:EmailId', userController.login);
module.exports = usersRouter;