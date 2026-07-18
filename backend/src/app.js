const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const weeklyGoalRoutes = require("./routes/weeklyGoalRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

// Allow the backend API to receive requests from other applications or frontends
app.use(cors()); 

// Automatically convert incoming JSON request bodies into JavaScript objects
app.use(express.json());

// Simple endpoint used to check if the backend server is running correctly
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "GYMX backend is running"
    });
});

// All authentication-related endpoints will start with /api/auth
app.use("/api/auth", authRoutes);

// All session-related endpoints begin with /api/sessions
app.use("/api/sessions", sessionRoutes);

// All weekly goal-related endpoints begin with /api/weekly-goal
app.use("/api/weekly-goal", weeklyGoalRoutes);

// All progress-related endpoints begin with /api/progress
app.use("/api/progress", progressRoutes);

// Handles malformed JSON requests safely.
// Prevents Express from leaking stack traces and internal paths.
app.use((error, req, res, next) => {

    if (
        error instanceof SyntaxError &&
        error.status === 400 && 
        "body" in error
    ) {
        return res.status(400).json({
            message: "Invalid JSON format",
        });
    }

    next(error)
})

module.exports = app;