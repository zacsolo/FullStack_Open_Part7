const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//--Mongoose Schema and Models------------------------------
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  name: String,
  passwordHash: String,
  //--This is where the blog information is stored in our User Schema
  //The string "Blog" is important because it is what
  //Links up the User and Blog Schemas
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
//--Used to validate that our usernames are unqiue
//Within the Database
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
//----------------------------------------------------------
module.exports = User;
