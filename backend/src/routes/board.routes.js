const express = require('express');
const { body } = require('express-validator');
const boardController = require('../controllers/board.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.get('/:boardId', boardController.getBoardWithTasks);

router.post(
  '/:boardId/columns',
  [body('name').trim().notEmpty().withMessage('Column name is required.')],
  validate,
  boardController.createColumn
);

router.patch('/columns/:columnId', boardController.updateColumn);
router.delete('/columns/:columnId', boardController.deleteColumn);

module.exports = router;
