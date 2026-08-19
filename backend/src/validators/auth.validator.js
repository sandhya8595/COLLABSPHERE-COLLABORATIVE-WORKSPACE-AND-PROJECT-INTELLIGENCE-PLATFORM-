const { body } = require('express-validator');

const signupValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').optional().trim(),
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
];

const loginValidator = [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const forgotPasswordValidator = [
  body('email').isEmail().withMessage('A valid email is required.').normalizeEmail(),
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
];

module.exports = {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
