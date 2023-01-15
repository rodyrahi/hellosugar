var Host  = "165.232.151.6" 
var mysql = require("mysql");
var isWin = process.platform === "win32";

if (!isWin) {
  Host = "127.0.0.1"
  
}
console.log(Host);

var apiconnection = mysql.createConnection({
  host: Host,
  user: "raj",
  password: "Kamingo@11",
  database: "raj_sugardb",
  charset:"utf8mb4",
  timeout: 60000

});
apiconnection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }
  
});
module.exports = apiconnection;
