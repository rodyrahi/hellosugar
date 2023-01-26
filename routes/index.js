var basecon = require("../database.js");
var con = require("../apidatabase.js");

const { localsName } = require("ejs");
const express = require("express");
const http = require("http");
const app = express();
var router = express.Router();
const socketIO = require("socket.io");
const server = http.createServer(app);
// const port = process.env.PORT || 8000;
const io = socketIO(server);
// app.use(express.urlencoded());
var bot_ready = false



// module.exports = { router, io, client };
router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated())
    if (req.oidc.isAuthenticated()) {
      res.render("index", { 
        title: "My Express App" ,
         user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
        isAuthenticated : req.oidc.isAuthenticated()
    });
    }
    else{
      res.render("index", { 
        title: "My Express App" ,
        //  user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
        isAuthenticated : req.oidc.isAuthenticated()
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
  if (cupon === "fgs100" ) {
    days = 29
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
const {name , number , mail , business  , city } = req.body;
const type = "pro"
var sql =
  "INSERT INTO client (name , number , mail , business , type , city) VALUES ?";
var values = [
  [name , number , mail , business , type , city,],
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
const {name , number , mail , business  , city } = req.body;
var type = "enterprise"
var sql =
  "INSERT INTO client (name , number , mail , business , type , city) VALUES ?";
var values = [
  [name , number , mail , business , type , city,],
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




module.exports = router