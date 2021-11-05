const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info'],
  errorFormat: 'pretty',
});

module.exports = prisma;