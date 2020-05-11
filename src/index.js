require("./models/User");
require("./models/Track");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const requireAuth = require("./middlewares/requireAuth");

const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri =
  "mongodb+srv://testUser:password-password@cluster0-wfssy.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoose instance");
});

mongoose.connection.on("error", (error) => {
  console.log("error connecting to mongo", error);
});

app.get("/", requireAuth, (req, res) => {
  res.send(`your email ${req.user.email}`);
});

app.listen(3000, () => {
  console.log("listening on 3000");
});
