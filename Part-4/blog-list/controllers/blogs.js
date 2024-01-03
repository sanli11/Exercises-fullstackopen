const router = require("express").Router();
const Blog = require("../models/blog");

router.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

router.post("/", async (request, response) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0,
  });

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = router;
