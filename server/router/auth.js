const { json } = require("express");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
// app.use(cookieParser())

require("../db/conn");
const User = require("../model/userSchema");

const middleware = (req, res, next) => {
  console.log("hello my middleware");
  next();
};

router.get("/", (req, res) => {
  res.send("Hello world from the server router.js");
});

// router.get("/about-me", middleware, (req, res) => {
//   console.log("hello my about");
//   res.send("Hello world from the About Me page through router");
// });

// using promises
// router.post("/register", (req, res) => {
//   const { name, email, phone, work, password, cpassword } = req.body;
//   if (!name || !email || !phone || !work || !password || !cpassword) {
//     return res.status(422).json({ error: "please fill the fields properly" });
//   }
//   User.findOne({ email: email })
//     .then((userExist) => {
//       if (userExist) {
//         return res.status(422).json({ error: "email id already register" });
//       }
//       const user = new User({ name, email, phone, work, password, cpassword });
//       user
//         .save()
//         .then(() => {
//           res.status(201).json({ message: "user registered successfully" });
//         })
//         .catch((err) => res.status(500).json({ error: "failed to register" }));
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   //   console.log(name);
//   //   console.log(email);
//   //   res.json({ message: req.body });
//   // res.send("mera register page")
// });

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "please fill the fields properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "email id already register" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password is not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      // hashing
      await user.save();
      // const userRegister =  await user.save();

      // console.log(`${user} user is register successfully`)
      // console.log(userRegister)

      res.status(201).json({ message: "user register successfully" });
    }
  } catch (err) {
    console.log(err);
  }

  //   console.log(name);
  //   console.log(email);
  //   res.json({ message: req.body });
  // res.send("mera register page")
});

// login route

router.post("/signin", async (req, res) => {
  // console.log(req.body);
  // res.json({ message: "awesome" });
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "please fill the data" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "invalid crediantials" });
        // console.log("mai hu uper wala");
      } else {
        res.status(200).json({ message: "user signin successfuly" });
      }
    } else {
      res.status(400).json({ error: "invalid crediantials" });
      // console.log("mai hu niche wala");
    }
  } catch (err) {
    console.log(err);
  }
});

// about us ka page
router.get("/about-me", authenticate, (req, res) => {
  res.send(req.rootUser);
});
// get user data for contact us and home page
router.get("/getdata", authenticate, (req, res) => {
  res.send(req.rootUser);
});

// contact us ka page
router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in contact form");
      return res.json({ error: "please fill the contact form" });
    }
    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContact.save();
      res.status(201).json({ message: "user contact successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

// logout ka page
router.get("/logout", (req, res) => {
  console.log("Hello my logout page");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("user logout");
});

module.exports = router;
