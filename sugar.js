const express = require("express");
const app = express();
const indexRouter = require("./routes/index.js")
const dashboardRouter = require("./routes/dashboard.js")

const { auth, requiresAuth } = require("express-openid-connect");
require("dotenv").config();



const http = require('http');
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const bot_ready = false

io.on('connection', (socket) => {
  
  console.log("redy");

});



const config =
{
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    secret: process.env.SECRET,
    idpLogout: true,
  }


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}))
app.use(auth(config))

app.use('/' , indexRouter);
app.use('/dashboard' , dashboardRouter);

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});



app.listen(5000, () => {
  console.log("Server listening on port 5000");
});


