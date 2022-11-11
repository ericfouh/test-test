// this is a node app, we must use commonJS modules/ require

// import the mongodb driver
const { 
  MongoClient, 
  ObjectId, 
  Db
} = require('mongodb');

// the mongodb server URL
const dbURL = 'mongodb+srv://test:0gcb1NPERFKJYTZj@cluster0.r0pf1cv.mongodb.net/LectureExample?retryWrites=true&w=majority';

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
    _mongoClient = await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    console.log(`Connected to mongodb`);
  } catch (err) {
    console.log(err);
  }
};

const getDb = async () => {
  let cl;
  if (!_mongoClient) {
    await dbStuff.connect();
  } 
  
  cl = _mongoClient;
  
  return cl.db();
}

/**
 * The mongo client running on the server.
 * 
 * @returns {MongoClient}
 */
const getMongoClient = () => _mongoClient;

const dbStuff = {
  connect,
  getDb
}

// CREATE a new student
// takes a db connector and a student object
// and add the user to the DB
const addStudent = async (newStudent) => {
  console.log('adding student');
  const db = await dbStuff.getDb();
  // callback version
  const result = await db.collection('students').insertOne(newStudent);
  console.log(`New student created with id: ${result.insertedId}`);
  return result;
};

// READ all students
// await/async syntax
const getAllStudents = async (db) => {
  try {
    const result = await db.collection('students').find({}).toArray();
    // print the results
    console.log(`Students: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// READ a student given their ID
const getAStudent = async (studentID) => {
  try {
    const db = await getDb();
    const result = await db.collection('students').findOne({ _id: ObjectId(studentID) });
    
    // print the result
    console.log(`Student: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// UPDATE a student given their ID
const updateStudent = async (studentID, newMajor) => {
  try {
    const db = await dbStuff.getDb();
    const result = await db.collection('students').updateOne(
      { _id: ObjectId(studentID) },
      { $set: { major: newMajor } },
    );
      // print the result
    console.log(`Student: ${JSON.stringify(result)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// DELETE a student given their ID
const deleteStudent = async (studentID) => {
  try {
    const db = await getDb();
    const result = await db.collection('students').deleteOne(
      { _id: ObjectId(studentID) },
    );
    // print the result
    console.log(`Student: ${JSON.stringify(result)}`);
  } catch (err) {
    console.log(`error: ${err.message}`);
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
  getMongoClient
};
