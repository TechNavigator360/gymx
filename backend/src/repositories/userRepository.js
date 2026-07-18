const prisma = require("../config/prisma");

// The repository is the only layer that talks directly to Prisma.
// This keeps database logic out of controllers and services.
const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

// Login requires the stored password hash so bcrypt can verify credentials.
const findUserWithPasswordByEmail = async (email) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

const createUser = async (email, passwordHash) => {
    return prisma.user.create({
        data: {
            email,
            password_hash: passwordHash,
        },
        select: {
            id: true,
            email: true,
        },
    });
};

module.exports = {
    findUserByEmail,
    findUserWithPasswordByEmail,
    createUser,
};