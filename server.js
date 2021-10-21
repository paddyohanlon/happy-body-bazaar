const express = require("express");
const cors = require("cors");
const { authenticate } = require("./auth");
const { getUserHandler, updateUserHandler } = require("./handlers");

const apiURLBase = "/api/v1";

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// routes
app.get(`${apiURLBase}/users/:userId`, authenticate, getUserHandler);
app.post(`${apiURLBase}/users/:userId`, authenticate, updateUserHandler);

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`REST API running on port ${port}`);
});
