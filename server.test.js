const request = require('supertest');
// Import MongoDB module
const { MongoClient } = require('mongodb');

// URL of db on the cloud
const url = 'mongodb+srv://test:0gcb1NPERFKJYTZj@cluster0.r0pf1cv.mongodb.net/LectureExample?retryWrites=true&w=majority';

// Connect to our db on the cloud
const connect = async () => {
  try {
    const tmp = (await MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
    )).db();
    // Connected to db
    console.log(`Connected to database: ${tmp.databaseName}`);
    return tmp;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const webapp = require('./server');

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add -'jest': true-
 */
let db;
beforeAll(async () => {
  db = await connect();
});

const clearDatabase = async () => {
  try {
    const result = await db.collection('students').deleteOne({ name: 'testuser' });
    const { deletedCount } = result;
    if (deletedCount === 1) {
      console.log('info', 'Successfully deleted test student');
    } else {
      console.log('warning', 'test student was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

afterAll(async () => {
  await clearDatabase();
  try {
    await db.close();
  } catch (err) {
    return err;
  }
});

describe('Create student endpoint integration test', () => {
  // expected response
  const testStudent = { name: 'testuser', major: 'history', email: 'rara@upenn.edu' };
  /** 
  test('Endpoint status code and response then/catch', () => request(webapp).post('/student/')
    .send('name=testuser&major=cis&email=klaus@upenn.edu')
    .expect(201)
    .expect('Content-Type', /json/)
    .then((response) => {
      // toMatchObject check that a JavaScript object matches
      // a subset of the properties of an object

      const { newStud } = JSON.parse(response.text).student;
      console.log('-->', newStud);
      expect(newStud).toMatchObject(testStudent);
    }));
    */

  test('Endpoint status code and response async/await', async () => {
    await request(webapp).post('/student/')
      .send('name=testuser&major=cis&email=klaus@upenn.edu').then((res) => {
        expect(res.status).toEqual(201);
        expect(res.type).toBe('application/json');
        // toMatchObject check that a JavaScript object matches
        // a subset of the properties of an object
        const { newStud } = JSON.parse(res.text).student;
        console.log('<-->', newStud);
        expect(newStud).toMatchObject(testStudent);
      });
    // expect(response.status).toEqual(201);
    // expect(response.type).toBe('application/json');
    // // toMatchObject check that a JavaScript object matches
    // // a subset of the properties of an object
    // const { newStud } = JSON.parse(response.text).student;
    // console.log('<-->', newStud);
    // expect(newStud).toMatchObject(testStudent);
  });

  test('The new player is in the database', async () => {
    const insertedUser = await db.collection('students').findOne({ name: 'testuser' });
    expect(insertedUser.name).toEqual('testuser');
  });
});
