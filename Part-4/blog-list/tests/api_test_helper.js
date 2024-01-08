const User = require("../models/user");
const Blog = require("../models/blog");

const initialUsers = [
	{
		username: "user1",
		name: "User 1",
		password: "password1",
	},
	{
		username: "user2",
		name: "User 2",
		password: "password2",
	},
];

const initialBlogs = [
	{
		title: "Blog Number 1",
		author: "Author 1",
		url: "https://example.com/1",
		likes: 1,
	},
	{
		title: "Blog Number 2",
		author: "Author 2",
		url: "https://example.com/2",
		likes: 2,
	},
	{
		title: "Blog Number 3",
		author: "Author 3",
		url: "https://example.com/3",
		likes: 3,
	},
];

const usersStored = async () => {
	const users = await User.find({});
	return users.map((u) => u.toJSON());
};

const blogsStored = async () => {
	const blogs = await Blog.find({});
	return blogs.map((b) => b.toJSON());
};

module.exports = { initialUsers, initialBlogs, usersStored, blogsStored };
