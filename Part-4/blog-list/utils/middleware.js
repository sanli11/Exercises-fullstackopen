/* eslint-disable indent */
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info(
    `Method: ${request.method} - Path: ${request.path} - Body: ${request.body}`
  );
  next();
};

const unknownEndpoint = (request, response) => {
  logger.error("Unknown endpoint");

  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "Mal-formatted ID" });

    case "ValidationError":
      return response.status(400).send({ error: error.message });
  }

  next(error);
};

module.exports = { requestLogger, unknownEndpoint, errorHandler };
