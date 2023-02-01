var con = require("../apidatabase.js");
const express = require("express");
var router = express.Router();
const qrcode = require('qrcode');
var clientapp = require('./client')
const http = require("http");
var socketIO = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var bot_ready = false;
const { Client, LocalAuth, MessageMedia, Buttons , List} = require("whatsapp-web.js");


const index = require("./index.js");

var user =""


//============================================================================================================





if (io instanceof require("socket.io")) {
  console.log("io is an instance of socket.io");
} else {
  console.log("io is not an instance of socket.io");
}

router.get("/edit/:name", function (req, res, next) {
  console.log(" this is running " + user);
  con.query(
    `SELECT * FROM questions WHERE name ="${req.params.name}" AND user='${user}' `,
    (err, rows, fields) => {
      if (err) {
        console.error(err);
      } else {
        console.log(rows);
      }
      con.query(
        "SELECT name, message FROM questions WHERE user=?",
        [user],
        function (err, result, fields) {
          res.render("api/edit_question", {
            data: rows,
            data2: result,
            user: JSON.stringify(req.oidc.user["nickname"], null, 2).replace(
              /"/g,
              ""
            ),
          });
        }
      );
    }
  );
});

router.get("/get", function (req, res, next) {
  con.query("SELECT * FROM questions", (err, rows, fields) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
      res.send(rows);
    }
  });
});

router.post("/edit/:name", function (req, res) {
  console.log("this");

  console.log(req.body);
  const {
    name,tittle,message,footer,op1,op2,op3,op1_q,op2_q,op3_q,isfirst,type,
  } = req.body;
  const nameq = req.params.name;

  const query = `UPDATE questions SET name="${name}",tittle="${tittle}", message="${message}", footer="${footer}", op1="${op1}",op2="${op2}" ,op3 = "${op3}" ,op1_q = "${op1_q}" ,op2_q = "${op2_q}",op3_q ="${op3_q}",isfirst = "${isfirst}",type = "${type}"   WHERE name="${nameq}"`;
  // const id = req.params.id;
  con.query(query, (err, rows) => {
    if (err) {
      throw err;
    } else {
      console.log(rows);
      res.redirect("/dashboard/"+user);

    }
  });
});

router.post("/add", function (req, res) {
  let data = req.body;
  insert_questions(data.name,data.question,data.question_title,data.question_footer,data.op1,data.op2,data.op3,data.op1_q,data.op2_q, data.op3_q,user,data.isfirst,data.type
  );
  console.log("this is runing"+data);
  res.redirect("/dashboard/"+user);
});

router.get("/", (req, res) => {

  var is_subscribed = false
  user = JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "");
  console.log(user);



  var io = req.app.get("socketio");

  io.on("connect", function (io) {
    console.log("Connected to WS server");
    io.emit("ok", "ok");
    if (bot_ready) {
      io.emit("ready", "Hii bot is ready");
    }

    clientapp.on("qr", (qr) => {
      
      console.log("QR RECEIVED", qr);

      qrcode.toDataURL(qr, (err, url) => {
        io.emit('qrcode', { src: url });
        
      });
      // io.emit("qrcode", qr);
    });

    clientapp.on("ready", () => {
      bot_ready = true;
      io.emit("ready", "Hii bot is ready");
      console.log("Client is ready!");
    });
  });
  con.query(
    `SELECT days FROM clients WHERE user=${user}`,
    function (err, result, fields) {
      console.log(result);
      if (result > 0) {
        is_subscribed = true
      }

    });
  con.query(
    "SELECT name, message FROM questions WHERE user=?",
    [user],
    function (err, result, fields) {
      res.render("api/api", {
        data: result,
        user: JSON.stringify(req.oidc.user["nickname"], null, 2).replace(
          /"/g,
          ""),
        isAuthenticated : req.oidc.isAuthenticated(),
        is_subscribed : is_subscribed,


      });
    }
  );



});



module.exports = {router : router , user : user};



