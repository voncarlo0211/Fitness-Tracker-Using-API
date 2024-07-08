const express = require("express");
const userController = require("../controllers/userController");
const { verify, isLoggedIn } = require("../auth");
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
module.exports = router;
