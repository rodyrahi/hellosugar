var con = require("../apidatabase.js");
const express = require("express");
const http = require("http");
const app = express();
var router = express.Router();
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const userRouter = require("../routes/app.js");
const client = require("../routes/app.js");




router.use("/:user",userRouter)


module.exports = router





  