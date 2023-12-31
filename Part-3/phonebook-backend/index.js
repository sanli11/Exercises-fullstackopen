/*
    The Commented sections were in use before implementing MongoDB/Mongoose
*/
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("data", function (req) {
  return JSON.stringify(req.body);
});

const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use(morgan("tiny", { skip: (req) => req.method === "POST" }));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms {:data}",
    { skip: (req) => req.method !== "POST" }
  )
);

/*
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456", },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523", },
  { id: 3, name: "Dan Abramov", number: "12-43-234345", },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122", },
];
/*
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456", },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523", },
  { id: 3, name: "Dan Abramov", number: "12-43-234345", },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122", },
];

const generateId = () => {
  let maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};
const generateId = () => {
  let maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return maxId + 1;
};

app.get("/info", (req, res) => {
  console.log("Showing information about the phonebook");
  let date = new Date();
  // Using string literals to display on multiple lines
  let content = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>`;
  res.send(content);
});

app.get("/api/persons", (req, res) => {
  console.log("Showing all persons");
  res.send(persons);
});

app.get("/api/persons/:id", (req, res) => {
  let id = Number(req.params.id);
  let person = persons.find((p) => p.id === id);
  if (person) {
    console.log(`Showing person with id ${id}:`, person);
    res.json(person);
  } else {
    console.log(`Person with id ${id} not found`);
    res.status(404).send(`Person with id ${id} not found`);
  }
});

app.post("/api/persons", (req, res) => {
  const personInfo = req.body;
  if (!personInfo.name) {
    console.log("Name for person is required");
    return res.status(400).json({ error: "Name for person is required" });
  } else if (!personInfo.number) {
    console.log("Number for person is required");
    return res.status(400).json({ error: "Number for person is required" });
  } else if (persons.find((p) => p.name === personInfo.name)) {
    console.log(
      "A person with the name already exists in the phonebook. Each name must be unique"
    );
    return res.status(400).json({ error: "name must be unique" });
  }
  const newPerson = {
    id: generateId(),
    name: personInfo.name,
    number: personInfo.number,
  };
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log("Deleting person with ID: ", id);
  persons = persons.filter((p) => p.id !== id);
  console.log("Person deleted with ID: ", id);
  res.status(204).end();
});
*/

app.get("/info", (req, res) => {
  Person.countDocuments({}).then((count) => {
    let docs = count;
    let date = new Date();
    let content = `<p>Phonebook has info for ${docs} people</p>
  <p>${date}</p>`;

    res.send(content);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((p) => res.json(p));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((p) => res.json(p))
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const personInfo = req.body;

  if (!personInfo.name) {
    console.log("Name for person is required");
    return res.status(400).json({ error: "Name for person is required" });
  } else if (!personInfo.number) {
    console.log("Number for person is required");
    return res.status(400).json({ error: "Number for person is required" });
  }

  const person = new Person({
    name: personInfo.name,
    number: personInfo.number,
  });

  person.validateSync();

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    // .catch((error) => {
    //   console.log("Error occurred", error.message);
    //   return res.status(400).send({ error: "Mal-formatted ID" });
    // });
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = { _id: req.params.id };
  const { name, number } = req.body;

  Person.schema.path("name").validate(function (value) {
    return value.length >= 3;
  }, "Name should contain at least 3 characters");

  Person.schema.path("number").validate(function (value) {
    return value.length >= 8;
  }, "Number should be at least 8 characters long");
  Person.schema.path("number").validate(function (value) {
    let regex = /^\d{2,3}-\d{5,}$/;
    return regex.test(value);
  }, "Number should be in the format 123-4567890");

  Person.findOneAndUpdate(
    id,
    { name, number },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((updatedPerson) => res.json(updatedPerson))
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "Mal-formatted ID" });
  } else if (err.name === "ValidationError") {
    return res.status(400).send({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
