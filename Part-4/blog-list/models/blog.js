const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
	title: String,
	author: String,
	url: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	likes: Number,
});

blogSchema.set("toJSON", {
	transform: (doc, obj) => {
		obj.id = obj._id.toString();

		// biome-ignore lint/performance/noDelete: deleting property not required after receiving object from database
		delete obj._id;
		// biome-ignore lint/performance/noDelete: deleting property not required after receiving object from database
		delete obj.__v;
	},
});

module.exports = mongoose.model("Blog", blogSchema);
