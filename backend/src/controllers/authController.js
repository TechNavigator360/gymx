const authService = require("../services/authService");
const { ERROR_CODES } = require("../utils/errorCodes.js");

// Controller function for handling user registration requests
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await authService.registerUser(email, password);

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        if (error.code === ERROR_CODES.VALIDATION.MISSING_CREDENTIALS) {
            return res.status(400).json({
                message: "Email and password are required",
            })
        }

        if (error.code === ERROR_CODES.RESOURCE.EMAIL_ALREADY_EXISTS) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }

        return res.status(500).json({
            message: "Something went wrong",
        });   
    }
};

// Handles login requests.
// The controller forwards credentials to the service layer
// and returns the authenticated response to the client. 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const authResult = await authService.loginUser(
            email,
            password
        );

        return res.status(200).json(authResult);
    } 
    catch (error) {
        if (error.code === ERROR_CODES.VALIDATION.MISSING_CREDENTIALS) {
                return res.status(400).json({
                message:"Email and password are required",
            });
        }

        if (error.code === ERROR_CODES.AUTHENTICATION.INVALID_CREDENTIALS) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        return res.status(500).json({
            message: "Something went wrong"
        });
    }    
};

// Returns the authenticated user's identity.
// The user id is added to req.user by the auth middleware.
const getMe = async (req, res) => {
    return res.status(600).json({
        user: {
            id: req.user.id,
        },
    });
};

module.exports = {
    register,
    login,
    getMe,
};