const sessionService = require("../services/sessionService");
const { ERROR_CODES } = require("../utils/errorCodes");

const createSession = async (req, res) => {
    try {
        // User identity comes from the JWT middleware.
        const userId = req.user.id;
        // Request body contains session input data.
        const sessionData = req.body;

        const result = await sessionService.createSession(
        userId, 
        sessionData
        );

        return res.status(201).json(result);
    }
    catch (error) {
        if (error.code === ERROR_CODES.VALIDATION.INVALID_DATE) {
            return res.status(400).json({
                message: "Invalid training session date",
            });
        }

        return res.status(500).json({
            message: "Something went wrong while creating the training session"
        });
    }
};

// Returns authenticated user's sessions this week
const getSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const week = req.query.week;

        const sessions = await sessionService.getSessions(userId, week);

        return res.status(200).json(sessions);
    }
    catch (error) {
        if (error.code === ERROR_CODES.VALIDATION.INVALID_WEEK_FILTER) {
            return res.status(400).json({
                message: "Invalid week filter",
            });
        }
        
        return res.status(500).json({
            message: "Something went wrong while retrieving training sessions",
        });
    }
};

// Returns authenticated user's session by session id.
const getSessionById = async (req, res) => {
    try {
        const sessionId = parseInt(req.params.id);

        // Validate session id
        if (isNaN(sessionId)) {
            return res.status(400).json({
                message: "Invalid session id",
            });
        }

        const userId = req.user.id;

        const session = await sessionService.getSessionById(
            sessionId,
            userId
        );
    
        return res.status(200).json(session);
    }
    catch (error) {
        if (error.code === ERROR_CODES.RESOURCE.SESSION_NOT_FOUND) {
            return res.status(404).json({
                message: "Training session not found",
            });
        }
        
        if (error.code === ERROR_CODES.AUTHORIZATION.FORBIDDEN) {
            return res.status(403).json({
                message: "You are not allowed to access this training session",
            });
        }

        return res.status(500).json({
            message: "Something went wrong while retrieving the training session"
        });
    }
};

const deleteSession = async (req, res) => {
    try {
        // Get session id from route parameter
        const sessionId = parseInt(req.params.id);

        // Validate session id
        if (isNaN(sessionId)) {
            return res.status(400).json({
                message: "Invalid session id",
            });
        }

        // Logged-in user id from JWT middleware
        const userId = req.user.id;

        // Delegate business logic to service layer
        await sessionService.deleteSession(sessionId, userId);

        // Successful deletion returns 204 with no response body
        return res.status(204).send();
    }
    catch (error) {

        // Session does not exist
        if (error.code == ERROR_CODES.RESOURCE.SESSION_NOT_FOUND) {
            return res.status(404).json({
                message: "Training session not found",
            });
        }

        // Session belongs to another user
        if (error.code === ERROR_CODES.AUTHORIZATION.FORBIDDEN) {
            return res.status(403).json({
                message: "You are not allowed to delete this training session",
            });
        }

        // Generic server error
        return res.status(500).json({
            message: "Something went wrong while deleting the training session",
        });
    }

};

module.exports = {
    createSession,
    getSessions,
    getSessionById,
    deleteSession,
};