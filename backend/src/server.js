const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./sockets');
const { startNotificationScheduler } = require('./jobs/notificationQueue');
const env = require('./config/env');
const logger = require('./utils/logger');

const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);

  const io = initSocket(httpServer);
  app.set('io', io); // accessible in controllers via req.app.get('io')

  startNotificationScheduler();

  httpServer.listen(env.PORT, () => {
    logger.info(`CollabSphere API running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });

  process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    httpServer.close(() => process.exit(1));
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully.');
    httpServer.close(() => process.exit(0));
  });
};

startServer();
