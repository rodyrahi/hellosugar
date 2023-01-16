var con = require("../apidatabase.js");
const express = require("express");
const http = require("http");

const app = express();
var router = express.Router();
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const userRouter = require("../routes/app.js")




router.use("/:user",userRouter)

router.get("/", (req, res) => {
    con.query(
      "SELECT name, message FROM questions WHERE user=?",
      ["raj"],
      function (err, result, fields) {
        res.render("api/api", { data: result });
      }
    );
  });





  module.exports = router
  