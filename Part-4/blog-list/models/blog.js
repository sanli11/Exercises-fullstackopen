const config = require("../utils/config");
const logger = require("../utils/logger");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoUrl = config.MONGODB_URI;

mongoose
  .connect(mongoUrl)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) =>
    logger.error("Error connecting to MongoDB:", error.message)
  );

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
