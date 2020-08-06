const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

//--POST REQUEST FOR A NEW USER-------------------------------------
usersRouter.post('/', async (request, response) => {
  const body = request.body;

  //--Checks that the password is longer than 3 characters
  //If so it will use bycrypt to hash the password
  if (body.password.length > 3) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    //--Building up a new user to post to the DB
    const user = new User({
      username: body.username,
      name: body.name,
      //--Saving the hashed password in the new user object
      passwordHash,
    });
    //Saving new user to the DB
    const savedUser = await user.save();

    response.json(savedUser);
  } else {
    response.send('Password too short');
    response.status(400).end();
  }
});
//-------------------------------------------------------------------

//--GET REQUEST HANDLER FOR ALL THE USERS IN THE DATABASE-------------
//We find all the users in the Database
//Then we use the populate method to add in corresponding
//Data from the "blogs" that the user published
usersRouter.get('/', async (request, response) => {
  const blogs = await User.find({}).populate('blogs', {
    //These are the properties we wish to populate
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });

  response.json(blogs);
});
//-------------------------------------------------------------------

module.exports = usersRouter;
