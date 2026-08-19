const { body } = require('express-validator');

const createWorkspaceValidator = [
  body('name').trim().notEmpty().withMessage('Workspace name is required.'),
  body('organizationId').notEmpty().withMessage('organizationId is required.'),
];

const inviteMemberValidator = [
  body('email').isEmail().withMessage('A valid email is required.'),
  body('role')
    .optional()
    .isIn(['workspace_admin', 'project_manager', 'member', 'guest'])
    .withMessage('Invalid role.'),
];

module.exports = { createWorkspaceValidator, inviteMemberValidator };
