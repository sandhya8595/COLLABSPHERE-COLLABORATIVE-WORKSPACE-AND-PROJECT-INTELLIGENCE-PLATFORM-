const { body } = require('express-validator');

const createDocumentValidator = [
  body('title').trim().notEmpty().withMessage('Document title is required.'),
  body('workspaceId').notEmpty().withMessage('workspaceId is required.'),
];

module.exports = { createDocumentValidator };
