/**
 * This module will start the express server
 */

// import the env variables
require('dotenv').config();

// import the express app
const webapp = require('./server');

// const port = 8080;
const port = process.env.PORT || 8080;
// start the web server
webapp.listen(port, () =>{
    console.log('Server running on port', port);
})