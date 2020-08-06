const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

//--Mongoose Schema and Models------------------------------
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  comments: Array,
  likes: {
    type: Number,
    default: 0,
  },
  //--This is how we incorperate the user data into the blogs schema
  //The string "User" is important, as this is what will be
  //linking up our schemas
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

//----------------------------------------------------------
module.exports = mongoose.model('Blog', blogSchema);
