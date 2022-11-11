const { webapp } = require("./server");

const PORT = 8080;
// Start server and connect to the DB
const server = webapp.listen(port, async () => {
  console.log(`Server running on port:${port}`);
});
