const prisma = require("../config/prisma");

// Finds the weekly goal that belongs to a specific user.
const findWeeklyGoalByUserId = async (userId) => {
    return prisma.weeklyGoal.findUnique({
        where: {
            user_id: userId,
        },
    });
};

// Creates a weekly goal for a specific user.
const createWeeklyGoal = async (userId, targetSessions) => {
    return prisma.weeklyGoal.create({
        data: {
            user_id: userId,
            target_sessions: targetSessions,
        },
    });
};

// Updates the weekly goal that belongs to a specific user.
const updateWeeklyGoal = async (userId, targetSessions) => {
    return prisma.weeklyGoal.update({
        where: {
            user_id: userId,
        },
        data: {
            target_sessions: targetSessions,
        },
    });
};

module.exports = {
    findWeeklyGoalByUserId,
    createWeeklyGoal,
    updateWeeklyGoal,
};