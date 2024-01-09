const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		// The required and minLength properties are omitted since the the model
		// verifies the constraints and throws an error if they are not met.
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();

		// biome-ignore lint/performance/noDelete: deleting property not required after receiving object from database
		delete returnedObject._id;
		// biome-ignore lint/performance/noDelete: deleting property not required after receiving object from database
		delete returnedObject.__v;
		// biome-ignore lint/performance/noDelete: deleting property not required after receiving object from database
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
