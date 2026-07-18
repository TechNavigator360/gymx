const jwt = require("jsonwebtoken");

// Middelware for protected routes.
// It checks the Authorization header, validates the JWT,
// and makes the authenticated user id available to the next layer.
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authentication token is required",
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication token is required",
        });
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = {
            id: decodedToken.userId,
        };

        next();        
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired authentication token",
        });
    }
};

module.exports = {
    authenticateToken,
};