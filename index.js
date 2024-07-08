const express = require("express");
const mongoose = require("mongoose");
// const cors = require("cors");

const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");

// SERVER SETUP
const app = express();
const port = 4000;

// Middle Ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connects our applicaion to our database
mongoose.connect(
  "mongodb+srv://admin:admin1234@vondb.rdyxmaz.mongodb.net/fitnessTracker?retryWrites=true&w=majority&appName=vonDB"
);

let db = mongoose.connection;

// failed connection
db.on("error", console.error.bind(console, "connection error"));
// successful connection
db.once("open", () => console.log(`We're now connected to MongoDb Atlas`));

app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || port, () =>
    console.log(`API is now online on port ${process.env.PORT || port}`)
  );
}

module.exports = { app, mongoose };
