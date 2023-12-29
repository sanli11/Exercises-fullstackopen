const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

test("api returns correct number of blog posts in JSON format", async () => {
  const blogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  console.log(blogs.body);

  expect(blogs.body).toHaveLength(2);
});

test("unique identifier property of the blog posts is named id", async () => {
  const blogs = await api.get("/api/blogs");

  expect(blogs.body[0].id).toBeDefined();
});

test("a valid blog post can be added", async () => {
  const newBlog = {
    title: "Full Stack Open",
    author: "FullStack Open",
    url: "https://fullstackopen.com/",
    likes: 10,
  };

  const blogs = await api.get("/api/blogs");

  await api.post("/api/blogs").send(newBlog).expect(201).expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  const contents = response.body.map((b) => b.title);

  expect(response.body).toHaveLength(blogs.body.length + 1);
  expect(contents).toContain("Full Stack Open");
});

afterAll(async () => mongoose.connection.close());
