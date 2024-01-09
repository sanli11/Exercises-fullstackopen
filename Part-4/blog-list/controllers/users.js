const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const router = require("express").Router();

const User = require("../models/user");

router.get("/", async (req, res) => {
	const users = await User.find({}).populate("blogs", { title: 1, author: 1 , url: 1});

	res.json(users);
});

router.post(
	"/",
	asyncHandler(async (req, res) => {
		const { username, name, password } = req.body;

		if (!password || password.length < 3) {
			return res
				.status(400)
				.send({ error: "Password must be at least 3 characters long" });
		}

		if (!username || username.length < 3) {
			return res
				.status(400)
				.send({ error: "Username must be at least 3 characters long" });
		}

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const newUser = new User({
			username,
			name,
			passwordHash,
		});

		const savedUser = await newUser.save();

		res.status(201).json(savedUser);
	}),
);

module.exports = router;
