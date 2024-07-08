const Workout = require("../models/Workout");

module.exports.addWorkout = (req, res) => {
  return Workout.findOne({ name: req.body.name })
    .then((existingWorkout) => {
      if (existingWorkout) {
        return res.status(409).send({ error: "Workout already exists" });
      }

      let newWorkout = new Workout({
        userId: req.body.userId,
        name: req.body.name,
        duration: req.body.duration,
      });

      return newWorkout
        .save()
        .then((savedWorkout) => res.status(201).send({ workout: savedWorkout }))
        .catch((saveError) => {
          // the error message will be displayed in the terminal
          console.error("Error in saving the workout: ", saveError);

          // this will be sent as a response to the client
          return res.status(500).send({ error: "Failed to save the workout" });
        });
    })
    .catch((findError) => {
      // the error message will be displayed in the terminal
      console.error("Error in finding the workout: ", findError);

      // this will be sent as a response to the client
      res.status(500).send({ error: "Error in finding the workout" });
    });
};

// Get All Workouts
module.exports.getAllWorkouts = (req, res) => {
  return Workout.find({})
    .then((workouts) => {
      // added validation to check if there are courses saved in the database
      if (workouts.length > 0) {
        return res.status(200).send({ workouts });
      } else {
        return res.status(200).send({ message: "No workouts found." });
      }
    })
    .catch((findErr) => {
      // SEPARATION OF ERROR LOGGING
      console.error("Error in finding the workouts: ", findErr);
      res.status(500).send({ error: "Error getting the workouts" });
    });
};

// Update a workouts
module.exports.updateWorkout = (req, res) => {
  let userId = req.params.userId;
  let updatedWorkout = {
    userId: req.body.userId,
    name: req.body.name,
    duration: req.body.duration,
    status: req.body.status,
  };

  return Workout.findByIdAndUpdate(userId, updatedWorkout, { new: true })
    .then((updatedWorkout) => {
      if (updatedWorkout) {
        res.status(200).send({
          message: "Workouts updated successfully",
          updatedWorkout: updatedWorkout,
        });
      } else {
        res.status(404).send({ error: "Workout not found" });
      }
    })
    .catch((updateErr) => {
      console.error("Error in updating the workouts: ", updateErr);
      return res.status(500).send({ error: "Error in updating the workout" });
    });
};

// Delete Workout

module.exports.deleteWorkout = (req, res) => {
  const workoutId = req.params.workoutId;

  return Workout.deleteOne({ _id: workoutId })
    .then((deleted) => {
      if (deleted) {
        res
          .status(200)
          .send({ message: "Workout deleted successfully", deleted: deleted });
      } else {
        res.status(500).send("Deleting workout failed");
      }
    })
    .catch((findErr) => {
      console.error("Error to deleting workout: ", findErr);
      return res.status(500).send({ error: "Failed to delete workout." });
    });
};
