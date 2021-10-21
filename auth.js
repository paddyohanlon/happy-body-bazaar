const jwt = require("jsonwebtoken");
const r = require("rethinkdb");
const { rdbConn, tableNames } = require("./db");

// Get public JWT key from auth server
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: "http://127.0.0.1:4444/.well-known/jwks.json",
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const getUserFromBearer = async bearer => {
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return null;
  }

  const token = bearer.split("Bearer ")[1].trim();

  const result = new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });

  try {
    const decoded = await result;

    console.log("decoded", decoded);

    const conn = await rdbConn();
    const user = await r
      .table(tableNames.users)
      .get(decoded.sub)
      .run(conn);
    delete user.passwordHash;

    return user;
  } catch (e) {
    console.log("error verifying:", e);
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
  authenticate,
};
