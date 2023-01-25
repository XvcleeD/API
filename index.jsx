const express = require("express");
const cors = require("cors")

const port = 8000;
const app = express()

const users = [
  {
    id: 1,
    name: "Huslee"
  },
  {
    id: 2,
    name: "Henee"
  },
  {
    id: 3,
    name: "Horloo"
  },


]

app.use(cors());

app.get("/", (request, response) => {
  response.send("Hello")  
})

app.get("/user", (require, response)=>{
  response.json(users);
})

app.get("/user/save", (require, response)=>{
  users.push({name: "Nairaan baian"})
  response.json(users)
})

app.listen(port, () => {
  console.log("App is listering at port", port)
})
