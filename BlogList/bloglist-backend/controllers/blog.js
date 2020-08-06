//--Creating a Router and Importing a Model-----------------
const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
//----------------------------------------------------------

//--GET REQUEST HANDLER ALL BLOGS---------------------------
blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    //Uses the Mongoose Populate method to incorperate
    //User information into the Blog informaton.
    .populate('user', {
      username: 1,
      name: 1,
      id: 1,
    });
  response.json(blogs);
});
//----------------------------------------------------------

//--GET REQUEST HANDLER *SINGLE* BLOG---------------------------
blogRouter.get('/:id', async (request, response) => {
  const result = await Blog.findById(request.params.id);
  response.json(result);
});
//----------------------------------------------------------

//--POST REQUEST HANDLER SINGLE BLOG------------------------
blogRouter.post('/', async (request, response) => {
  const { body } = request;
  //Varifies that the Token received, in combination with
  //Our Secret are correct
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  //If there is no request token or there is no Decoded Token id
  //Run an error
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  //Use the decoded token to search our Database
  //And find our specific user
  const user = await User.findById(decodedToken.id);

  //"Building up" a blog post using the data from our request
  //Our Mongoose Blog Module, and our user ID from our
  //Decoded Token
  const blog = new Blog({
    ...body,
    likes: body.likes || 0,
    user: user._id,
  });

  //Validation for the required elements
  //If there is no title or Url sent in the request
  //Send back an Error
  if (!blog.title || !blog.url) {
    response.status(400).end();
  } else {
    //Save our blog to the Database
    const savedBlog = await blog.save();
    //User.blog is an array of blogs associated with a user
    //If the length is less than one, simply add in the new blog
    //If the length is less than two, the existing blog, plus the new blog
    //Anthing greater, spread in all the array items and add the new one
    user.blogs.length < 1
      ? (user.blogs = [savedBlog._id])
      : user.blogs.length < 2
      ? (user.blogs = [user.blogs, savedBlog._id])
      : (user.blogs = [...user.blogs, savedBlog._id]);

    //save the user to the Database
    await user.save();
    response.json(savedBlog);
  }
});
//----------------------------------------------------------

//--PUT REQUEST, UPDATE SINGLE BLOG------------------------
blogRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, comments } = request.body;
  const newBlog = { title, author, url, comments, likes: likes || 0 };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  });
  if (!newBlog.title || !newBlog.url) {
    response.status(400).end();
  } else {
    response.json(updatedBlog);
  }
});

//----------------------------------------------------------
const getTokenFrom = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return;
};
//--DELETE REQUEST HANDLER *SINGLE* BLOG---------------------------
blogRouter.delete('/:id', async (request, response) => {
  console.log('IN DELETE REQUEST---REQUEST PARAMS', request.params.id);
  //Verifying that the Token sent in the header
  //Combine with the SECRET is valid
  console.log('IN DELETE REQUEST---REQUEST TOKEN', request.token);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  //If the request.token or the Decoded Token Id don't exist
  //Responsd with an error
  console.log('IN DELETE REQUEST--- DECODED TOKEN', decodedToken.id);
  console.log('IN DELETE REQUEST---TYPE DECODED TOKEN', typeof decodedToken.id);
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  //Find the user in our Database using the decoded and verified ID
  const user = await User.findById(decodedToken.id);
  console.log('IN DELETE REQUEST---FOUND USER ID', user._id);
  console.log('IN DELETE REQUEST---TYPE USER ID', typeof user._id);
  //If the user id and the decoded token id match
  //Then proceed with normal deletion
  //Otherwise throw an error.

  if (user._id.toString() === decodedToken.id) {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } else {
    response.status(401).json({ error: 'NO DELETING! NOT YOURS' });
  }
});
//----------------------------------------------------------

module.exports = blogRouter;
