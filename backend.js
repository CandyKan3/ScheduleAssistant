var express = require("express");
var app = express();
var router = express.Router();
var mysql = require("mysql");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
  throw result.error;
}
const { parsed: envs } = result;

module.exports = envs;

app.use(bodyParser.json());

/* GET home page. */
const API_PORT = 5000;

router.post("/createclass", function (req, res, next) {
  console.log(req.body);
  let a = req.body.email;
  let c = req.body.class;
  console.log(a, c);

  var con = mysql.createConnection({
    host: "",
    user: process.env.user,
    password: process.env.PASSWORD,
    database: "schedule",
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    var sql = "INSERT INTO users(name, class) VALUES (?,?)";
    console.log(sql, a);
    con.query(sql, [a, c], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
  res.redirect("/");
});

router.post("/alert", function (req, res, next) {
  console.log(req.body);
  let a = req.body.class;
  console.log(a);

  var con = mysql.createConnection({
    host: "",
    user: process.env.user,
    password: process.env.PASSWORD,
    database: "schedule",
  });
  var mess = "false";
  let addr = "";
  var BreakException = {};
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "SELECT * FROM users WHERE class=?";
    console.log(sql, a);
    con.query(sql, [a], function (err, result) {
      if (err) throw err;
      console.log(result);
      try {
        result.forEach(function (value) {
          //TODO: add logic to send mail here
        });
      } catch (e) {
        console.log("here");
      }
      res.status(200).send({ message: mess });
    });
  });
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
