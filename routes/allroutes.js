const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/", ensureLoggedOut("/profile"), (req, res) => {
  res.render("index");
});

router.get("/profile", ensureLoggedIn("/"), (req, res) => {
  res.render("profile", { name: req.user.name });
});

router.get("/failure", (req, res) => {
  res.send(req.user + "failure");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.post("/newUser", (req, res) => {
  new User(req.body)
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/newPost", (req, res) => {
  new Post(req.body)
    .save()
    .then((val) => {
      res.send(val);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/findpost", (req, res) => {
  const id = req.body.id;
  Post.findById(id)
    .populate("postedBy", "name email")
    .then((val) => {
      res.json(val);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
