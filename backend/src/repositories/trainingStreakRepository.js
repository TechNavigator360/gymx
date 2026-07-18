const prisma = require("../config/prisma");

// Finds the training streak that belongs to a specific user.
const findTrainingStreakByUserId = async (userId) => {
    return prisma.trainingStreak.findUnique({
        where: {
            user_id: userId,
        },
    });
};

// Creates the initial training streak record for a specific user.
const createTrainingStreak = async (userId) => {
    return prisma.trainingStreak.create({
        data: {
            user_id: userId,
        },
    });
};

// Updates the persisted streak state for a specific user.
const updateTrainingStreak = async (
    userId,
    currentStreak,
    lastEvaluatedWeek
) => {
    return prisma.trainingStreak.update({
        where: {
            user_id: userId,
        },
        data: {
            current_streak: currentStreak,
            last_evaluated_week: lastEvaluatedWeek,
        },
    });
};

module.exports = {
    findTrainingStreakByUserId,
    createTrainingStreak,
    updateTrainingStreak,
};