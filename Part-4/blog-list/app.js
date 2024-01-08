const config = require("./utils/config");
const logger = require("./utils/logger");
const middleWare = require("./utils/middleware");

const userRouter = require("./controllers/users");
const blogRouter = require("./controllers/blogs");

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoUrl = config.MONGODB_URI;

mongoose
	.connect(mongoUrl)
	.then(() => logger.info("Connected to MongoDB"))
	.catch((error) =>
		logger.error("Error connecting to MongoDB:", error.message),
	);

app.use(middleWare.requestLogger);

app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);

app.use(middleWare.unknownEndpoint);
app.use(middleWare.errorHandler);

module.exports = app;
