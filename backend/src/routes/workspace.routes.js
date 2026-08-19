const express = require('express');
const { body } = require('express-validator');
const workspaceController = require('../controllers/workspace.controller');
const { protect } = require('../middlewares/auth.middleware');
const { loadWorkspaceRole, requireRole } = require('../middlewares/rbac.middleware');
const validate = require('../middlewares/validate.middleware');
const { createWorkspaceValidator, inviteMemberValidator } = require('../validators/workspace.validator');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.use(protect);

router.post('/', createWorkspaceValidator, validate, workspaceController.createWorkspace);
router.post('/join', workspaceController.joinWorkspace);
router.get('/', workspaceController.getMyWorkspaces);

// Routes below require workspace membership (loadWorkspaceRole reads :workspaceId)
router.get('/:workspaceId', loadWorkspaceRole, workspaceController.getWorkspaceById);
router.get('/:workspaceId/dashboard', loadWorkspaceRole, workspaceController.getDashboardSummary);

router.patch(
  '/:workspaceId',
  loadWorkspaceRole,
  requireRole(ROLES.WORKSPACE_ADMIN, ROLES.ORG_ADMIN, ROLES.SUPER_ADMIN),
  workspaceController.updateWorkspace
);

router.delete(
  '/:workspaceId',
  loadWorkspaceRole,
  requireRole(ROLES.WORKSPACE_ADMIN, ROLES.ORG_ADMIN, ROLES.SUPER_ADMIN),
  workspaceController.deleteWorkspace
);

router.post(
  '/:workspaceId/invite',
  loadWorkspaceRole,
  requireRole(ROLES.WORKSPACE_ADMIN, ROLES.ORG_ADMIN, ROLES.SUPER_ADMIN, ROLES.PROJECT_MANAGER),
  inviteMemberValidator,
  validate,
  workspaceController.inviteMember
);

router.delete(
  '/:workspaceId/members/:userId',
  loadWorkspaceRole,
  requireRole(ROLES.WORKSPACE_ADMIN, ROLES.ORG_ADMIN, ROLES.SUPER_ADMIN),
  workspaceController.removeMember
);

router.patch(
  '/:workspaceId/members/:userId/role',
  loadWorkspaceRole,
  requireRole(ROLES.WORKSPACE_ADMIN, ROLES.ORG_ADMIN, ROLES.SUPER_ADMIN),
  [body('role').isIn(Object.values(ROLES)).withMessage('Invalid role.')],
  validate,
  workspaceController.updateMemberRole
);

module.exports = router;
