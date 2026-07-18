const { PrismaClient } = require("@prisma/client");

// Central Prisma client instance.
// This keeps database access consistent across the application.
const prisma = new PrismaClient();

module.exports = prisma;