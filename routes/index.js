var basecon = require("../database.js");
var con = require("../apidatabase.js");
const axios = require('axios')
const { localsName } = require("ejs");
const express = require("express");
const http = require("http");
const app = express();
var router = express.Router();
const socketIO = require("socket.io");
const server = http.createServer(app);
require("dotenv").config();
// const port = process.env.PORT || 8000;
const io = socketIO(server);
// app.use(express.urlencoded());
const { Client, LocalAuth, MessageMedia, Buttons , List} = require("whatsapp-web.js");
const { url } = require("inspector");
const fetch = require("node-fetch");

var bot_ready = false
var user = "";




// module.exports = { router, io, client };
router.get("/", (req, res) => {
  var is_subscribed = false
 
    if (req.oidc.isAuthenticated()) {
       user  = JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "")
        
    
      con.query(
        `SELECT days FROM client WHERE name="${user}"`,
        function (err, result, fields) {

          console.log(result);
          if (result[0] === undefined) {
            
            con.query( `INSERT  INTO client (name , days , lastq) VALUES ("${user}" , 0 , "none")` , function (err, result) {
              if (err) throw err;
              console.log(result);
            })
            var sql =
    "INSERT INTO questions (name , message , tittle ,footer , op1 , op2 , op3 , op1_q , op2_q , op3_q , user , isfirst , type ) VALUES ?";
  var values = [
    [ "q1", "hey im  sugar", "Title Here", "Footer","op1","op2","op3", "q1","q2", "q3",user,"yes", "none"],
  ];
            con.query( sql, [values] , function (err, result) {
              if (err) throw err;
              console.log(result);
            })
          } 
          else 
          {
            if (parseInt(result[0]["days"]) > 0) {
              is_subscribed = true
            }
          }
          
           
          
        
         
    
        
        console.log(is_subscribed);
          
      res.render("index", { 
          title: "My Express App" ,
          user : user,
          isAuthenticated : req.oidc.isAuthenticated(),
          is_subscribed: is_subscribed
          });
    });
    }
    else{
      res.render("index", { 
        title: "My Express App" ,
        //  user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
        isAuthenticated : req.oidc.isAuthenticated(),
        is_subscribed: is_subscribed
    });
    }
 
});
router.get("/basic", (req, res) => {
    const plan= "Basic";
    console.log(plan);
    res.render("plans", { 
        plan : plan,
        user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),

        isAuthenticated : req.oidc.isAuthenticated()
    });
});
router.get("/pro", (req, res) => {
    const plan= "Pro";
    console.log(plan);
    res.render("plans", { 
        plan : plan,
        user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),

        isAuthenticated : req.oidc.isAuthenticated()
    });
});
router.get("/enterprise", (req, res) => {
    const plan= "Enterprise";
    console.log(plan);
    res.render("plans", { 
        plan : plan,
        user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
        isAuthenticated : req.oidc.isAuthenticated()
    });
});
router.post("/basic", (req, res) => {
    console.log(req.body);
  const {name , number , mail , business  , city , cupon } = req.body;
  const type = "basic"
  var days = 0

  if (cupon.toUpperCase() === "FGS100" ) {
    days = 29
  }
  else{
    console.log(cupon);
  }
  var sql =
    "INSERT INTO client (name , number , mail , business , type , city , days) VALUES ?";
  var values = [
    [name , number , mail , business , type , city, days],
  ];
  basecon.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
   res.render('registered' , {
    name: name,
    user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
    isAuthenticated : req.oidc.isAuthenticated()
   })
 
});
router.post("/pro", (req, res) => {
  console.log(req.body);

const {name , number , mail , business  , city , cupon } = req.body;
const type = "pro"
var days = 0

if (cupon.toUpperCase() === "FGS100" ) {
  days = 29
}
else{
  console.log(cupon);
}
var sql =
  "INSERT INTO client (name , number , mail , business , type , city , days) VALUES ?";
var values = [
  [name , number , mail , business , type , city, days],
];
basecon.query(sql, [values], function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});
res.render('registered' , {
  name: name,
  user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
  isAuthenticated : req.oidc.isAuthenticated()
 })
});


router.post("/enterprise", (req, res) => {
  console.log(req.body);
const {name , number , mail , business  , city , cupon } = req.body;
var type = "enterprise"
var days = 0

if (cupon.toUpperCase() === "FGS100" ) {
  days = 29
}
else{
  console.log(cupon);
}

var sql =
  "INSERT INTO client (name , number , mail , business , type , city , days) VALUES ?";
var values = [
  [name , number , mail , business , type , city, days],
];
basecon.query(sql, [values], function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});
res.render('registered' , {
  name: name,
  user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
  isAuthenticated : req.oidc.isAuthenticated()
 })
});


router.get("/ily", (req, res) => {
  res.render('test/ily');
});

var api =  process.env.BASEURL+"/profile"
fetch(api)
  .then((response) => response.json())
  .then((data) => console.log(data));


module.exports = {r: router , user: user };

