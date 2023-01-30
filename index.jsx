const express = require("express");
const cors = require("cors")
const { v4: uuid } =require("uuid");
// const { response } = require("express");

const port = 3001;
const app = express()

app.use(cors());
app.use(express.json());

let categories = [

];

app.get("/categories", (require, response) => {
  response.json(categories);
})

app.get("/categories/:id", (require, response) =>{
  const {id} = require.params;
  const one = categories.find((category) => category.id === id);
  if (one){
    response.json(one)
  }else{
    response.sendStatus(404);
  }
});


app.post("/categories", (require, response)=>{
  const { name } = require.body;
  const newCategory = { id: uuid(), name: name};
  categories.push(newCategory);
  response.sendStatus(201);
})

app.delete("/categories/:id", (require, response)=>{
  const { id } = require.params;
  const one = categories.find((category) => category.id === id);
  if(one){
    const newList = categories.filter((category) => category.id !== id );
    categories = newList; 
    response.json({deleteId: id});
  } else{ 
    response.sendStatus(404)
  }
});

app.put("/categories/:id", (require, response) => {
  const { id } = require.params;
  const { name } = require.body;
  const index = categories.findIndex((category) => category.id === id);
  if (index > -1) {
    categories[index].name = name
    response.json({updatedId: id})
  } else {
    response.sendStatus(404);
  }
})


// (require, response)
// app.use(cors());

// app.get("/", (request, response) => {
//   response.send("Hello")  
// })

// app.get("/user", (require, response)=>{
//   response.json(users);
// })

// app.get("/user/save", (require, response)=>{
//   users.push({name: "Nairaan baian"})
//   response.json(users)
// })

app.listen(port, () => {
  console.log("App is listering at port", port)
})
