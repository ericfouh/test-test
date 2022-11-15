const request = require("supertest");
const { MongoClient, Db, Server } = require("mongodb");
const webapp = require("./server");
const { getMongoClient } = require("./dbFunctions");
const packageJSON = require('./package.json');
const debug = require('debug')(`${packageJSON.name}:${__filename}`);

// URL of db on the cloud
const url = "mongodb+srv://test:0gcb1NPERFKJYTZj@cluster0.r0pf1cv.mongodb.net/LectureExample?retryWrites=true&w=majority";

// Connect to our db on the cloud

/**
 *
 * @returns {Promise<MongoClient>}
 */
const connect = async () => {
  try {

    /**
     * MongoClient object.
     * 
     * @type {MongoClient}
     */
    const mongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 7000,
      socketTimeoutMS: 7000
    });

    debug(`Connected to database: ${mongoClient.db().databaseName}`);
    return mongoClient;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

describe("/students/ route", () => {
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

  const testStudent = {
    name: "testuser",
    major: "history",
    email: "rara@upenn.edu",
  };
  
  let actualStatus, actualResponseText;

  beforeAll(async () => {
    _mongoClient = await connect();
    db = _mongoClient.db();
    await request(webapp)
      .post("/student/")
      .accept("json")
      .send(testStudent)
      .then((res) => {
        actualStatus = res.status;
        actualResponseText = JSON.parse(res.text);

        expect(res.type).toBe("application/json"); // TODO: Move to own test.
      });
  }, 10000);

  const clearDatabase = async () => {
    if (!db) {
      return;
    }

    try {
      const result = await db
        .collection("students")
        .deleteOne({ name: "testuser" });
      const { deletedCount } = result;
      if (deletedCount === 1) {
        debug("info", "Successfully deleted test student");
      } else {
        debug(
          "warning",
          "test student was not deleted or it was not found in database"
        );
      }
    } catch (err) {
      debug("error", err.message);
    }
  };

  afterAll(async () => {
    await clearDatabase();
    await getMongoClient()?.close(); // mongo client that started server.
    await _mongoClient?.close();
  });

  test("returns 201 status for valid post", () => {
    expect(actualStatus).toEqual(201);
  });

  test("returns correct response text", () => {
    const { student: actualStudentResponseObj } = actualResponseText;
    expect(actualStudentResponseObj).toMatchObject(testStudent);
  });

  test("The new player is in the database", async () => {
    const insertedUser = await db
      .collection("students")
      .findOne({ name: "testuser" });
    expect(insertedUser.name).toEqual("testuser");
  });
});
