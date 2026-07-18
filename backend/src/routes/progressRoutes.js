const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progressController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Gets the authenticated user's current weekly progress.
router.get("/current-week", authenticateToken, progressController.getCurrentWeekProgress);

module.exports = router;