const { body } = require('express-validator');

const createFolderValidator = [
  body('name').trim().notEmpty().withMessage('Folder name is required.'),
  body('workspaceId').notEmpty().withMessage('workspaceId is required.'),
];

module.exports = { createFolderValidator };
