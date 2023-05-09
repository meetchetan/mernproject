const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

dotenv.config({ path: "./config.env" });
require("./db/conn");
// const User = require("./model/userSchema");

app.use(express.json());

// we link our router files to make our router easy
app.use(require("./router/auth"));

const PORT = process.env.PORT;

// middleware

// const middleware = (req, res, next) => {
//   console.log("hello my middleware");
//   next();
// };

// middleware();

// app.get("/", (req, res) => {
//   res.send("Hello world from the server app.js");
// });

// app.get("/about-me", middleware, (req, res) => {
//   console.log("hello my about");
//   res.send("Hello world from the About Me page");
// });

// app.get("/contact", (req, res) => {
//   // res.cookie("test", "thapa");
//   // // test cookies
//   res.send("Hello world from the Contact page");
// });

app.get("/signin", (req, res) => {
  res.send("Hello world from the signin page");
});

app.get("/signup", (req, res) => {
  res.send("Hello world from the signup page");
});

console.log("please subscribe to my channel");

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});