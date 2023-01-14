var con = require("../database.js");
const { localsName } = require("ejs");
const express = require("express");
const router = express.Router()

router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated())
    res.render("index", { 
        title: "My Express App" ,
        user : JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, ""),
        isAuthenticated : req.oidc.isAuthenticated()
    });
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
  const {name , number , mail , business  , city } = req.body;
  const type = "basic"
  var sql =
    "INSERT INTO client (name , number , mail , business , type , city) VALUES ?";
  var values = [
    [name , number , mail , business , type , city,],
  ];
  con.query(sql, [values], function (err, result) {
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
con.query(sql, [values], function (err, result) {
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
const type = "enterprise"
var sql =
  "INSERT INTO client (name , number , mail , business , type , city) VALUES ?";
var values = [
  [name , number , mail , business , type , city,],
];
con.query(sql, [values], function (err, result) {
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