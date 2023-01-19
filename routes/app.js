var con = require("../apidatabase.js");
const express = require('express');
var router = express.Router();
const http = require('http');
var socketIO = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var bot_ready = false

var user = ""

//============================================================================================================

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
        res.render("api/edit_question", { 
          data: rows , 
          data2: result ,
          user: JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "")
        });


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
  insert_questions(data.name,data.question,data.question_title,data.question_footer,data.op1,data.op2,data.op3,data.op1_q,data.op2_q,data.op3_q,user,data.isfirst);
  console.log(data);
  res.redirect("/");

});

router.get("/", (req, res) => {


  user =  JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "")


    user = JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "")
  console.log(user);

  var io = req.app.get('socketio');

  io.on('connect', function() {
    console.log("Connected to WS server");
    io.emit("ok", "ok");
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
  
  });
  // con.query(
  //   `SELECT name, message FROM questions WHERE user=${user}`,
  //   function (err, result, fields) {
  //     res.render("api/api", { 
  //       data: result,
  //       user: JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "")
  //     });
  //   });
  con.query(
    "SELECT name, message FROM questions WHERE user=?",
    [user],
    function (err, result, fields) {
      res.render("api/api", { 
        data: result ,
        user: JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "")
      });
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

//==================================================================================================================

function setlast_question(q) {
  const sql = `UPDATE client SET lastq = ? WHERE name = 'raj'`;
  con.query(sql, [q], (err, result) => {
    if (err) {
      throw err;
    }
    console.log(`last question is: ${q}`);
  });
}
function send_buttons(element, msg) {
  console.log("button is send");
  const options = [{ body: element["op1"] },
  { body: element["op2"] },
  ];
  if (element["op3"] !== "") {
    options.push({ body: element["op3"] });
  }
  const button = new Buttons(
    element["message"],
    options,
    element["tittle"],
    element["footer"]
  );
  setlast_question(element["name"]);
  client.sendMessage(msg.from, button);
}
function send_list(element, msg) {
  console.log(element);

  let list = []

  let j = element["op3"]
  list = j.split(',')
  const productsList = new List(
    "Here's our list of products at 50% off",
    "View all products",
    [
      {
        title: "Products list",
        rows: [
          { id: "apple", title: "Apple" },
        ],
      },
    ],
    "Please select a product"
  );
  client.sendMessage(msg.from, productsList);




}
function insert_number_in_db(number, m) {
  var sql =
    "INSERT INTO input_tb (number , input) VALUES ?";
  var values = [
    [
      number, m
    ],
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
}
async function send_input(element, msg) {
  client.sendMessage(msg.from, "Please enter the value you want to store:");

  client.on("message", async (msg) => {
    setlast_question(element["name"]);

    client.sendMessage(msg.from, " value you stored:"+ msg.body);


  });

}
async function next_message(q, msg) {
  con.query(
    `SELECT * FROM questions WHERE name="${q}" AND user=${user}`,
    async function (err, element, fields) {
      console.log(element[0]["type"]);
      if (element[0]["type"] === "file") {
        const media = MessageMedia.fromFilePath(element[0]["message"]);
        client.sendMessage(msg.from, media);
        console.log(element[0]['op1_q']);
        next_message(element[0]['op1_q'], msg)
      } else {
        send_buttons(element[0], msg)
      }
    }
  );
}
async function send_message(q, msg) {
  con.query(
    `SELECT * FROM questions WHERE name="${q}" AND user=${user}`,
    async function (err, element, fields) {

      if (element[0]["type"] === "file") {
      const media = MessageMedia.fromFilePath(element[0]["message"]);
      await client.sendMessage(msg.from, media);
      console.log(element[0]['op1_q']);
      next_message(element[0]['op1_q'], msg)
    } else if (element[0]["type"] === "list") {
      send_list(element[0], msg)
    } else if (element[0]["type"] === "input") {
      // await msg.reply('pong');
      send_input(element[0], msg)
    } else {
      send_buttons(element[0], msg)
    }
    }
  );
}
client.on("message", async (msg) => {
  console.log("MESSAGE RECEIVED", msg.body);
  let found_question = false;
  var sql = `SELECT* FROM questions WHERE user=${user}`;

  con.query(sql, function (err, results) {
    if (err) throw err;
    results.forEach((element) => {

      if (element["op1"] === msg.body) {
        found_question = true;
        send_message(element["op1_q"], msg);
        return true;
      }
      else if (element["op2"] === msg.body) {
        found_question = true;
        send_message(element["op2_q"], msg);
        return true;
      }
      else if (element["op3"] === msg.body) {
        found_question = true;
        send_message(element["op3_q"], msg);
        return true;
      }
      else {
        // var sql =
        //   `SELECT lastq FROM client   WHERE name="raj"`;
        // con.query(sql, (err, result, fields) => {
        //   if (err) throw err;
        //   console.log(result[0]["type"]);
        //   if (result[0]["type"] === "input") {
        //     console.log("dope");
        //     found_question = true;
        //   }
        //   });

      }
    })

    });


    if (!found_question) {
      console.log("not found");
      var sql =
        "SELECT * FROM questions WHERE user = 'raj' AND isfirst = 'yes'";

      con.query(sql, function (err, results) {
        if (err) {throw err;}
        
        if (results[0]["op3"] === "") {
          let button = new Buttons(results[0]["message"],[{ body: results[0]["op1"] }, { body: results[0]["op2"] }],results[0]["tittle"],results[0]["footer"]);
          setlast_question(results[0]["name"]);
          client.sendMessage(msg.from, button);
          console.log(results[0]["message"]);
        } 
        else {
          let button = new Buttons(results[0]["message"],[{ body: results[0]["op1"] },{ body: results[0]["op2"] },{ body: results[0]["op3"] },],results[0]["tittle"],results[0]["footer"]);
          setlast_question(element["name"]);
          client.sendMessage(msg.from, button);
        }
      });
    }
       
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
module.exports = router , client