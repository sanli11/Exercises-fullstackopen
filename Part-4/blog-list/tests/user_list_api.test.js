const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("./api_test_helper");
const User = require("../models/user");

beforeEach(async () => {
	await User.deleteMany({});

	for (const user of helper.initialUsers) {
		const userObject = new User(user);
		await userObject.save();
	}
}, 10000);

describe("There should be 2 users in the database", () => {
	test("There should be 2 users in the database", async () => {
		const users = await api.get("/api/users");
		expect(users.body).toHaveLength(helper.initialUsers.length);
	});
});

describe("Username should be more than 3 characters and unique", () => {
	test("Username should be more than 3 characters", async () => {
		const newUser = {
			username: "us",
			name: "User 3",
			password: "password3",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});

	test("Username should be unique", async () => {
		const newUser = {
			username: "user1",
			name: "User 3",
			password: "password3",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});
});

describe("Password should be more than 3 characters", () => {
	test("Password should be more than 3 characters", async () => {
		const newUser = {
			username: "user3",
			name: "User 3",
			password: "pa",
		};

		await api
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});
});

afterAll(async () => mongoose.connection.close());
