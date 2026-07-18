const progressService = require("../services/progressService");

const { ERROR_CODES } = require("../utils/errorCodes");

// Returns the authenticated user's current weekly progress.
const getCurrentWeekProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const progress = await progressService.getCurrentWeekProgress(userId);

        return res.status(200).json(progress);

    } catch (error) {
        if (error.code === ERROR_CODES.RESOURCE.WEEKLY_GOAL_NOT_FOUND) {
            return res.status(404).json({
                message: "Weekly goal not found",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

module.exports = {
    getCurrentWeekProgress,
};
