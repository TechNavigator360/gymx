const express = require("express");
const router = express.Router();

const weeklyGoalController = require("../controllers/weeklyGoalController");
const { authenticateToken } = require("../middleware/authMiddleware");

// All weekly goal endpoints are protected because weekly goals are user-specific.
router.get("/", authenticateToken, weeklyGoalController.getWeeklyGoal);

// POST creates the user's weekly goal for the first time.
router.post("/", authenticateToken, weeklyGoalController.createWeeklyGoal);

// PATCH updates the user's existing weekly goal.
router.patch("/", authenticateToken, weeklyGoalController.updateWeeklyGoal);

module.exports = router;