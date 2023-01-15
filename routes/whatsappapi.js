var express = require("express");
// const http = require("http");
var con = require("./apidatabase.js");
var router = express.Router();
const socketIO = require("socket.io");
// const server = http.createServer(app);
// const port = process.env.PORT || 8000;
const io = socketIO(server);
// app.use(express.urlencoded());
var bot_ready = false
const { Client, LocalAuth, MessageMedia, Buttons } = require("whatsapp-web.js");
const router = express.Router()
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

router.io = io;

// app.set("view engine", "ejs");


// router.get("/", function (req, res, next) {

// });
router.get("dashboard/edit/:name", function (req, res, next) {
  
  con.query(`SELECT * FROM questions WHERE name ="${req.params.name}" `, (err, rows, fields) => {
    if (err) {
      console.error(err);
    } else {

      
      console.log(rows);
    }con.query(
      "SELECT name, message FROM questions WHERE user=?",
      ["raj"],
      function (err, result, fields) {
        res.render("edit_question", { data: rows , data2: result });


      }
    );

    
  });
});

router.get("dashboard/get", function (req, res, next) {
  
  con.query("SELECT * FROM questions", (err, rows, fields) => {
    if (err) {
      console.error(err);
    } else {
      console.log(rows);
      res.send(rows);
    }
  });
});

router.post("dashboard/edit/:name", function (req, res) {
  console.log("this");
    // const { signature,email, password } = req.body
    // db.query('UPDATE usergooglepassword SET signature=?,email=?,password=? WHERE id=?',
    //     [signature,email, password, req.params.id], (err, rows) => {
    // const { signature, email, password } = req.body;
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


router.post("dashboard/add", function (req, res) {
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


io.on("connection", function (socket) {
  if (bot_ready) {
    socket.emit("ready", "Hii bot is ready");

  }
  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    console.log(qr);
    socket.emit("qr", qr);
  });

  client.on("ready", () => {
    bot_ready = true
    socket.emit("ready", "Hii bot is ready");
    console.log("Client is ready!");
  });
});

server.listen(port, function () {
  console.log("App running on *: " + port);
});

module.exports = { router, io, client };