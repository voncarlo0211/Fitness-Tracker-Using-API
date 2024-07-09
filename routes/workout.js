const express = require("express");
const workoutController = require("../controllers/workoutController");
const { verify, isLoggedIn } = require("../auth");
const router = express.Router();

router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getMyWorkOuts", verify, workoutController.getAllWorkouts);
// router.patch("/updateWorkout/:userId", verify, workoutController.updateWorkout);
router.patch(
  "/updateWorkout/:workoutId",
  verify,
  workoutController.updateWorkout
);
router.patch(
  "/completeWorkoutStatus/:workoutId",
  verify,
  workoutController.updateWorkout
);
router.delete(
  "/deleteWorkout/:workoutId",
  verify,
  workoutController.deleteWorkout
);

module.exports = router;
