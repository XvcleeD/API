const express = require("express");
const cors = require("cors");
const { v4: uuid, stringify } = require("uuid");
const fs = require("fs");

const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());

function readCategories() {
  const content = fs.readFileSync("categories.json");
  const categories = JSON.parse(content);
  return categories;
}

app.get("/categories", (require, response) => {
  const categories = readCategories();
  response.json(categories);
});



app.get("/categories/:id", (require, response) => {
  const { id } = require.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  if (one) {
    response.json(one);
  } else {
    response.sendStatus(404);
  }
});

app.post("/categories", (require, response) => {
  const { name } = require.body;
  const newCategory = { id: uuid(), name: name };
  const categories = readCategories();
  categories.push(newCategory);
  fs.writeFileSync("categories.json", JSON.stringify(categories));
  response.sendStatus(201);
});

app.delete("/categories/:id", (require, response) => {
  const { id } = require.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  if (one) {
    const newList = categories.filter((category) => category.id !== id);
    fs.writeFileSync("categories.json", JSON.stringify(newList));
    response.json({ deleteId: id });
  } else {
    response.sendStatus(404);
  }
});

app.put("/categories/:id", (require, response) => {
  const { id } = require.params;
  const { name } = require.body;
  const categories = readCategories();
  const index = categories.findIndex((category) => category.id === id);
  if (index > -1) {
    categories[index].name = name;
    fs.writeFileSync("categories.json", JSON.stringify(categories));
    response.json({ updatedId: id });
  } else {
    response.sendStatus(404);
  }
});

app.get("/user/save", (require, response) => {
  const newUser = [
    {
      name: "Naraa",
      id: 1,
    },
  ];
  fs.writeFileSync("data.json", JSON.stringify(newUser));
  resizeBy.json(["success"]);
});

app.get("user/read", (require, response) => {
  const content = fs.readFileSync("data.json");
  response.json(JSON.parse(content));
});

app.get("users/update", (require, response) => {
  const content = fs.readFileSync("data.json");
  const users = JSON.parse(content);
  users.push({ id: 2, name: "Bold" });
  fs.writeFileSync("data.json", JSON, stringify(users));
  response.json;
});

app.listen(port, () => {
  console.log("App is listering at port", port);
});
