var basecon = require("../database.js");
var con = require("../apidatabase.js");
var request = require("request");
const express = require("express");
const http = require("http");
const app = express();
var router = express.Router();
const socketIO = require("socket.io");
const server = http.createServer(app);
require("dotenv").config();
const { auth, requiresAuth } = require("express-openid-connect");
const ManagementClient = require('auth0').ManagementClient;
const fetch = require('node-fetch')
// const port = process.env.PORT || 8000;


// app.use(express.urlencoded());
const { Client, LocalAuth, MessageMedia, Buttons , List} = require("whatsapp-web.js");
const { json } = require("express");


var bot_ready = false
var user ="" ;
var requests;


// module.exports = { router, io, client };
router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated())
    if (req.oidc.isAuthenticated()) {
<<<<<<< HEAD
       user  = JSON.stringify(req.oidc.user["nickname"], null, 2).replace(/"/g, "")
       module.exports = { user: user}
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
          
=======
>>>>>>> parent of 6a59153 (broo killling it)
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

// var api = "https://hellosugar.io/profile"

// try {
//   fetch(api)
//   .then((response) => console.log( response))
 

// } catch (error) {
//   console.log(error);
// }

// const auth0 = new ManagementClient({
//   domain: 'dev-t42orpastoaad3st.us.auth0.com',
//   clientId: '5Lf1VdLyRpW1mdomZAJbjps1Io05Ith9',
//   clientSecret:'dSuIY3gFsoMGn5ZVSwTR1a0dO8JVjS4Msg3hND8ZI-3I4inNwW7pFB_AZi2_mLcE',
//   scope: 'read:users update:users',
// });

// const GetUserDetails = async userId => {
//   console.log('userId', userId);

//   auth0
//     .getUser()
//     .then(function(users) {
//       user = users["nickname"]
//       var userId = users.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value;
//       console.log(userId);
//     })
//     .catch(function(err) {
//       console.log(err);
//     });
// };
// const userId = 'google-oauth2|104503941770410173437';

// GetUserDetails(userId);






module.exports = {r: router };

