require('dotenv').config();

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;

//--IF WE'RE IN A NODE TESTING ENVIRONMENT THEN
//--WE'LL USE A DIFFERENT DATABASE
if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}
//-----------------------------------------------

module.exports = {
  MONGODB_URI,
  PORT,
};
