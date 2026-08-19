const express = require('express');
const { body } = require('express-validator');
const orgController = require('../controllers/organization.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Organization name is required.')],
  validate,
  orgController.createOrganization
);

router.get('/', orgController.getMyOrganizations);
router.get('/:id', orgController.getOrganizationById);
router.patch('/:id', orgController.updateOrganization);

router.post(
  '/:id/members',
  [body('userId').notEmpty().withMessage('userId is required.')],
  validate,
  orgController.addMember
);
router.delete('/:id/members/:userId', orgController.removeMember);

module.exports = router;
