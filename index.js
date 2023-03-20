const express = require("express");
const cors = require("cors");
const { categoryRouter } = require("./routes/categoryController");
const { articleRouter } = require("./routes/articleController");


const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/categories", categoryRouter);
app.use("/articles", articleRouter);

app.listen(port, () => {
    console.log("App is listering at port", port);
  });
  
  // Xvclee2551
  // Xvclee0316
  // let pass = bcrypt.hashSync("mypassword");
  // console.log(pass);
  
  // let mypasshash = "$2a$10$9mvLnNBgamGl5VQJtXIcM.BIlF6CXRdk5fADn9q9CEAhI98og5mH.";
  
  // console.log(bcrypt.compareSync("mypassword", mypasshash));
  
  // console.log(userTokens);
  // let userTokens = [];
