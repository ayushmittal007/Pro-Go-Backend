const express = require("express");
const Route = express.Router();
const { register } = require("../controllers/auth");
Route.route("/register").post(register);
module.exports = Route;
