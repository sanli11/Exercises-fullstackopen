const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoUrl = process.env.MONGODB_URI;

mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message));

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (doc, obj) => {
    obj.id = obj._id.toString();

    delete obj._id;
    delete obj.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
