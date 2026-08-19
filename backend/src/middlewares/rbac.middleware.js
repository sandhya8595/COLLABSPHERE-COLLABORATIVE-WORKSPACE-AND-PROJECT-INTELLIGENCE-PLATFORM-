const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');
const { Workspace } = require('../models');
const { ROLE_PERMISSIONS } = require('../config/constants');

/**
 * Loads the workspace membership for req.user and attaches req.workspaceRole.
 * Expects req.params.workspaceId (or req.body.workspaceId) to be present.
 */
const loadWorkspaceRole = catchAsync(async (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.body.workspaceId;
  if (!workspaceId) {
    throw new ApiError(400, 'workspaceId is required.');
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace || !workspace.isActive) {
    throw new ApiError(404, 'Workspace not found.');
  }

  const membership = workspace.members.find(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (!membership) {
    throw new ApiError(403, 'You are not a member of this workspace.');
  }

  req.workspace = workspace;
  req.workspaceRole = membership.role;
  next();
});

/**
 * Restricts access to specific workspace roles.
 * Usage: requireRole('workspace_admin', 'org_admin')
 */
const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.workspaceRole || !allowedRoles.includes(req.workspaceRole)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  next();
};

/**
 * Restricts access based on a specific permission derived from role.
 * Usage: requirePermission('manage_projects')
 */
const requirePermission = (permission) => (req, res, next) => {
  const permissions = ROLE_PERMISSIONS[req.workspaceRole] || [];
  if (!permissions.includes(permission)) {
    return next(new ApiError(403, `Missing required permission: ${permission}`));
  }
  next();
};

module.exports = { loadWorkspaceRole, requireRole, requirePermission };
