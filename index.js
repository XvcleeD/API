const express = require("express");
const cors = require("cors");
const { categoryRouter } = require("./routes/categoryController");
const { articleRouter } = require("./routes/articleController");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Xvclee2551:Xvclee0316@cluster0.zso2y9y.mongodb.net/test").then(() => console.log("Connected!"));

const port = 3001;
const app = express();


const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  createdAt: Date,
  // birthDate: String
});

const User = mongoose.model("User", userSchema, "hereglegch");

app.use(cors());
app.use(express.json());
app.use("/categories", categoryRouter);
app.use("/articles", articleRouter);
app.get("/test-mongoose", (req, res) => {
  User.create({
      name: "Baldan",
      email: "baldan@horl.mn",
      age: 18,
      createdAt: new Date(),
  });

  res.json({});
});

app.listen(port, () => {
  console.log("App is listering at port", port);
});

function readUsers() {
  const content = fs.readFileSync("users.json");
  const user = JSON.parse(content);
  return user;
}
function readUserToken() {
  const content = fs.readFileSync("token.json");
  const userToken = JSON.parse(content);
  return userToken;
}

app.get("/login", (req, res) => {
  const { username, password } = req.query;
  const user = readUsers();

  if (
    user.username === username &&
    bcrypt.compareSync(password, user.password)
  ) {
    const token = uuid();
    const userToken = readUserToken();
    userToken.push(token);
    fs.writeFileSync("token.json", JSON.stringify(userToken));
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

// Xvclee2551
// Xvclee0316
// let pass = bcrypt.hashSync("mypassword");
// console.log(pass);

// let mypasshash = "$2a$10$9mvLnNBgamGl5VQJtXIcM.BIlF6CXRdk5fADn9q9CEAhI98og5mH.";

// console.log(bcrypt.compareSync("mypassword", mypasshash));

// console.log(userTokens);
// let userTokens = [];
