const Workout = require("../models/Workout");
const { verify } = require("../auth"); // Import verifyOwnership middleware

// Add Workout
module.exports.addWorkout = (req, res) => {
  const { userId, name, duration } = req.body;

  // Ensure the user creating the workout is the authenticated user
  if (userId !== req.user.id) {
    return res.status(403).send({
      error: "You are not authorized to create a workout for another user",
    });
  }

  Workout.findOne({ name })
    .then((existingWorkout) => {
      if (existingWorkout) {
        return res.status(409).send({ error: "Workout already exists" });
      }

      const newWorkout = new Workout({
        userId,
        name,
        duration,
      });

      return newWorkout
        .save()
        .then((savedWorkout) => res.status(201).send({ workout: savedWorkout }))
        .catch((saveError) =>
          res.status(500).send({ error: "Failed to save the workout" })
        );
    })
    .catch((findError) =>
      res.status(500).send({ error: "Error finding the workout" })
    );
};

// Update a Workout
module.exports.updateWorkout = (req, res) => {
  const workoutId = req.params.workoutId;
  const { userId, name, duration, status } = req.body;

  // Verify ownership before updating
  Workout.findOne({ _id: workoutId })
    .then((workout) => {
      if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }

      if (workout.userId !== req.user.id) {
        return res
          .status(403)
          .send({ error: "You are not authorized to update this workout" });
      }

      // Update the workout
      return Workout.findByIdAndUpdate(
        workoutId,
        { userId, name, duration, status },
        { new: true }
      )
        .then((updatedWorkout) => {
          if (!updatedWorkout) {
            return res.status(404).send({ error: "Workout not found" });
          }

          res.status(200).send({
            message: "Workout updated successfully",
            updatedWorkout: updatedWorkout,
          });
        })
        .catch((updateErr) =>
          res.status(500).send({ error: "Error updating the workout" })
        );
    })
    .catch((findError) =>
      res.status(500).send({ error: "Error finding the workout" })
    );
};

// Delete a Workout
module.exports.deleteWorkout = (req, res) => {
  const workoutId = req.params.workoutId;

  // Verify ownership before deleting
  Workout.findOne({ _id: workoutId })
    .then((workout) => {
      if (!workout) {
        return res.status(404).send({ error: "Workout not found" });
      }

      if (workout.userId !== req.user.id) {
        return res
          .status(403)
          .send({ error: "You are not authorized to delete this workout" });
      }

      // Delete the workout
      return Workout.deleteOne({ _id: workoutId })
        .then((deleted) => {
          if (deleted) {
            res.status(200).send({
              message: "Workout deleted successfully",
              deleted: deleted,
            });
          } else {
            res.status(500).send({ error: "Failed to delete workout" });
          }
        })
        .catch((deleteErr) =>
          res.status(500).send({ error: "Error deleting the workout" })
        );
    })
    .catch((findError) =>
      res.status(500).send({ error: "Error finding the workout" })
    );
};

// Get All Workouts (No changes needed if each request is filtered by userId in middleware)
module.exports.getAllWorkouts = (req, res) => {
  Workout.find({ userId: req.user.id }) // Filter by authenticated userId
    .then((workouts) => {
      if (workouts.length > 0) {
        res.status(200).send({ workouts });
      } else {
        res.status(200).send({ message: "No workouts found" });
      }
    })
    .catch((findError) =>
      res.status(500).send({ error: "Error getting the workouts" })
    );
};
