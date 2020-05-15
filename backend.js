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
  runMain2(c);
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
          runMain(value.Classname, value.Number);
          //email(value.Classname);
          console.log("HERE");
          //

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
  //console.log(params + "TESTING");
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
    service: "Mailgun",
    auth: {
      user: "postmaster@sandbox0e3e81e55b91460f9a74cf576d4acd3b.mailgun.org",
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
            from: "sectionchange@brycekane.tech",
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
function runMain(params, num) {
  return new Promise(async function (resolve, reject) {
    let r = await runPy(params, num);
    //console.log(JSON.parse(JSON.stringify(r.toString())), "Done...!@"); //Approach to parse string to JSON.
  });
}
function runMain2(params) {
  return new Promise(async function (resolve, reject) {
    let r = await runPy2(params);
    console.log(r);
    //console.log(JSON.parse(JSON.stringify(r.toString())), "Done...!@"); //Approach to parse string to JSON.
  });
}
function runPy2(params) {
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
      var con = mysql.createConnection({
        host: "",
        user: process.env.user,
        password: process.env.PASSWORD,
        database: "schedule",
      });
      for (let i of results) {
        con.connect(function (err) {
          if (err) throw err;
          console.log("Connected!");

          var sql = "INSERT INTO classes(Classname, Number) VALUES (?,?)";
          console.log(sql, params);
          try {
            con.query(sql, [params, i], function (err, result) {
              if (err) {
                console.log(err);
              }
              console.log("1 record inserted");
            });
          } catch {}
        });

        console.log(i);
      }
      resolve(results); //I returned only JSON(Stringified) out of all string I got from py script
    });
  });
}

function runPy(params, num) {
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
        if (i > num) {
          console.log("UPDATING");
          update(params, i);
          console.log("EMAILING");
          email(params);
        }
        // console.log(i, "---->", typeof i);
      }
      resolve(results[1]); //I returned only JSON(Stringified) out of all string I got from py script
    });
  });
}
app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
