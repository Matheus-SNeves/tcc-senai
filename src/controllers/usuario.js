const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const genericController = require('./genericController');

module.exports = genericController(prisma.usuario);