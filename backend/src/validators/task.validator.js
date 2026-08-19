const { body } = require('express-validator');
const { TASK_PRIORITY } = require('../config/constants');

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required.'),
  body('boardId').notEmpty().withMessage('boardId is required.'),
  body('columnId').notEmpty().withMessage('columnId is required.'),
  body('priority').optional().isIn(Object.values(TASK_PRIORITY)).withMessage('Invalid priority.'),
];

const moveTaskValidator = [
  body('destColumnId').notEmpty().withMessage('destColumnId is required.'),
  body('destIndex').isInt({ min: 0 }).withMessage('destIndex must be a non-negative integer.'),
];

module.exports = { createTaskValidator, moveTaskValidator };
