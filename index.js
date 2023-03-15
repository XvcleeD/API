const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuid } = require("uuid");
// const axios = require("axios");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const user = {
  username: "123",
  password: "$2a$10$9mvLnNBgamGl5VQJtXIcM.BIlF6CXRdk5fADn9q9CEAhI98og5mH.",
};

// let pass = bcrypt.hashSync("mypassword");
// console.log(pass);

// let mypasshash = "$2a$10$9mvLnNBgamGl5VQJtXIcM.BIlF6CXRdk5fADn9q9CEAhI98og5mH.";

// console.log(bcrypt.compareSync("mypassword", mypasshash));

// console.log(userTokens);
// let userTokens = [];

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "evening",
});

const port = 3001;
const app = express();

app.use(cors());
app.use(express.json());

function readUserToken() {
  const content = fs.readFileSync("token.json");
  const userToken = JSON.parse(content);
  return userToken;
}

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
// function readArticlesNew() {
//   const content = fs.readFileSync("articlesNew.json");
//   const articles = JSON.parse(content);
//   return articles;
// }
app.get("/login", (req, res) => {
  const { username, password } = req.query;
  // console.log(req);
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

app.get("/mysql-test", (req, res) => {
  const limit = 10;
  connection.query(
    `SELECT * FROM titles limit ${limit}`,
    function (err, results, fields) {
      res.json(results);
    }
  );
});

app.get("/categories", (req, res) => {
  const { q, token } = req.query;

  const userToken = readUserToken();

  if (!userToken.includes(token)) {
    res.sendStatus(401);
    return;
  }
  const categories = readCategories();
  if (q) {
    const filteredList = categories.filter((category) =>
      category.name.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filteredList);
  } else {
    res.json(categories);
  }
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
// app.get("/articles", (req, res) => {
//   const articles = readArticles;
//   res.json(articles);
// });
app.get("/articles/33a398f5-7650-4cfe-872e-242e6d97166e", (req, res) => {
  const { q, page, categoryId } = req.query;
  const articles = readArticles();
  let finalResult = articles;

  if (categoryId) {
    finalResult = articles.filter(
      (articles) => articles.categoryId === categoryId
    );
  }
  if (q) {
    finalResult = finalResult.filter((article) =>
      article.title.toLowerCase().includes(q.toLowerCase())
    );
  }
  const categories = readCategories();
  const pagedList = finalResult.slice((page - 1) * 10, page * 10);

  pagedList.forEach((oneArticle) => {
    const category = categories.find(
      (category) => category.id === oneArticle.categoryId
    );
    oneArticle.category = category;
  });

  console.log(pagedList);
  res.json({
    list: pagedList,
    count: finalResult.length,
  });
});

// app.get("/articlesNew", (req, res) => {
//   const { q, page } = req.query;
//   const articles = readArticlesNew();
//   if (q) {
//     const filteredList = articles.filter((article) =>
//       article.title.toLowerCase().includes(q.toLowerCase())
//     );
//     res.json(filteredList);
//   } else {
//     const pagedList = articles.slice((page - 1) * 10, page * 10);
//     res.json({
//       list: pagedList,
//       count: articles.length,
//     });
//   }
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

  res.json(articles);

  // const page = articles.slice(0, 10);
});

// app.get("/articlesNew/insertSampleData", (req, res) => {
//   axios("https://dummyjson.com/posts?limit=100").then(({ data }) => {
//     const articles = readArticlesNew();
//     data.posts.forEach((post) => {
//       const newArticle = {
//         id: uuid(),
//         title: post.title,
//         tags: post.tags,
//         text: post.body,
//       };
//       articles.unshift(newArticle);
//     });

//     fs.writeFileSync("articles.json", JSON.stringify(articles));

//     res.json(["success"]);
//   });
// });
// app.get("/articlesNew/updateAllCategory", (req, res) => {
//   const articles = readArticlesNew();
//   const categories = readCategories();
//   articles.forEach((article, index) => {
//     const categoryIndex = index % categories.length;
//     article.categoryId = categories[categoryIndex].id;
//   });

//   fs.writeFileSync("articles.json", JSON.stringify(articles));
//   res.json(["success"]);
// });

// app.get("/articles/:id", (req, res) => {
//   const { id } = req.params;
//   const articles = readArticles();
//   const one = articles.find((item) => item.id === id);
//   const categories = readCategories();
//   const category = categories.find(
//     (category) => category.id === one.categoryId
//   );
//   one.category = category;

//   // console.log(one.category);
//   if (one) {
//     res.json(one);
//   } else {
//     res.sendStatus(404);
//   }
// });

app.listen(port, () => {
  console.log("App is listering at port", port);
});

// Xvclee2551
// Xvclee0316
