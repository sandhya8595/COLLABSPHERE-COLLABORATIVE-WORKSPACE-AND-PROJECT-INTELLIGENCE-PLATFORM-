const express = require('express');
const { body } = require('express-validator');
const chatController = require('../controllers/chat.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [body('workspaceId').notEmpty().withMessage('workspaceId is required.')],
  validate,
  chatController.createChat
);
router.get('/', chatController.getMyChats);
router.get('/:chatId/messages', chatController.getMessageHistory);
router.get('/messages/:messageId/thread', chatController.getThreadReplies);
router.delete('/messages/:messageId', chatController.deleteMessage);
router.post('/messages/:messageId/delete-for-me', chatController.deleteMessageForMe);
router.post('/:chatId/clear-for-me', chatController.clearChatForMe);

module.exports = router;
