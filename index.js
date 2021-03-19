const express = require("express");
const mongoose = require("mongoose");
const AllRoute = require("./routes/allroutes");
const passport = require("passport");
const User = require("./models/User");
const cookieSession = require("cookie-session");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();

const app = express();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((val) => {
    done(null, val);
  });
});

app.use(
  cookieSession({
    keys: ["secret1"],
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (request, accessToken, refreshToken, profile, done) {
      //
      let data = { googleid: profile.id, name: profile.name.givenName };
      User.find(data).then((val) => {
        if (val.length > 0) {
          console.log(val);
          done(null, val[0]);
        } else {
          new User(data).save().then((val) => {
            console.log(val);
            done(null, val);
          });
        }
      });
    }
  )
);

require("dotenv").config();

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB");
  }
);

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/failure",
  })
);

app.use("/", AllRoute);

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
