const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./api_test_helper");
const Blog = require("../models/blog");

beforeEach(async () => {
	await Blog.deleteMany({});

	for (const blog of helper.initialBlogs) {
		const blogObject = new Blog(blog);
		await blogObject.save();
	}
}, 10000);

describe("checking GET method for API", () => {
  test("api returns correct number of blog posts in JSON format", async () => {
    const blogs = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(blogs.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique identifier property of the blog posts is named id", async () => {
			const blogs = await api.get("/api/blogs");
			const ids = [];

			for (const blog of blogs.body) {
				expect(blog.id).toBeDefined();
				expect(ids).not.toContain(blog.id);

				ids.push(blog.id);
			}
		});
});

describe("checking POST method for API", () => {
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
});

describe("checking DELETE method for API", () => {
  test("deleting a blog using its id", async () => {
    const blogsBeforeDeleting = await helper.blogsStored();
    const blogToDelete = blogsBeforeDeleting[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAfterDeleting = await helper.blogsStored();
    expect(blogsAfterDeleting).toHaveLength(blogsBeforeDeleting.length - 1);

    const contents = blogsAfterDeleting.map((b) => b.title);
    expect(contents).not.toContain(blogToDelete.title);
  });


  test("deleting a blog using an invalid id", async () => {
    const nonExistentId = "507f1f77bcf86cd799439011";
    const blogsBeforeDeleting = await helper.blogsStored();

    await api.delete(`/api/blogs/${nonExistentId}`).expect(204);

    const blogsAfterDeleting = await helper.blogsStored();
    expect(blogsAfterDeleting).toHaveLength(blogsBeforeDeleting.length);
  });
});

describe("checking PUT method for API", () => {
  test("updating a blog using its id", async () => {
    const blogsBeforeUpdating = await helper.blogsStored();
    const blogToUpdate = blogsBeforeUpdating[0];

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);

    const blogsAfterUpdating = await helper.blogsStored();
    expect(blogsAfterUpdating).toHaveLength(blogsBeforeUpdating.length);

    const storedUpdatedBlog = blogsAfterUpdating.find((b) => b.id === blogToUpdate.id);
    expect(storedUpdatedBlog.title).toEqual(updatedBlog.title);
    expect(storedUpdatedBlog.author).toEqual(updatedBlog.author);
    expect(storedUpdatedBlog.url).toEqual(updatedBlog.url);
    expect(storedUpdatedBlog.likes).toEqual(updatedBlog.likes);
  });

  test("updating a blog using an invalid id", async () => {
    const nonExistentId = "507f1f77bcf86cd799439011";
    const blogsBeforeUpdating = await helper.blogsStored();

    const updatedBlog = {
      title: "Updated Blog",
      author: "Updated Author",
      url: "https://example.com/updated",
      likes: 1,
    };

    await api.put(`/api/blogs/${nonExistentId}`).send(updatedBlog).expect(400);

    const blogsAfterUpdating = await helper.blogsStored();
    expect(blogsAfterUpdating).toHaveLength(blogsBeforeUpdating.length);

    const storedUpdatedBlog = blogsAfterUpdating.find((b) => b.id === nonExistentId);
    expect(storedUpdatedBlog).toBeUndefined();
  });
});

afterAll(async () => mongoose.connection.close());
