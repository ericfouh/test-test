const { webapp } = require("./server");
const packageJSON = require('./package.json');
const debug = require('debug')(`${packageJSON.name}:${__filename}`);

const PORT = 8080;
// Start server and connect to the DB
const server = webapp.listen(port, async () => {
  debug(`Server running on port:${port}`);
});
