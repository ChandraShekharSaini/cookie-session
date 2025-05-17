import express from "express";
import session from "express-session";
import Cookies from "cookies";
import mysql from "mysql2";
const app = express();
const PORT = 3500;
const HOSTNAME = "127.0.0.1";

let connection = mysql.createConnection({
  password: "root",
  database: "world",
  host: "localhost",
  user: "root",
});

connection.connect();

app.use(
  session({
    secret: "123vkJNJ)*",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res, next) => {
  req.session.userData = {
    name: req.query.name,
    age: req.query.age,
  };

  res.status(201).send("Session Set");
});

app.get("/get", (req, res, next) => {
  console.log(req.session);
  console.log(req.session.userData);

  res.send(
    `My name ${req.session.userData.name} and ${req.session.userData.age}`
  );
});
app.get("/set-cookie", (req, res, next) => {
  let cookie = new Cookies(req, res, { keys: ["cssacs"] });

  const token = JSON.stringify({ user: "Chandra", age: 21 });

  cookie.set("chandraData", token, {
    sameSite: "lax", // use "lax" or "none" with secure: true
    httpOnly: true,
    maxAge: 30 * 60 * 1000, // 30 minutes
  });

  res.json("Cookie Set");
});

app.get("/get-cookie", (req, res, next) => {
  const cookie = new Cookies(req, res, { keys: ["cssacs"] });
  const data = cookie.get("chandraData", { signed: true });

  const userData = JSON.parse(data);

  res.send(`My name is ${userData.name} and age is ${userData.age}`);
});

app.get("/table-data", (req, res, next) => {
  connection.query("SELECT * FROM countrylanguage", (error, result, fields) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Database error" });
    }

     res.json(result);
  });

 
});

app.listen(PORT, HOSTNAME, () => {
  console.log("http://localhost:", PORT);
});
