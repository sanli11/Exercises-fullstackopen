const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

const router = require("express").Router();

const User = require("../models/user");

router.post("/", asyncHandler(async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });

	const isPasswordCorrect = user ? await bcrypt.compare(password, user.passwordHash) : false;

	if (!(user && isPasswordCorrect)) {
		return res.status(401).json({ error: "invalid username or password" });
	}

	const userForToken = {
		username: user.username,
		id: user._id,
	};

	// eslint-disable-next-line no-undef
	const token = jwt.sign(userForToken, process.env.SECRET);

	res.status(200).send({ token, username: user.username, name: user.name });
}));

module.exports = router;
