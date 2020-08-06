const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

//This is a router specifically for logging in

//--POST REQUEST TO LOGIN ROUTE---------------------------
loginRouter.post('/', async (request, response) => {
  const { body } = request;
  console.log('IN LOGIN ROUTER__USERNAME__', body.username);
  console.log('IN LOGIN ROUTER__PASSWORD__', body.password);

  //Search the Database for the username that
  //Matches the username sent in the request body
  const user = await User.findOne({ username: body.username });

  //Validation for the bycrypt Password
  //If there is no user, immediately end and send back false
  //If the password sent in the request matches
  //The hashed password in bycrypt, then will return true
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);
  console.log('IN LOGIN ROUTER--IS THE PASSWORD CORRECT--', passwordCorrect);
  //If both the user and the password are not correct
  //throw an error
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }
  // Build up an object
  // That is comprised of the username and id of the
  //Fetched user from the Database
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  //Verify the token using the userForToken Object created above
  // and the SECRET we have stored
  const token = jwt.sign(userForToken, process.env.SECRET);

  //Finally send a good status code,
  //and send the TOKEN,
  //The username , and the name of the user
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
