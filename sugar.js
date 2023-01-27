const express = require("express");
const http = require('http');
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);





const indexRouter = require("./routes/index.js");
const dashboardRouter = require("./routes/dashboard.js");
const { auth, requiresAuth } = require("express-openid-connect");
require("dotenv").config();

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("message", (msg) => {
//     console.log("message: " + msg);
//     io.emit("message", msg);
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });






const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'https://hellosugar.io',
  clientID: '5Lf1VdLyRpW1mdomZAJbjps1Io05Ith9',
  issuerBaseURL: 'https://dev-t42orpastoaad3st.us.auth0.com',
  idpLogout: true,
};
app.set('socketio', io);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(auth(config));

app.use("/", indexRouter);
app.use("/dashboard", dashboardRouter);

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

server.listen(5000, () => {
  console.log("server is running on port 5000");
});


