// this is a node app, we must use commonJS modules/ require

// import the mongodb driver
const { MongoClient, ObjectId } = require("mongodb");

const packageJSON = require("./package.json");
const debug = require("debug")(`${packageJSON.name}:${__filename}`);

// the mongodb server URL
const dbURL =
  "mongodb+srv://test:0gcb1NPERFKJYTZj@cluster0.r0pf1cv.mongodb.net/LectureExample?retryWrites=true&w=majority";

/**
 * MongoClient for database connection.
 *
 * @type {MongoClient}
 */
let _mongoClient;

// connection to the db
/**
 * The connected mongo client.
 * @returns {Promise<MongoClient>}
 */
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    _mongoClient = await MongoClient.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 7000,
      socketTimeoutMS: 7000,
    });
    debug("Connected to mongodb");
  } catch (err) {
    debug(err);
  }
};

const getDb = async () => {
  if (!_mongoClient) {
    await connect();
  }

  return _mongoClient.db();
};

/**
 * The mongo client running on the server.
 *
 * @returns {MongoClient}
 */
const getMongoClient = () => _mongoClient;

const dbStuff = {
  connect,
  getDb,
};

// CREATE a new student
// takes a db connector and a student object
// and add the user to the DB
const addStudent = async (newStudent) => {
  debug("adding student");
  const db = await getDb();
  // callback version
  const result = await db.collection("students").insertOne(newStudent);
  debug(`New student created with id: ${result.insertedId}`);
  return result;
};

// READ all students
// await/async syntax
const getAllStudents = async (db) => {
  try {
    const result = await db.collection("students").find({}).toArray();
    // print the results
    debug(`Students: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    debug(`error: ${err.message}`);
  }
};

// READ a student given their ID
const getAStudent = async (studentID) => {
  try {
    const db = await getDb();
    const result = await db
      .collection("students")
      .findOne({ _id: ObjectId(studentID) });

    // print the result
    debug(`Student: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    debug(`error: ${err.message}`);
  }
};

// UPDATE a student given their ID
const updateStudent = async (studentID, newMajor) => {
  try {
    const db = await getDb();
    const result = await db
      .collection("students")
      .updateOne({ _id: ObjectId(studentID) }, { $set: { major: newMajor } });
    // print the result
    debug(`Student: ${JSON.stringify(result)}`);
  } catch (err) {
    debug(`error: ${err.message}`);
  }
};

// DELETE a student given their ID
const deleteStudent = async (studentID) => {
  try {
    const db = await getDb();
    const result = await db
      .collection("students")
      .deleteOne({ _id: ObjectId(studentID) });
    // print the result
    debug(`Student: ${JSON.stringify(result)}`);
  } catch (err) {
    debug(`error: ${err.message}`);
  }
};

// main function to execute our code
/** 
const main = async () => {
  const conn = await connect();
  // addStudent(conn, { name: 'Rachel', major: 'history', email: 'rara@upenn.edu' });
  // await getAllStudents(conn);
  await getAStudent(conn, '635ad18f799a7c5d0c89d320');
  await updateStudent(conn, '635ad18f799a7c5d0c89d320', 'CIS');
  await deleteStudent(conn, '635ad18f799a7c5d0c89d320');
};
*/
// execute main
// main();
module.exports = {
  dbStuff,
  connect,
  addStudent,
  getAllStudents,
  getAStudent,
  updateStudent,
  deleteStudent,
  getMongoClient,
};
