
const app = require("./app.js");
var con = require("../apidatabase.js");
const index = require("./index.js")
const { Client, LocalAuth, MessageMedia, Buttons , List} = require("whatsapp-web.js");


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
    authStrategy: new LocalAuth({
      clientId: index.user
    })
  });
  
  client.initialize()
  

client.on("message", async (msg) => {
  
    console.log("MESSAGE RECEIVED", msg.body);
    let found_question = false;
    var sql = `SELECT* FROM questions WHERE user='${user}'`;
  
    con.query(sql, function (err, results) {
      if (err) throw err;
      results.forEach((element) => {
        if (element["op1"] === msg.body) {
          found_question = true;
          send_message(element["op1_q"], msg);
          return true;
        } else if (element["op2"] === msg.body) {
          found_question = true;
          send_message(element["op2_q"], msg);
          return true;
        } else if (element["op3"] === msg.body) {
          found_question = true;
          send_message(element["op3_q"], msg);
          return true;
        } else {
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
      });
  
  
    if (!found_question) {
      console.log("not found");
      var sql = `SELECT * FROM questions WHERE user = "${user}" AND isfirst = 'yes'`;
    
  
      con.query(sql, function (err, results) {
        if (err) {
          throw err;
        }
        console.log(results);
  
        if (results[0]["op3"] === "") {
          let button = new Buttons(
            results[0]["message"],
            [{ body: results[0]["op1"] }, { body: results[0]["op2"] }],
            results[0]["tittle"],
            results[0]["footer"]
          );
          setlast_question(results[0]["name"]);
          client.sendMessage(msg.from, button);
          console.log(results[0]["message"]);
        } else {
          let button = new Buttons(
            results[0]["message"],
            [
              { body: results[0]["op1"] },
              { body: results[0]["op2"] },
              { body: results[0]["op3"] },
            ],
            results[0]["tittle"],
            results[0]["footer"]
          );
          setlast_question(results[0]["name"]);
          client.sendMessage(msg.from, button);
        }
      });
    }
  });
  });

  function setlast_question(q) {
    const sql = `UPDATE client SET lastq = ? WHERE name = '${user}'`;
    con.query(sql, [q], (err, result) => {
      if (err) {
        throw err;
      }
      console.log(`last question is: ${q}`);
    });
  }
  function send_buttons(element, msg) {
    console.log("button is send");
    const options = [{ body: element["op1"] }, { body: element["op2"] }];
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
  function send_photo_button(element, msg) {
    // console.log("button is send");
    // const options = [{ body: element["op1"] }, { body: element["op2"] }];
     const media = MessageMedia.fromFilePath(element["tittle"]);
    // if (element["op3"] !== "") {
    //   options.push({ body: element["op3"] });
    // }
    // const button = new Buttons(
    //   element["tittle"],options,element["messages"],element["footer"]
    // );
    let button = new Buttons(
      media,
      [
        { body: element["op1"] },
        { body: element["op2"] },
        { body: element["op3"] },
      ],
      element["tittle"],
      element["footer"]
    );
    setlast_question(element["name"]);
    client.sendMessage(msg.from, button);
  }
  
  
  function send_list(element, msg) {
    console.log(element);
  
    let list = [];
    let row = []
  
    let j = element["op1"];
    list = j.split(",");
   
    list.forEach(element => {
      row.push({id: element , title: element})
    });
    console.log(row);
    const productsList = new List(
      element["message"],
      element["tittle"],
      [
        {
          title: element["footer"],
         
            rows: row,
          
          
        },
      ],
      element["op2"]
    );
    client.sendMessage(msg.from, productsList);
  }
  function insert_number_in_db(number, m) {
    var sql = "INSERT INTO input_tb (number , input) VALUES ?";
    var values = [[number, m]];
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  }
  async function send_input(element, msg) {
    client.sendMessage(msg.from, "Please enter the value you want to store:");
  
    client.on("message", async (msg) => {
      setlast_question(element["name"]);
  
      client.sendMessage(msg.from, " value you stored:" + msg.body);
    });
  }
  async function next_message(q, msg) {
    con.query(
      `SELECT * FROM questions WHERE name="${q}" AND user='${user}'`,
      async function (err, element, fields) {
        console.log(element[0]["type"]);
        if (element[0]["type"] === "file") {
          const media = MessageMedia.fromFilePath(element[0]["message"]);
          client.sendMessage(msg.from, media);
          console.log(element[0]["op1_q"]);
          next_message(element[0]["op1_q"], msg);
        } else {
          send_buttons(element[0], msg);
        }
      }
    );
  }
  async function send_message(q, msg) {
  
    con.query(
      `SELECT * FROM questions WHERE name="${q}" AND user='${user}'`,
      async function (err, element, fields) {
        console.log("question types data" + element );
        if (element[0]["type"] === "file") {
          const media = MessageMedia.fromFilePath(element[0]["message"]);
          await client.sendMessage(msg.from, media);
          console.log(element[0]["op1_q"]);
          next_message(element[0]["op1_q"], msg);
        } else if (element[0]["type"] === "list") {
          send_list(element[0], msg);
        } else if (element[0]["type"] === "input") {
          // await msg.reply('pong');
          send_input(element[0], msg);
        }else if (element[0]["type"] === "photo_button") {
          // await msg.reply('pong');
          send_photo_button(element[0], msg);
        }else {
          send_buttons(element[0], msg);
        }
      }
    );
  }
  
  function insert_questions(name,tittle,message,footer,op1,op2,op3, op1_q,op2_q, op3_q,user,isfirst ,type) {
    var sql =
      "INSERT INTO questions (name , message , tittle ,footer , op1 , op2 , op3 , op1_q , op2_q , op3_q , user , isfirst , type ) VALUES ?";
    var values = [
      [ name, message, tittle, footer,op1,op2,op3, op1_q,op2_q, op3_q,user,isfirst,type ],
    ];
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  }

  module.exports = client