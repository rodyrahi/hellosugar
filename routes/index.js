
const { localsName } = require("ejs");
const express = require("express");
const router = express.Router()

router.get("/", (req, res) => {
    console.log(req.oidc.isAuthenticated())
    res.render("index", { 
        title: "My Express App" ,
        isAuthenticated : req.oidc.isAuthenticated()
    });
  });


  router.get("/basic", (req, res) => {
    const plan= "Basic";
    console.log(plan);
    res.render("plans", { 
        plan : plan,
        isAuthenticated : req.oidc.isAuthenticated()
    });
  });
  router.get("/pro", (req, res) => {
    const plan= "Pro";
    console.log(plan);
    res.render("plans", { 
        plan : plan,
        isAuthenticated : req.oidc.isAuthenticated()
    });
  });

  router.get("/enterprise", (req, res) => {
    const plan= "Enterprise";
    console.log(plan);
    res.render("plans", { 
        plan : plan,
        isAuthenticated : req.oidc.isAuthenticated()
    });
  });



module.exports = router