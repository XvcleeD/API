const express = require("express");
const { v4: uuid } = require("uuid");
const { connection } = require("../config/mysql");
const router = express.Router();
const mongoose = require("mongoose");

const categorySvhema = new mongoose.Schema({
  _id: String,
  name: String,
});

const Category = mongoose.model("Category", categorySvhema);

router.get("/", async (req, res) => {
  const { q } = req.query;

  connection.query(
    `SELECT * FROM category where name like ? order by name`,
    [`%${q}%`],
    function (err, results, fields) {
      res.json(results);
    }
  );
});
// router.get("/", (req, res) => {
//   connection.query(
//     `SELECT * FROM category order by name`,
//     function (err, results, fields) {
//       res.json(results);
//     }
//   );
// });
router.get("/:id", (req, res) => {
  const { q } = req.query;
  connection.query(
    `SELECT * FROM category where name like ? order by name`,
    [`%${q}%`],
    function (err, results, fields) {
      res.json(results[0]);
    }
  );
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  await Category.create({
    _id: uuid(),
    name: name,
  });
  res.sendStatus(201);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    `delete from category where id=?`,
    [id],
    function (err, results, fields) {
      res.json({ deleteId: id });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  connection.query(
    `update category set name=? where id=?`,
    [name, id],
    function (err, results, fields) {
      res.json({ updatedId: id });
    }
  );
});
module.exports = {
  categoryRouter: router,
};
