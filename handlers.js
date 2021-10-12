const { createToken, createPasswordHash, checkPassword, authenticate } = require("./auth");

const r = require("rethinkdb");
const { rdbConn, tableNames } = require("./db");

const signUpHandler = async (req, res) => {
  console.log("new sign up handler");
  const conn = await rdbConn();

  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "A username and password are required" });
  }

  // Make sure user does not exist
  let userExists = true;
  await r
    .table(tableNames.users)
    .filter(r.row("email").eq(req.body.email))
    .run(conn, (_, cursor) => {
      cursor.toArray((_, result) => {
        if (result.length === 0) {
          userExists = false;
        }
      });
    });
  if (userExists) {
    console.log("user exists. do not sign up");
    return res.status(400).send({ message: "A user with that email already exists" });
  }
  console.log("user does not exist. sign up");

  const passwordHash = createPasswordHash(req.body.password);

  const newUser = {
    email: req.body.email,
    // set defaults
    measurementSystem: "metric",
    baseDumbbellWeight: 2,
  };

  const result = await r
    .table(tableNames.users)
    .insert({
      passwordHash: passwordHash,
      ...newUser,
    })
    .run(conn);
  console.log("signUp result:", result);

  const id = result.generated_keys[0];

  const token = createToken(id);

  console.log("token", token);

  res.status(201).send({
    token: token,
    user: {
      id: id,
      ...newUser,
    },
  });
};

const signInHandler = async (req, res) => {
  const conn = await rdbConn();

  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "A username and password are required" });
  }

  // Get user
  let user = null;
  await r
    .table(tableNames.users)
    .filter(r.row("email").eq(req.body.email))
    .run(conn, (_, cursor) => {
      cursor.toArray((_, result) => {
        if (result.length > 0) {
          user = result[0];
        }
      });
    });
  if (!user) {
    console.log("user does not exist");
    return res.status(400).send({ message: "A user with that email does not exist" });
  }
  console.log("user exists. sign in");

  console.log("user", user);

  // authenticate
  const isMatch = checkPassword(req.body.password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).send({ message: "Username and password do not match" });
  }

  const token = createToken(user.id);

  console.log("token", token);

  delete user.passwordHash;

  res.send({
    token: token,
    user: user,
  });
};

const getUserHandler = async (req, res) => {
  console.log("Get user");

  if (req.user.id !== req.params.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  res.send(req.user);
};

const updateUserHandler = async (req, res) => {
  console.log("Update user", req.body);

  const userId = req.user.id;

  if (userId !== req.params.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  const updateUser = {};

  if (req.body.idealWeight && req.body.idealWeight > 0) {
    updateUser.idealWeight = req.body.idealWeight;
  }
  if (req.body.baseDumbbellWeight && req.body.baseDumbbellWeight > 0) {
    updateUser.baseDumbbellWeight = req.body.baseDumbbellWeight;
  }
  if (
    req.body.measurementSystem &&
    (req.body.measurementSystem === "metric" || req.body.measurementSystem === "imperial")
  ) {
    updateUser.measurementSystem = req.body.measurementSystem;
  }

  const conn = await rdbConn();
  await r
    .table(tableNames.users)
    .filter(r.row("id").eq(userId))
    .update(updateUser)
    .run(conn);

  // return full updated user object
  const user = await r
    .table(tableNames.users)
    .get(userId)
    .run(conn);

  res.status(201).send(user);
};

const getMeasurementsHandler = async (req, res) => {
  console.log("Get measurements");

  const userId = req.user.id;

  if (userId !== req.params.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  const conn = await rdbConn();

  // Get measurements
  r.table(tableNames.measurements)
    .orderBy({ index: r.desc("date") })
    .filter(r.row("userId").eq(userId))
    .run(conn, (_, cursor) => {
      cursor.toArray((_, result) => {
        if (result) {
          return res.send(result);
        }
        return res.send([]);
      });
    });
};

const createMeasurementHandler = async (req, res) => {
  console.log("Create measurement");
  console.log("req.body", req.body);

  const userId = req.user.id;

  if (userId !== req.params.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  if (!req.body.date || !req.body.weight || !req.body.chest || !req.body.belly || !req.body.thigh) {
    return res.status(400).send({ message: "All measurement values are required" });
  }

  const addMeasurement = {
    userId: userId,
    date: req.body.date,
    weight: req.body.weight,
    chest: req.body.chest,
    belly: req.body.belly,
    thigh: req.body.thigh,
  };

  const conn = await rdbConn();

  const result = await r
    .table(tableNames.measurements)
    .insert(addMeasurement)
    .run(conn);

  const measurement = Object.assign({}, addMeasurement);
  measurement.id = result.generated_keys[0];

  console.log("added measurement", measurement);

  res.status(201).send(measurement);
};

const deleteMeasurementHandler = async (req, res) => {
  const userId = req.user.id;

  if (userId !== req.params.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  const measurementId = req.params.measurementId;

  console.log("Delete measurement", measurementId, ". For user ", userId);

  const conn = await rdbConn();

  await r
    .table(tableNames.measurements)
    .filter({ id: measurementId, userId: userId })
    .delete()
    .run(conn);

  return res.status(204).send({ id: measurementId });
};

module.exports = {
  signUpHandler,
  signInHandler,
  getUserHandler,
  updateUserHandler,
  getMeasurementsHandler,
  createMeasurementHandler,
  deleteMeasurementHandler,
};
