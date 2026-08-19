const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const organizationRoutes = require('./organization.routes');
const workspaceRoutes = require('./workspace.routes');
const projectRoutes = require('./project.routes');
const boardRoutes = require('./board.routes');
const taskRoutes = require('./task.routes');
const documentRoutes = require('./document.routes');
const chatRoutes = require('./chat.routes');
const fileRoutes = require('./file.routes');
const notificationRoutes = require('./notification.routes');
const searchRoutes = require('./search.routes');
const analyticsRoutes = require('./analytics.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/projects', projectRoutes);
router.use('/boards', boardRoutes);
router.use('/tasks', taskRoutes);
router.use('/documents', documentRoutes);
router.use('/chats', chatRoutes);
router.use('/files', fileRoutes);
router.use('/notifications', notificationRoutes);
router.use('/search', searchRoutes);
router.use('/analytics', analyticsRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'CollabSphere API is running.' });
});

module.exports = router;
