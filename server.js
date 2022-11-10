// Import express
const express = require('express');

// enable cross-origin resource sharing (cors)
const cors = require('cors');

// Create express app
const webapp = express();

webapp.use(cors());

// Import database operations
const dbLib = require('./dbFunctions');

// Server port
const port = 8080;

webapp.use(express.urlencoded({
  extended: true,
}));

// declare DB reference variable

let db;

// Start server and connect to the DB
webapp.listen(port, async () => {
  db = await dbLib.connect();
  console.log(`Server running on port:${port}`);
});

// Root endpoint
webapp.get('/', (_req, res) => {
  res.json({ message: 'Welcome to our web app' });
});

// Other API endpoints
webapp.get('/students', async (_req, res) => {
  console.log('READ all students');
  try {
    const results = await dbLib.getAllStudents(db);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.get('/student/:id', async (req, res) => {
  console.log('READ a player by id');
  try {
    if (req.params.id === undefined) {
      res.status(404).json({ error: 'id is missing' });
      return;
    }
    const result = await dbLib.getAStudent(db, req.params.id);
    if (result === undefined) {
      res.status(404).json({ error: 'bad user id' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

webapp.post('/student/', async (req, res) => {
  console.log('CREATE a student');
  if (!req.body.name || !req.body.email || !req.body.major) {
    res.status(404).json({ error: 'missing name or email or major' });
    return;
  }
  // create new student object
  const newStudent = {
    name: req.body.name,
    email: req.body.email,
    major: req.body.major,
  };
  try {
    const result = await dbLib.addStudent(db, newStudent);
    console.log(`id: ${JSON.stringify(result)}`);
    // add id to new player and return it
    res.status(201).json({
      student: { id: result, ...newStudent },
    });
  } catch (err) {
    console.log('wow in here', err.message);
    res.status(404).json({ error: err.message });
  }
});

webapp.delete('/student/:id', async (req, res) => {
  if (req.params.id === undefined) {
    res.status(404).json({ error: 'id is missing' });
    return;
  }
  console.log('DELETE a player');
  try {
    const result = await dbLib.deleteStudent(db, req.params.id);
    console.log(`result-->${result}`);
    if (Number(result) === 0) {
      res.status(404).json({ error: 'student not in the system' });
      return;
    }
    res.status(200).json({ message: `Deleted ${result} student(s) with id ${req.params.id}` });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
