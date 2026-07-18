const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/userRepository");
const { AppError } = require("../utils/appError.js")
const { ERROR_CODES } = require("../utils/errorCodes.js");

const SALT_ROUNDS = 10;

// The service layer contains business and security logic.
// The controller should only handle HTTP, while the service decides
// what is allowed and how registration should be processed.
const registerUser = async (email, password) => {
    if (!email || !password) {
        throw new AppError(ERROR_CODES.VALIDATION.MISSING_CREDENTIALS);
    }

    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
        throw new AppError(ERROR_CODES.RESOURCE.EMAIL_ALREADY_EXISTS);
    }

    // Passwords must never be stored as plain text.
    // bcrypt turns the password into a secure hash before saving it.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await userRepository.createUser(email, passwordHash);

    // Only return safe user data.
    // Never return the password hash to the client.
    return createdUser;

};

// Handles login and authentication logic.
// The service validates credentials and generates a JWT token.
const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new AppError(ERROR_CODES.VALIDATION.MISSING_CREDENTIALS);
    }

    const user = await userRepository.findUserWithPasswordByEmail(email);

    // Do not reveal whether the email or password was incorrect.
    // This prevents leaking authentication details to attackers.
    if (!user) {
        throw new AppError(ERROR_CODES.AUTHENTICATION.INVALID_CREDENTIALS);
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new AppError(ERROR_CODES.AUTHENTICATION.INVALID_CREDENTIALS);
    }

    // JWT contains the authenticated user identity.
    // The token can later be used to access protected endpoints. 
    const token = jwt.sign(
        {
            userId: user.id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};