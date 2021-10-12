const express = require("express");
const cors = require("cors");
const { authenticate } = require("./auth");
const {
  signUpHandler,
  signInHandler,
  getUserHandler,
  updateUserHandler,
  getMeasurementsHandler,
  createMeasurementHandler,
  deleteMeasurementHandler,
} = require("./handlers");

const apiURLBase = "/api/v1";

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// routes
app.post(`${apiURLBase}/sign-up`, signUpHandler);
app.post(`${apiURLBase}/sign-in`, signInHandler);
app.get(`${apiURLBase}/users/:userId`, authenticate, getUserHandler);
app.post(`${apiURLBase}/users/:userId`, authenticate, updateUserHandler);
app.get(`${apiURLBase}/users/:userId/measurements`, authenticate, getMeasurementsHandler);
app.post(`${apiURLBase}/users/:userId/measurements`, authenticate, createMeasurementHandler);
app.delete(`${apiURLBase}/users/:userId/measurements/:measurementId`, authenticate, deleteMeasurementHandler);

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`REST server running on port ${port}`);
});
