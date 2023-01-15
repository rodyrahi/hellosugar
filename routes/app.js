var con = require("./apidatabase.js");
var { rou, io, client } = require("./routes/index.js");


const {
  Client,
  MessageMedia,
  ClientInfo,
  Buttons,
  LocalAuth,
  List,
} = require("whatsapp-web.js");
const { localsName } = require("ejs");



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
    `SELECT * FROM questions WHERE name="${q}" AND user='raj'`,
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
    `SELECT * FROM questions WHERE name="${q}" AND user='raj'`,
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



  var sql = "SELECT* FROM questions WHERE user='raj'";

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


        var sql =
          `SELECT lastq FROM client   WHERE name="raj"`;

        con.query(sql, (err, result, fields) => {
          if (err) throw err;
          console.log(result[0]["type"]);
          if (result[0]["type"] === "input") {
            console.log("dope");
            found_question = true;
          }
          });

      }



    });

    console.log(found_question);

    if (!found_question) {
      console.log("this");

      var sql =
        "SELECT * FROM questions WHERE user = 'raj' AND isfirst = 'yes'";

      con.query(sql, function (err, results) {
        if (err) {throw err;}

        if (results[0]["op3"] === "") {
          let button = new Buttons(
            results[0]["message"],
            [{ body: results[0]["op1"] }, { body: results[0]["op2"] }],
            results[0]["tittle"],
            results[0]["footer"]
          );
          setlast_question(results[0]["name"]);
          client.sendMessage(msg.from, button);
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
          setlast_question(element["name"]);

          client.sendMessage(msg.from, button);
        }
      });
    }
  });
});
