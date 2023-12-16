const config = require("./utils/config");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blogs");

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use("/api/blogs", blogRouter);

app.listen(config.PORT, () =>
  logger.info(`Server running on port ${config.PORT}`)
);
