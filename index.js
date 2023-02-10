const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const axios = require("axios");

const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());

function readCategories() {
  const content = fs.readFileSync("categories.json");
  const categories = JSON.parse(content);
  return categories;
}

function readArticles() {
  const content = fs.readFileSync("articles.json");
  const articles = JSON.parse(content);
  return articles;
}

app.get("/categories", (req, res) => {
  const categories = readCategories();
  res.json(categories);
});

app.get("/categories/:id", (req, res) => {
  const { id } = req.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  if (one) {
    res.json(one);
  } else {
    res.sendStatus(404);
  }
});

app.post("/categories", (req, res) => {
  const { name } = req.body;
  const newCategory = { id: uuid(), name: name };
  const categories = readCategories();
  categories.push(newCategory);
  fs.writeFileSync("categories.json", JSON.stringify(categories));
  res.sendStatus(201);
});

app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  const categories = readCategories();
  const one = categories.find((category) => category.id === id);
  if (one) {
    const newList = categories.filter((category) => category.id !== id);
    fs.writeFileSync("categories.json", JSON.stringify(newList));
    res.json({ deleteId: id });
  } else {
    res.sendStatus(404);
  }
});

app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const categories = readCategories();
  const index = categories.findIndex((category) => category.id === id);
  if (index > -1) {
    categories[index].name = name;
    fs.writeFileSync("categories.json", JSON.stringify(categories));
    res.json({ updatedId: id });
  } else {
    res.sendStatus(404);
  }
});

// app.get("/user/save", (req, res) => {
//   const newUser = [
//     {
//       name: "Naraa",
//       id: 1,
//     },
//   ];
//   fs.writeFileSync("data.json", JSON.stringify(newUser));
//   resizeBy.json(["success"]);
// });

// app.get("user/read", (req, res) => {
//   const content = fs.readFileSync("data.json");
//   res.json(JSON.parse(content));
// });

// app.get("users/update", (req, res) => {
//   const content = fs.readFileSync("data.json");
//   const users = JSON.parse(content);
//   users.push({ id: 2, name: "Bold" });
//   fs.writeFileSync("data.json", JSON, stringify(users));
//   res.json;
// });

app.post("/articles", (req, res) => {
  const { title, categoryId, text, backgaround } = req.body;
  const newArticle = { id: uuid(), title, categoryId, text, backgaround };

  const articles = readArticles();

  articles.unshift(newArticle);
  fs.writeFileSync("articles.json", JSON.stringify(articles));

  res.sendStatus(201);
});

app.get("/articles", (req, res) => {
  const articles = readArticles();
  // console.log(articles.length);

  const categories = readCategories();
  for (let i = 0; i < articles.length; i++) {
    const category = categories.find(
      (category) => category.id === articles[i].categoryId
    );
    articles[i].category = category;
  }
  const page = articles.slice(0, 10);
  res.json(page);
});

app.get("/articles/insertSampleData", (req, res) => {
  axios("https://dummyjson.com/posts?limit=100").then(({ data }) => {
    const articles = readArticles();
    data.posts.forEach((post) => {
      const newArticle = {
        id: uuid(),
        title: post.title,
        tags: post.tags,
        text: post.body,
      };
      articles.unshift(newArticle);
    });

    fs.writeFileSync("articles.json", JSON.stringify(articles));

    res.json(["success"]);
  });
});
app.get("/articles/updateAllCategory", (req, res) => {
  const articles = readArticles();
  const categories = readCategories();
  articles.forEach((article, index) => {
    const categoryIndex = index % categories.length;
    article.categoryId = categories[categoryIndex].id;
  });

  fs.writeFileSync("articles.json", JSON.stringify(articles));
  res.json(["success"]);
});

app.get("/articles/:id", (req, res) => {
  const { id } = req.params;
  const articles = readArticles();
  const one = articles.find((item) => item.id === id);
  const categories = readCategories();
  const category = categories.find(
    (category) => category.id === one.categoryId
  );
  one.category = category;

  // console.log(one.category);
  if (one) {
    res.json(one);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log("App is listering at port", port);
});
