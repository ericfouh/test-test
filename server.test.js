const request = require('supertest');
const { MongoClient, Db, Server } = require('mongodb');
const webapp = require('./server');
const { getMongoClient } = require('./dbFunctions');


// URL of db on the cloud
const url = 'mongodb+srv://test:0gcb1NPERFKJYTZj@cluster0.r0pf1cv.mongodb.net/LectureExample?retryWrites=true&w=majority';

// Connect to our db on the cloud


/**
 * 
 * @returns {Promise<MongoClient>}
 */
const connect = async () => {
  try {
    const mongoClient = await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    
    return mongoClient;
    
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};


/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 * @type {Db}
 */
let db;

/**
 * @type {MongoClient}
 */
let _mongoClient;

beforeAll(async () => {
  const testStudent = { name: 'testuser', major: 'history', email: 'rara@upenn.edu' };
  _mongoClient = await connect();
  db = _mongoClient.db();
  console.log(`Connected to database: ${db.databaseName}`);
  await request(webapp)
      .post('/student/')
      .accept('json')
      .send(testStudent)
      .then((res) => {
        console.log('res', res.text);
        expect(res.status).toEqual(201);
        expect(res.type).toBe('application/json');
        // toMatchObject check that a JavaScript object matches
        // a subset of the properties of an object
        const { student: newStud } = JSON.parse(res.text);
        console.log('<-->', newStud);
        expect(newStud).toMatchObject(testStudent);
      });
});

const clearDatabase = async () => {
  try {
    const result = await db.collection('students').deleteOne({ name: 'testuser' });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted test student');
    } else {
      console.log('warning', 'test student was not deleted or it was not found in database'); 
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

afterAll(async () => {
  await clearDatabase();
  await _mongoClient.close();
  await getMongoClient().close(); // mongo client that started server.
});

describe('Create student endpoint integration test', () => {
  test('The new player is in the database', async () => {
    const insertedUser = await db.collection('students').findOne({ name: 'testuser' });
    expect(insertedUser.name).toEqual('testuser');
  });
});
