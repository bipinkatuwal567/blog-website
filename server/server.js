import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccount from "./blog-webapp.json" with { type: "json" };
import { getAuth } from "firebase-admin/auth";

/* Schemas */
import User from "./Schema/User.js";

let PORT = 3000;
const server = express();
server.use(express.json());
server.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Regex
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

// function to check unique username or create new
const createUniqueUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameUniqe = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  !isUsernameUniqe ? (username += `_${nanoid().substring(0, 5)}`) : "";

  return username;
};

// function to send data to frontend
const formatDataToSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );
  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

// Route
server.post("/sign-up", (req, res) => {
  const { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    res.status(403).json({
      success: false,
      message: "Fullname must be more than 3 characters",
    });
    return;
  }

  if (!email.length) {
    res
      .status(403)
      .json({ success: false, message: "Please provide your email" });
    return;
  }

  if (!emailRegex.test(email)) {
    res
      .status(403)
      .json({ success: false, message: "Please provide your valid email" });
    return;
  }

  if (!passwordRegex.test(password)) {
    res.status(403).json({
      success: false,
      message:
        "Your password must be greater than 6 and less than 20 words with a numeric, including atleast 1 uppercase and 1 lowercase character",
    });
    return;
  }

  bcrypt.hash(password, 10, async (err, hashPassword) => {
    let username = await createUniqueUsername(email);
    let user = User({
      personal_info: {
        fullname,
        email,
        password: hashPassword,
        username,
      },
    });

    user
      .save()
      .then((user) => {
        res.status(200).json(formatDataToSend(user));
        return;
      })
      .catch((err) => {
        if (err.code === 11000) {
          res
            .status(500)
            .json({ success: false, message: "Email already exits" });
          return;
        }
        res.status(500).json({ success: false, message: err.message });
        return;
      });
  });
});

server.post("/sign-in", async (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        res
          .status(403)
          .json({ success: false, message: "Email doesn't exist" });
        return;
      }

      if(!user.google_auth){
        bcrypt.compare(password, user.personal_info.password, (err, result) => {
          if (err) {
            res.status(403).json({
              success: false,
              message: "Error occured while logging in please try again",
            });
            return;
          }
  
          if (!result) {
            res
              .status(403)
              .json({ success: false, message: "Password didn't match" });
            return;
          } else {
            res.status(200).json(formatDataToSend(user));
            return;
          }
        });
      }else{
        return res.status(403).json({success: false, message: "Account was created using google. Try logging in with google"})
      }
    })
    .catch((err) => {
      res.status(500).json({ success: false, message: err.message });
      return;
    });
});

// Google Auth route
server.post("/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedToken) => {
      let { email, name, picture } = decodedToken;
      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img google_auth"
        )
        .then((user) => {
          return user || null;
        })
        .catch((err) => {
          return res.status(500).json({ success: false, message: err.message
           });
        });

      if (user) {
        // Login
        if (!user.google_auth) {
          return res.status(403).json({
            success: false,
            message: "This email was signed up without google auth. Please log in with password to access the account"
          });
        }
      } else {
        // Sign up
        let username = await createUniqueUsername(email);

        user = new User({
          personal_info: {
            username: username,
            fullname: name,
            email: email,
            profile_img: picture,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(403).json({ success: false, message: err.message });
          });
      }
      return res.status(200).json(formatDataToSend(user));
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ success: false, message: err.message });
    });
});

server.listen(PORT, () => {
  console.log("Server has been started🚀");
});
