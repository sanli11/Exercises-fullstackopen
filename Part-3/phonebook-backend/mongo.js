const mongoose = require("mongoose");

if (process.argv.length < 3 || process.argv.length > 5) {
  console.log(
    "The arguments must contain the password and the person's name and number"
  );
  console.log("Hint: If any of the arguments contain spaces, use quotes");
  console.log("Usages:");
  console.log("=> node mongo.js <password> <name> <number>");
  console.log("=> node mongo.js <password>");

  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fatesinz1:${password}@cluster0.gieyyrz.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  console.log("Phonebook:");

  Person.find({}).then((result) => {
    result.forEach((p) => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
  });
} else {
  let name = process.argv[3];
  let number = process.argv[4];

  const newPerson = new Person({
    name: name,
    number: number,
  });

  newPerson.save().then((result) => {
    console.log(`Added ${result.name} number: ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
