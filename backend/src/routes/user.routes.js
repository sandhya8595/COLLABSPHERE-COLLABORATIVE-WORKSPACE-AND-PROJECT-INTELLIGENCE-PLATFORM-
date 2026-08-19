const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadAvatar } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.patch(
  '/me',
  [body('firstName').optional().trim().notEmpty(), body('jobTitle').optional().trim()],
  validate,
  userController.updateProfile
);

router.post('/me/avatar', uploadAvatar.single('avatar'), userController.uploadAvatar);

router.patch(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
  ],
  validate,
  userController.changePassword
);

router.delete('/me', userController.deactivateAccount);

router.get('/:id', userController.getUserById);

module.exports = router;
