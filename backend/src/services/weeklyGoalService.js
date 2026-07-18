const weeklyGoalRepository = require("../repositories/weeklyGoalRepository");

const { AppError } = require("../utils/appError");
const { ERROR_CODES } = require("../utils/errorCodes");

// Validation helper
// Weekly goals must be positive whole numbers between 1 and 7.
const validateTargetSessions = (targetSessions) => {
    if (
        !Number.isInteger(targetSessions) ||
        targetSessions < 1 ||
        targetSessions > 7
    ) {
        throw new AppError(
            ERROR_CODES.VALIDATION.INVALID_TARGET_SESSIONS
        );
    }
};

// Returns the weekly goal that belongs to the authenticated user.
const getWeeklyGoalByUserId = (userId) => {
    return weeklyGoalRepository.findWeeklyGoalByUserId(userId);
};

// Creates a new weekly goal for the authenticated user.
const createWeeklyGoal = async (userId, targetSessions) => {
    validateTargetSessions(targetSessions);

    // A user may only have one weekly goal.
    const existingGoal = await weeklyGoalRepository.findWeeklyGoalByUserId(
        userId
    ); 

    if (existingGoal) {
        throw new AppError(
            ERROR_CODES.RESOURCE.WEEKLY_GOAL_ALREADY_EXISTS
        );
    }

    return weeklyGoalRepository.createWeeklyGoal(
        userId,
        targetSessions,
    );
};

// Updates the authenticated user's existing weekly goal.
const updateWeeklyGoal = async (userId, targetSessions) => {
    validateTargetSessions(targetSessions);
    
    // Weekly goal must exist before it can be updated.
    const existingGoal = await weeklyGoalRepository.findWeeklyGoalByUserId(
        userId
    );

    if (!existingGoal) {
        throw new AppError(
            ERROR_CODES.RESOURCE.WEEKLY_GOAL_NOT_FOUND
        );
    }

    return weeklyGoalRepository.updateWeeklyGoal(
        userId,
        targetSessions,
    );
};

module.exports = {
    getWeeklyGoalByUserId,
    createWeeklyGoal,
    updateWeeklyGoal,
};