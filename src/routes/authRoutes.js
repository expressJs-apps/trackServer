const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.model("User");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = new User({
    email,
    password,
  });
  try {
    await user.save();
    const token = jwt.sign({ userId: user.id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (err) {
    console.log(err.message);
    res.status(404).send(err.message);
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send({ error: "Email and passsword needed" });
  }

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).send({ error: "Invalid email or password" });

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user.id }, "MY_SECRET_KEY");
    res.send({ token });
  } catch (error) {
    res.status(404).send({ error: "Invalid email or password" });
  }
});

module.exports = router;
