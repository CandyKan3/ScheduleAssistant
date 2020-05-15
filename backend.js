var express = require("express");
var app = express();
var router = express.Router();
var mysql = require("mysql");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
var nodemailer = require("nodemailer");
const { spawn } = require("child_process");
let { PythonShell } = require("python-shell");
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
    var sql = "SELECT * FROM classes";
    console.log(sql, a);
    con.query(sql, [a], function (err, result) {
      if (err) throw err;
      console.log(result);
      try {
        result.forEach(function (value) {
          //Replace console.log with the python function call and pass value.name in as a param
          console.log(value.Classname + "WE HERE");
          // const pyProg = spawn("python", [
          // "/home/schedule/python_scripts/pyscript.py",
          //value.Classname,
          //]);

          runMain(value.Classname);
          console.log("HERE");
          let newnum = 0;
          // pyProg.stdout.on("data", function (data) {
          console.log(data);
          newnum = data;
          if (newnum > value.Number) {
            console.log("UPDATING");
            update(value.Classname, newnum);
            console.log("EMAILING");
            email(value.Classname);
          }

          //We now need to update db with the new number returned by the python function.
        });
      } catch (e) {
        console.log("here");
      }
      res.status(200).send({ message: mess });
    });
  });
});

function update(params, num) {
  console.log(params + "TESTING");
  var con = mysql.createConnection({
    host: "",
    user: process.env.user,
    password: process.env.PASSWORD,
    database: "schedule",
  });

  con.connect(function (err) {
    if (err) throw err;
    var sql = "UPDATE classes SET Number=? WHERE Classname=?";
    con.query(sql, [num, params], function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({ test: result });
    });
  });
}
function email(param) {
  var con = mysql.createConnection({
    host: "",
    user: process.env.user,
    password: process.env.PASSWORD,
    database: "schedule",
  });
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "sectionchange@gmail.com",
      pass: process.env.EMAILP,
    },
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "SELECT * FROM users WHERE class=?";
    console.log(sql, param);
    con.query(sql, [param], function (err, result) {
      if (err) throw err;
      console.log(result);
      try {
        result.forEach(function (value) {
          console.log("MAILING");
          var mailOptions = {
            from: "sectionchange@gmail.com",
            to: value.name,
            subject: "A new section for " + value.class + " has opened!",
            text: "Sent from sectionchange",
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        });
      } catch (e) {
        console.log("here");
      }
    });
  });
}
function runMain(params) {
  return new Promise(async function (resolve, reject) {
    let r = await runPy(params);
    console.log(JSON.parse(JSON.stringify(r.toString())), "Done...!@"); //Approach to parse string to JSON.
  });
}

function runPy(params) {
  return new Promise(async function (resolve, reject) {
    let options = {
      mode: "text",
      pythonOptions: ["-u"],
      scriptPath: "/home/schedule/python_scripts", //Path to your script
      args: [params], //Approach to send JSON as when I tried 'json' in mode I was getting error.
    };

    await PythonShell.run("pyscript.py", options, function (err, results) {
      //On 'results' we get list of strings of all print done in your py scripts sequentially.
      if (err) throw err;
      console.log("results: ");
      for (let i of results) {
        console.log(i, "---->", typeof i);
      }
      resolve(results[1]); //I returned only JSON(Stringified) out of all string I got from py script
    });
  });
}
app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
