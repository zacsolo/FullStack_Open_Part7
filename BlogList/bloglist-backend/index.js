const app = require('./app');
const http = require('http');
const config = require('./utils/config');
const logger = require('./utils/logger');

//--CREATING THE ACTUAL CONNECTION AND SERVER-----------
const server = http.createServer(app);

server.listen(config.PORT || 3000, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
//-------------------------------------------------------
