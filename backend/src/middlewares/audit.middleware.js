const { AuditLog } = require('../models');
const logger = require('../utils/logger');

/**
 * Attaches a req.audit(action, entityType, entityId, metadata) helper
 * that controllers can call after a successful mutation.
 */
const auditContext = (req, res, next) => {
  req.audit = async (action, entityType, entityId, metadata = {}) => {
    try {
      await AuditLog.create({
        user: req.user?._id,
        workspace: req.workspace?._id || req.body.workspaceId || req.params.workspaceId,
        action,
        entityType,
        entityId,
        metadata,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
    } catch (err) {
      logger.error(`Audit log failed: ${err.message}`);
    }
  };
  next();
};

module.exports = auditContext;
