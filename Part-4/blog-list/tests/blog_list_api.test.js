const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./api_test_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test("api returns correct number of blog posts in JSON format", async () => {
  const blogs = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  expect(blogs.body).toHaveLength(helper.initialBlogs.length);
});

test("unique identifier property of the blog posts is named id", async () => {
  const ids = [];
  const blogs = await api.get("/api/blogs");

  blogs.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
    expect(ids).not.toContain(blog.id);

    ids.push(blog.id);
  });
});

test("a valid blog post can be added", async () => {
  const newBlog = {
    title: "Full Stack Open",
    author: "FullStack Open",
    url: "https://fullstackopen.com/",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const storedBlogs = await helper.blogsStored();
  expect(storedBlogs).toHaveLength(helper.initialBlogs.length + 1);

  const contents = storedBlogs.map((b) => b.title);
  expect(contents).toContain("Full Stack Open");
});

test("missing likes property will default to 0", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "https://example.com/test",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const storedBlogs = await helper.blogsStored();
  expect(storedBlogs).toHaveLength(helper.initialBlogs.length + 1);

  const addedNewBlog = storedBlogs.find((b) => b.title === "Test Blog");
  expect(addedNewBlog.likes).toBeDefined();
  expect(addedNewBlog.likes).toBe(0);
});

test("missing title and url properties will be get a 400-Bad Request message", async () => {
  const missingTitle = {
    author: "Test Author",
    url: "https://example.com/test",
    likes: 1
  };

  await api.post("/api/blogs").send(missingTitle).expect(400);

  const missingUrl = {
    title: "Test Blog",
    author: "Test Author",
    likes: 1
  };

  await api.post("/api/blogs").send(missingUrl).expect(400);
});

afterAll(async () => mongoose.connection.close());
