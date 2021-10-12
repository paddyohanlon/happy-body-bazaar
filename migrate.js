const r = require("rethinkdb");
const { rdbConn, tableNames } = require("./db");

(async () => {
  const conn = await rdbConn();

  console.log("Get table list");
  const cursor = await r.tableList().run(conn);
  const tables = await cursor.toArray();

  // Check if table exists
  if (!tables.includes(tableNames.users)) {
    // Table missing --> create
    console.log(`Creating ${tableNames.users} table`);
    await r.tableCreate(tableNames.users).run(conn);
    console.log(`Creating ${tableNames.users} table -- done`);
  }

  // Check if table exists
  if (!tables.includes(tableNames.measurements)) {
    // Table missing --> create
    console.log(`Creating ${tableNames.measurements} table`);
    await r.tableCreate(tableNames.measurements).run(conn);
    await r
      .table(tableNames.measurements)
      .indexCreate("date")
      .run(conn);
    console.log("Creating date secondary index -- done");
    console.log(`Creating ${tableNames.measurements} table -- done`);
  }

  await conn.close();
})();
