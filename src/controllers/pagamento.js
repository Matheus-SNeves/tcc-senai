const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const genericController = require('./genericController');

// Gera e exporta todas as funções CRUD para o modelo 'cliente'
module.exports = genericController(prisma.cliente);