const express = require('express');
const { body } = require('express-validator');
const taskController = require('../controllers/task.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createTaskValidator, moveTaskValidator } = require('../validators/task.validator');

const router = express.Router();

router.use(protect);

router.post('/', createTaskValidator, validate, taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
router.patch('/:id/move', moveTaskValidator, validate, taskController.moveTask);

router.post(
  '/:id/checklist',
  [body('text').trim().notEmpty().withMessage('Checklist item text is required.')],
  validate,
  taskController.addChecklistItem
);
router.patch('/:id/checklist/:itemId', taskController.toggleChecklistItem);

router.post(
  '/:id/comments',
  [body('content').trim().notEmpty().withMessage('Comment content is required.')],
  validate,
  taskController.addComment
);

module.exports = router;
