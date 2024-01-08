const router = require("express").Router();

const asyncHandler = require("express-async-handler");

const Blog = require("../models/blog");

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const blogs = await Blog.find({});
		res.json(blogs);
	}),
);

router.get(
	"/:id",
	asyncHandler(async (request, response) => {
		const { id } = request.params;

		const blog = await Blog.findById(id);
		response.json(blog);
	}),
);

router.post(
	"/",
	asyncHandler(async (request, response) => {
		const { title, author, url, likes } = request.body;

		if (!title || !url) {
			return response.status(400).end();
		}

		const blog = new Blog({
			title,
			author,
			url,
			likes: likes || 0,
		});

		const result = await blog.save();
		response.status(201).json(result);
	}),
);

router.delete(
	"/:id",
	asyncHandler(async (request, response) => {
		const { id } = request.params;

		await Blog.findByIdAndRemove(id);
		response.status(204).end();
	}),
);

router.put(
	"/:id",
	asyncHandler(async (request, response) => {
		const { id } = request.params;
		const { title, author, url, likes } = request.body;

		const updatedBlog = {
			title,
			author,
			url,
			likes,
		};

		const result = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });

		response.status(result ? 200 : 400).end();

		return result;
	}),
);

module.exports = router;
