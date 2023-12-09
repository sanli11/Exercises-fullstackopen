const express = require("express");
const morgan = require("morgan");

morgan.token("data", function (req, res) {
  return JSON.stringify(req.body);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const app = express();

app.use(express.static("dist"));
app.use(express.json());

app.use(morgan("tiny", { skip: (req, res) => req.method === "POST" }));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms {:data}",
    { skip: (req, res) => req.method !== "POST" }
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log("Deleting person with ID: ", id);

  persons = persons.filter((p) => p.id !== id);
  console.log("Person deleted with ID: ", id);

  res.status(204).end();
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

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
