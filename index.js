const express = require("express");
const cors = require("cors");
const { categoryRouter } = require("./routes/categoryController");
const { articleRouter } = require("./routes/articleController");
const { userRouter } = require("./routes/userController");
const bcrypt = require("bcryptjs");
// const fs = require("fs");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
require("dotenv").config();
const { checkAuth } = require("./middlewares/checAuth");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp");
  },
  filename: function (req, file, cb) {
    const extentsions = file.originalname.split(".").pop();
    cb(null, `${uuid()}.${extentsions}`);
  },
});
const upload = multer({
  storage: storage,
});

mongoose
  .connect(process.env.MONGODB_STRING)
  .then(() => console.log("Connected!"));

const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/categories", checkAuth, categoryRouter);
app.use("/articles", checkAuth, articleRouter);
app.use("/users", userRouter);
app.post(
  "/upload-image",
  upload.single("image"),
  async function (req, res, next) {
    const cloudinaryImage = await cloudinary.v2.uploader.upload(req.file.path);
    return res.json({
      path: cloudinaryImage.secure_url,
      width: cloudinaryImage.width,
      height: cloudinaryImage.height,
    });
  }
);
app.use("/categories", categoryRouter);
app.use("/articles", articleRouter);
// app.get("/test-mongoose", (req, res) => {
//   User.create({
//     name: "Baldan",
//     email: "baldan@horl.mn",
//     age: 18,
//     createdAt: new Date(),
//   });

//   res.json({});
// });

app.listen(port, () => {
  console.log("App is listering at port", port);
});

// function readUsers() {
//   const content = fs.readFileSync("users.json");
//   const user = JSON.parse(content);
//   return user;
// }
// function readUserToken() {
//   const content = fs.readFileSync("token.json");
//   const userToken = JSON.parse(content);
//   return userToken;
// }

// app.get("/login", (req, res) => {
//   const { username, password } = req.query;
//   const user = readUsers();

//   if (
//     user.username === username &&
//     bcrypt.compareSync(password, user.password)
//   ) {
//     const token = uuid();
//     const userToken = readUserToken();
//     userToken.push(token);
//     fs.writeFileSync("token.json", JSON.stringify(userToken));
//     res.json({ token });
//   } else {
//     res.sendStatus(401);
//   }
// });

// Xvclee2551
// Xvclee0316
// let pass = bcrypt.hashSync("mypassword");
// console.log(pass);

// let mypasshash = "$2a$10$9mvLnNBgamGl5VQJtXIcM.BIlF6CXRdk5fADn9q9CEAhI98og5mH.";

// console.log(bcrypt.compareSync("mypassword", mypasshash));

// console.log(userTokens);
// let userTokens = [];
