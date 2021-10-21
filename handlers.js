const r = require("rethinkdb");
const { rdbConn, tableNames } = require("./db");

const getUserHandler = async (req, res) => {
  console.log("Get user");

  if (req.user.id !== req.params.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  res.send(req.user);
};

const updateUserHandler = async (req, res) => {
  console.log("Current user", req.user);
  const user = req.body;
  console.log("User to be updated", user);

  const userId = req.user.id;

  if (userId !== req.params.userId) {
    return res.status(400).send({ message: "User IDs do not match" });
  }

  const conn = await rdbConn();
  await r
    .table(tableNames.users)
    .filter(r.row("id").eq(userId))
    .update(user)
    .run(conn);

  res.status(201).send(user);
};

module.exports = {
  getUserHandler,
  updateUserHandler,
};
