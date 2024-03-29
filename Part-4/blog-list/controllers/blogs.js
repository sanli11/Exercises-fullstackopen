const router = require("express").Router();

const asyncHandler = require("express-async-handler");

const middleWare = require("../utils/middleware");

const Blog = require("../models/blog");

router.get(
	"/",
	asyncHandler(async (req, res) => {
		const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
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
	middleWare.userExtractor,
	asyncHandler(async (request, response) => {
		const { title, author, url, likes } = request.body;
		const user = request.user;

		if (!title || !url) {
			return response.status(400).end();
		}

		const blog = new Blog({
			title,
			author,
			url,
			likes: likes || 0,
			user: user.id,
		});

		const result = await blog.save();

		user.blogs = user.blogs.concat(result.id);
		await user.save();

		response.status(201).json(result);
	}),
);

router.delete(
	"/:id",
	middleWare.userExtractor,
	asyncHandler(async (request, response) => {
		const blogId = request.params.id;
		const user = request.user;
		const blog = await Blog.findById(blogId);

		if (!user) {
			return response.status(401).json({ error: "user not found" });
		} else if (user.id.toString() !== blog.user.toString()) {
			return response.status(401).json({ error: "user not authorized" });
		}

		await Blog.findByIdAndRemove(blogId);
		response.status(204).send({ message: "blog deleted" });
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
