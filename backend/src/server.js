require('dotenv').config();
const app = require('./app');
const { PORT } = require('./config/env');
const logger = require('./utils/logger');
const prisma = require('./config/database');

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
});
