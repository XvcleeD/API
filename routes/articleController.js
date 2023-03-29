const express = require("express");
const { v4: uuid } = require("uuid");
const router = express.Router();
const mongoose = require("mongoose");
const { Category } = require("./categoryController");

const articleSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuid() },
  title: String,
  content: String,
  categoryId: { type: String, ref: "Category" },
  image: {
    path: String,
    width: Number,
    height: Number,
  },
});

const Article = mongoose.model("Article", articleSchema);

router.get("/", async (req, res) => {
  const list = await Article.find({}).populate("categoryId");
  // console.log(list);
  res.json({
    list: list,
    // count: 10,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const one = await Article.findById(id);
  res.json(one);
});

router.post("/", async (req, res) => {
  const { title, content, categoryId, image } = req.body;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await Article.create(
        {
          title,
          content,
          categoryId,
          image,
        },
        { session }
      );
      const category = await Category.findById(categoryId);
      await Category.updateOne(
        { _id: categoryId },
        { count: category.count + 1 },
        { session }
      );
    });
    session.endSession();
  } catch (e) {
    console.log(e);
  }
  res.sendStatus(201);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Article.deleteOne({ _id: id });
  res.json({ deletedId: id });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, categoryId, image } = req.body;
  await Article.updateOne({ _id: id }, { title, content, categoryId, image });
  res.json({ updatedId: id });
});

module.exports = {
  articleRouter: router,
};
