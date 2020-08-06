const info = (...params) => {
  //--ONLY PRINT TO CONSOLE IF WE'RE NOT TESTING----------
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params);
  }
  //------------------------------------------------------
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
