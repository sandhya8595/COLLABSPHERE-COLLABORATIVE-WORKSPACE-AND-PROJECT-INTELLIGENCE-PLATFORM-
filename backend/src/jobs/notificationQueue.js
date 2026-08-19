/**
 * Scheduled job that scans for tasks due soon and pushes due-date
 * reminder notifications. Runs on a simple setInterval loop — no Redis
 * or external scheduler required. For multi-instance deployments,
 * guard this with a Mongo-based lock or move to a dedicated worker.
 */
const { Task, Notification } = require('../models');
const { pushNotification } = require('../sockets/notification.socket');
const { NOTIFICATION_TYPES } = require('../config/constants');
const logger = require('../utils/logger');

const CHECK_INTERVAL_MS = 60 * 60 * 1000; // hourly

const checkDueDateReminders = async () => {
  try {
    const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const now = new Date();

    const dueSoonTasks = await Task.find({
      dueDate: { $gte: now, $lte: in24h },
      isArchived: false,
    }).populate('assignees', '_id');

    for (const task of dueSoonTasks) {
      for (const assignee of task.assignees) {
        // Avoid duplicate reminders for the same task/user within 24h
        const alreadySent = await Notification.findOne({
          recipient: assignee._id,
          type: NOTIFICATION_TYPES.DUE_DATE_REMINDER,
          entityId: task._id,
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });
        if (alreadySent) continue;

        await pushNotification({
          recipient: assignee._id,
          type: NOTIFICATION_TYPES.DUE_DATE_REMINDER,
          title: `"${task.title}" is due soon`,
          message: `This task is due on ${task.dueDate.toLocaleDateString()}.`,
          entityType: 'Task',
          entityId: task._id,
        });
      }
    }

    if (dueSoonTasks.length > 0) {
      logger.info(`Due-date reminder check sent notifications for ${dueSoonTasks.length} task(s).`);
    }
  } catch (err) {
    logger.error(`Due-date reminder job failed: ${err.message}`);
  }
};

const startNotificationScheduler = () => {
  setInterval(checkDueDateReminders, CHECK_INTERVAL_MS);
  logger.info('Notification scheduler started (hourly due-date reminder check).');
};

module.exports = { startNotificationScheduler, checkDueDateReminders };
