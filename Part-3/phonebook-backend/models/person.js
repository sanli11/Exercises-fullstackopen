const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Error connecting to MongoDB:", error.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, "Number is required"],
    validate: {
      validator: (value) => {
        let regex = /^\d{2,3}-\d{5,}$/;
        return regex.test(value);
      },
      message: (props) => `${props.value} is not a valid number`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (doc, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
