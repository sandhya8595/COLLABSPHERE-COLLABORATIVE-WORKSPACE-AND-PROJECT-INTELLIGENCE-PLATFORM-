const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { loadWorkspaceRole, requirePermission } = require('../middlewares/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

const router = express.Router();

router.use(protect);

router.get(
  '/:workspaceId/overview',
  loadWorkspaceRole,
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  analyticsController.getOverview
);
router.get(
  '/:workspaceId/task-completion',
  loadWorkspaceRole,
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  analyticsController.getTaskCompletionTrend
);
router.get(
  '/:workspaceId/team-workload',
  loadWorkspaceRole,
  requirePermission(PERMISSIONS.VIEW_ANALYTICS),
  analyticsController.getTeamWorkload
);

module.exports = router;
