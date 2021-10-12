const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const r = require("rethinkdb");
const { rdbConn, tableNames } = require("./db");

// This should not be used in production
const secret = "supersecret";

/**
 * takes a user ID and creates jwt out of it
 * @param {String} id the user ID to create a jwt for
 */
const createToken = id => jwt.sign({ id: id }, secret, { expiresIn: 60 * 60 * 24 * 30 });

const createPasswordHash = password => bcrypt.hashSync(password, 10);

const checkPassword = (password, hash) => bcrypt.compareSync(password, hash);

/**
 * will attempt to verify a jwt and find a user in the
 * db associated with it. Catches any error and returns
 * a null user
 * @param {String} bearer authorization header from client
 */
const getUserFromBearer = async bearer => {
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return null;
  }

  const token = bearer.split("Bearer ")[1].trim();

  try {
    const tokenDecoded = jwt.verify(token, secret);
    const conn = await rdbConn();
    const user = await r
      .table(tableNames.users)
      .get(tokenDecoded.id)
      .run(conn);
    delete user.passwordHash;
    return user;
  } catch (e) {
    return null;
  }
};

// auth middleware
const authenticate = async (req, res, next) => {
  const user = await getUserFromBearer(req.headers.authorization);

  if (!user) {
    console.log("No user. Unauthorized");
    return res.status(401).send({ message: "Unauthorized" });
  }

  console.log("Authorized");
  console.log("user:", user);

  req.user = user;
  next();
};

module.exports = {
  createToken,
  createPasswordHash,
  checkPassword,
  authenticate,
};
