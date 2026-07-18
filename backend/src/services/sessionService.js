const sessionRepository = require("../repositories/sessionRepository");
const { getCurrentWeekRange } = require("../utils/dateUtils");
const { AppError } = require("../utils/appError");
const { ERROR_CODES } = require("../utils/errorCodes");

// Service layer for training session business logic.
// This layer will later handle validation, ownership rules and session-related logic.

// Session lookup helper
const getOwnedSessionOrThrow = async (sessionId, userId) => {
    const session = await sessionRepository.findSessionById(sessionId);

    // Check if the training session exists
    if (!session) {
        throw new AppError(ERROR_CODES.RESOURCE.SESSION_NOT_FOUND);
    }

    // Enforce ownership
    if (session.user_id !== userId) {
        throw new AppError(ERROR_CODES.AUTHORIZATION.FORBIDDEN);
    }

    return session;
};

const createSession = async (userId, sessionData) => {
    // Date is required.
    if (!sessionData.date) {
        throw new AppError(ERROR_CODES.VALIDATION.INVALID_DATE);
    }

    // Validate date format.
    const parsedDate = new Date(sessionData.date);

    if (isNaN(parsedDate.getTime())) {
        throw new AppError(ERROR_CODES.VALIDATION.INVALID_DATE);
    }

    const newSession = {
        userId,
        date: parsedDate,
    };

    return await sessionRepository.createSession(newSession);
};

const getSessions = async (userId, week) => {
    const weekFilter = week?.trim().toLowerCase();

    if (weekFilter && weekFilter !== "current") {
        throw new AppError(ERROR_CODES.VALIDATION.INVALID_WEEK_FILTER);
    }
    
    let startDate = null;
    let endDate = null;

    if (weekFilter === "current") {
        const currentWeekRange = getCurrentWeekRange();

        startDate = currentWeekRange.startDate;
        endDate = currentWeekRange.endDate;
    }

    return sessionRepository.findSessionsByUserId(
        userId,
        startDate,
        endDate
    );
};

const getSessionById = async (sessionId, userId) => {
    return getOwnedSessionOrThrow(sessionId, userId);
};

const deleteSession = async (sessionId, userId) => {
    await getOwnedSessionOrThrow(sessionId, userId);

    // Delete only after existance and ownership are confirmed
    await sessionRepository.deleteSessionById(sessionId);
};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    deleteSession,
};