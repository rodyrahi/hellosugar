var con = require("../apidatabase.js");
const express = require('express');
var router = express.Router();
const http = require('http');
var socketIO = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

const bot_ready = false





const { Client, LocalAuth, MessageMedia, Buttons } = require("whatsapp-web.js");
const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process", // <- this one doesn't works in Windows
      "--disable-gpu",
      "--use-gl=egl",
    ],
  },
  authStrategy: new LocalAuth(),
});

client.initialize();


if (io instanceof require('socket.io')) {
  console.log('io is an instance of socket.io');
} else {
  console.log('io is not an instance of socket.io');
}
if (bot_ready) {
  io.emit("ready", "Hii bot is ready");

}




client.on("qr", (qr) => {
  io.emit('qr', qr);
  console.log("QR RECEIVED", qr);

});

client.on("ready", () => {
  bot_ready = true
  io.emit("ready", "Hii bot is ready");
  console.log("Client is ready!");
});




router.get("/edit/:name", function (req, res, next) {
  
  con.query(`SELECT * FROM questions WHERE name ="${req.params.name}" `, (err, rows, fields) => {
    if (err) {
      console.error(err);
    } else {

      
      console.log(rows);
    }con.query(
      "SELECT name, message FROM questions WHERE user=?",
      ["raj"],
      function (err, result, fields) {
        res.render("api/edit_question", { data: rows , data2: result });


      }
    );

    
  });
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
    const {name,tittle,message,footer,op1,op2,op3,op1_q,op2_q, op3_q,isfirst,type} = req.body;
    const nameq = req.params.name
    

    const query = `UPDATE questions SET name="${name}",tittle="${tittle}", message="${message}", footer="${footer}", op1="${op1}",op2="${op2}" ,op3 = "${op3}" ,op1_q = "${op1_q}" ,op2_q = "${op2_q}",op3_q ="${op3_q}",isfirst = "${isfirst}",type = "${type}"   WHERE name="${nameq}"`
    // const id = req.params.id;
    con.query(query,
      (err, rows) => {
        if (err) {
          throw err;
        } else {
          console.log(rows );
          res.redirect("/")
        }
      });

});

router.post("/add", function (req, res) {
  let data = req.body;
  insert_questions(data.name,data.question,data.question_title,data.question_footer,data.op1,data.op2,data.op3,data.op1_q,data.op2_q,data.op3_q,"raj",data.isfirst);
  console.log(data);
  res.redirect("/");

});

function insert_questions( name,tittle,message,footer,op1,op2,op3,op1_q,op2_q,op3_q,user,isfirst) {
  var sql =
    "INSERT INTO questions (name , message , tittle ,footer , op1 , op2 , op3 , op1_q , op2_q , op3_q , user , isfirst ) VALUES ?";
  var values = [
    [
      name,message,tittle,footer,op1,op2,op3,op1_q,op2_q,op3_q,user,isfirst,
    ],
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
}
//============================================================




router.get("/", (req, res) => {
  
  var io = req.app.get('socketio');
  io.on('connect', function() {
    console.log("Connected to WS server");
    io.emit("qr", "test2");
  
  });
  con.query(
    "SELECT name, message FROM questions WHERE user=?",
    ["raj"],
    function (err, result, fields) {
      res.render("api/api", { data: result });
    }
  );
});
router.post("/", (req, res) => {
  
  var io = req.app.get('socketio');
  io.on('connect', function() {
    console.log("Connected to WS server");
    io.emit("qr", "test2");
  
  });
});


module.exports = router
